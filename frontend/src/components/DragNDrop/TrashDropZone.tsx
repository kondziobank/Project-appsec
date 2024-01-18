import React from "react";
import classNames from "classnames";
import { useDrop } from "react-dnd";
import { COMPONENT, ROW, COLUMN } from "../../constants/constants";

const ACCEPTS = [ROW, COLUMN, COMPONENT];

interface ITrashDropZone {
  data: any;
  onDrop: any;
}

const TrashDropZone = (props: ITrashDropZone) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ACCEPTS,
    drop: (item: any, monitor) => {
      props.onDrop(props.data, item);
    },
    canDrop: (item, monitor) => {
      const layout = props.data.layout;
      const itemPath = item.path;
      const splitItemPath = itemPath.split("-");
      const itemPathRowIndex = splitItemPath[0];
      const itemRowChildrenLength =
        layout[itemPathRowIndex] && layout[itemPathRowIndex].children.length;

      // prevent removing a col when row has only one col
      if (
        item.type === COLUMN &&
        itemRowChildrenLength &&
        itemRowChildrenLength < 2
      ) {
        return false;
      }

      return true;
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;
  return (
    <div
      className={classNames("trashDropZone", { active: isActive })}
      ref={drop}
    >
      <i className="dripicons-trash"></i>
    </div>
  );
};
export default TrashDropZone;
