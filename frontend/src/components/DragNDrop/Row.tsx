import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { ROW } from "../../constants/constants";
import DropZone from "./DropZone";
import Column from "./Column";
import { useSelector } from "react-redux";

const style = {};

interface IRow {
  data: any;
  components: any;
  handleDrop: any;
  path: string;
  config: any;
  onConfigUpdate: any;
  onConfigInit: any;
  onRemove: any;
}

const Row = (props: IRow) => {
  const isEditMode = useSelector((state: any) => state.Layout.isEditMode);
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ROW,
    item: {
      type: ROW,
      id: props.data.id,
      children: props.data.children,
      path: props.path,
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: monitor => isEditMode
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const renderColumn = (column: any, currentPath: any) => {
    return (
      <Column
        key={column.id}
        data={column}
        components={props.components}
        handleDrop={props.handleDrop}
        path={currentPath}
        config={props.config}
        onConfigUpdate={props.onConfigUpdate}
        onConfigInit={props.onConfigInit}
        onRemove={props.onRemove}
      />
    );
  };

  return (
    <div ref={ref} style={{ ...style, opacity, cursor: isEditMode ? 'pointer' : 'default' }} className="base draggable row">
      <div className="columns">
        {props.data.children.map((column: any, index: any) => {
          const currentPath = `${props.path}-${index}`;

          return (
            <React.Fragment key={column.id}>
              {true || isEditMode ? (
                <DropZone
                  data={{
                    path: currentPath,
                    childrenCount: props.data.children.length,
                  }}
                  onDrop={props.handleDrop}
                  className="horizontalDrag"
                />
              ) : null}
              {renderColumn(column, currentPath)}
            </React.Fragment>
          );
        })}
        {true || isEditMode ? (
          <DropZone
            data={{
              path: `${props.path}-${props.data.children.length}`,
              childrenCount: props.data.children.length,
            }}
            onDrop={props.handleDrop}
            className="horizontalDrag"
            isLast
          />
        ) : null}
      </div>
    </div>
  );
};
export default Row;
