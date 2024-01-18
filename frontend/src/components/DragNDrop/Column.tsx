import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { COLUMN } from "../../constants/constants";
import DropZone from "./DropZone";
import Component from "./Component";
import { useSelector } from "react-redux";

const style = {};

interface IColumn {
  data: any;
  components: any;
  handleDrop: void;
  path: string;
  config: any;
  onConfigUpdate: any;
  onConfigInit: any;
  onRemove: any;
}

const Column = (props: IColumn) => {
  const isEditMode = useSelector((state: any) => state.Layout.isEditMode);
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: COLUMN,
    item: {
      type: COLUMN,
      id: props.data.id,
      children: props.data.children,
      path: props.path,
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: (monitor) => isEditMode
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const renderComponent = (component: any, currentPath: any) => {
    return (
      <Component
        key={component.id}
        data={component}
        components={props.components}
        path={currentPath}
        config={props.config[component.id] ?? null}
        onConfigUpdate={props.onConfigUpdate}
        onConfigInit={props.onConfigInit}
        onRemove={props.onRemove}
      />
    );
  };

  return (
    <div
      ref={ref}
      style={{ ...style, opacity, cursor: isEditMode ? 'pointer' : 'default' }}
      className="base draggable column"
    >
      {props.data.children.map((component: any, index: any) => {
        const currentPath = `${props.path}-${index}`;

        return (
          <React.Fragment key={component.id}>
            {renderComponent(component, currentPath)}
          </React.Fragment>
        );
      })}
    </div>
  );
};
export default Column;
