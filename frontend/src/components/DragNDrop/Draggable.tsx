import React from "react";
import { withTranslation } from "react-i18next";
import { useDrag } from "react-dnd";
import { SIDEBAR_ITEM } from "src/constants/constants";
import { useSelector } from "react-redux";

interface IDraggable {
  className?: string;
  iconName: any;
  text: string;
  t: any;
  children?: any;
  data: any;
}

const Draggable = (props: IDraggable) => {
  const isEditMode = useSelector((state: any) => state.Layout.isEditMode);

  const [{ opacity }, drag] = useDrag({
    type: SIDEBAR_ITEM,
    item: props.data,
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
    canDrag: monitor => isEditMode,
  });

  return (
    <React.Fragment>
      <div className={props.className} ref={drag} style={{ opacity, padding: '2px 0' }}>
        <span>{props.text}</span>
      </div>
      {props.children}
    </React.Fragment>
  );
};

export default withTranslation()(Draggable);
