import React, { useState, useRef, useCallback, useEffect } from "react";
import Row from "./Row";
import DropZone from "src/components/DragNDrop/DropZone";
import TrashDropZone from "src/components/DragNDrop/TrashDropZone";

import { SIDEBAR_ITEM, COMPONENT, COLUMN } from "src/constants/constants";
import shortid from "shortid";

import {
  handleMoveWithinParent,
  handleMoveToDifferentParent,
  handleMoveSidebarComponentIntoParent,
  handleRemoveItemFromLayout,
} from "src/components/DragNDrop/helpers";
import { useSelector } from "react-redux";

interface IDroppable {
  board: any;
  onBoardUpdate(board: any): any;
}

const Droppable = (props: IDroppable) => {
  const isMounted = useRef(false);

  const isEditMode = useSelector((state: any) => state.Layout.isEditMode);
  const [layout, setLayout] = useState<any>([]);
  const [components, setComponents] = useState<any>({});
  const [widgetConfigs, setWidgetConfigs] = useState<{ [key: string]: any }>({});

  const [updated, setUpdated] = useState(0);
  const markUpdated = () => setUpdated(updated + 1);

  function onConfigInit(id: any, config: any) {
    setWidgetConfigs({
      ...widgetConfigs,
      [id]: config
    });
  }

  function onWidgetConfigUpdate(id: any, config: any) {
    setWidgetConfigs({
      ...widgetConfigs,
      [id]: config
    })
    markUpdated();
  }

  function getBoardJson() {
    return {
      rows: layout.map((row: any) => ({
        columns: row.children.map((column: any) => {
          const { id } = column.children[0]
          const widgetName = components[id].content
          const widgetConfig = widgetConfigs[id]

          return {
            widget: widgetName,
            config: widgetConfig
          }
        })
      }))
    }
  }

  useEffect(() => {
    const data = JSON.parse(props.board.content);
    const dataWithIds = data?.rows?.map((row: any) => ({
      id: shortid.generate(),
      children: row?.columns.map((widget: any) => ({
        id: shortid.generate(),
        children: [{
          id: shortid.generate(),
          widget
        }]
      }))
    })) ?? [];

    const widgetsMapping = dataWithIds.map(
      (row: any) => row.children.map(
        (column: any) => column.children[0]
      ).flat()
    ).flat().map((el: any) => [el.id, el.widget]);


    setComponents(Object.fromEntries(widgetsMapping.map((el: any) => [
      el[0],
      {
        id: el[0],
        content: el[1].widget
      }
    ])))

    setWidgetConfigs(Object.fromEntries(widgetsMapping.map((el: any) => [
      el[0],
      el[1].config
    ])))

    setLayout(dataWithIds.map((row: any) => ({
      type: 'row',
      id: row.id,
      children: row.children.map((column: any) => ({
        type: 'column',
        id: column.id,
        children: [{
          type: 'component',
          id: column.children[0].id
        }]
      }))
    })))
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      props.onBoardUpdate({
        ...props.board,
        content: JSON.stringify(getBoardJson())
      });
    } else {
      isMounted.current = true;
    }
  }, [updated]);

  const handleDrop = useCallback(
    (dropZone, item) => {
      const splitDropZonePath = dropZone.path.split("-");
      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");

      const newItem: any = { id: item.id, type: item.type };
      if (item.type === COLUMN) {
        newItem.children = item.children;
      }

      // sidebar into
      if (item.type === SIDEBAR_ITEM) {
        // 1. Move sidebar item into page
        const newComponent = {
          id: shortid.generate(),
          ...item.component,
        };
        const newItem = {
          id: newComponent.id,
          type: COMPONENT,
        };
        setComponents({
          ...components,
          [newComponent.id]: newComponent,
        });
        setLayout(
          handleMoveSidebarComponentIntoParent(
            layout,
            splitDropZonePath,
            newItem
          )
        );
        markUpdated();
        return;
      }

      // move down here since sidebar items dont have path
      const splitItemPath = item.path.split("-");
      const pathToColumn = splitItemPath.slice(0, -1);
      const pathToItem = pathToColumn.join("-");

      // 2. Pure move (no create)
      if (splitItemPath.length === splitDropZonePath.length) {
        // 2.a. move within parent
        if (pathToItem === pathToDropZone) {
          setLayout(
            handleMoveWithinParent(layout, splitDropZonePath, pathToColumn)
          );
          markUpdated();
          return;
        }

        // 2.b. OR move different parent
        setLayout(
          handleMoveToDifferentParent(
            layout,
            splitDropZonePath,
            pathToColumn,
            newItem
          )
        );
        markUpdated();
        return;
      }

      // 3. Move + Create
      setLayout(
        handleMoveToDifferentParent(
          layout,
          splitDropZonePath,
          pathToColumn,
          newItem
        )
      );
      markUpdated();
    },
    [layout, components]
  );

  const renderRow = (row: any, currentPath: any) => {
    return (
      <Row
        key={row.id}
        data={row}
        handleDrop={handleDrop}
        components={components}
        path={currentPath}
        config={widgetConfigs}
        onConfigUpdate={onWidgetConfigUpdate}
        onConfigInit={onConfigInit}
        onRemove={removeItem}
      />
    );
  };

  const handleDropToTrashBin = useCallback(
    (dropZone, item) => {
      const splitItemPath = item.path.split("-").slice(0, -1);
      setLayout(handleRemoveItemFromLayout(layout, splitItemPath));
      markUpdated();
    },
    [layout]
  );

  const removeItem = (item: any) => {
    const splitItemPath = item.path.split("-").slice(0, -1);
    setLayout(handleRemoveItemFromLayout(layout, splitItemPath));
    markUpdated();
  }

  return (
    <div className="pageContainer">
      <div className="page">
        {layout.map((row: any, index: any) => {
          const currentPath = `${index}`;

          return (
            <React.Fragment key={row.id}>
              {true || isEditMode ? (
                <DropZone
                  data={{
                    path: currentPath,
                    childrenCount: layout.length,
                  }}
                  onDrop={handleDrop}
                  path={currentPath}
                />
              ) : null}
              {renderRow(row, currentPath)}
            </React.Fragment>
          );
        })}
        {true || isEditMode ? (
          <DropZone
            data={{
              path: `${layout.length}`,
              childrenCount: layout.length,
            }}
            onDrop={handleDrop}
            isLast
          />
        ) : null}
      </div>
      {isEditMode ? (
        <TrashDropZone
          data={{
            layout,
          }}
          onDrop={handleDropToTrashBin}
        />
      ) : null }
    </div>
  );
};

export default Droppable;
