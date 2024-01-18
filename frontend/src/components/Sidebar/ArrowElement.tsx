import React from "react";
import { withTranslation } from "react-i18next";

interface IArrowElement {
  component: any;
  children: any;
}

const ArrowElement = (props: IArrowElement) => {
  return (
    <React.Fragment>
      <li className="sidebar__arrowElement" style={{ padding: '2px 0'}}>
        <props.component />
        <div style={{ marginLeft: '15px' }}>
          {props.children}
        </div>
      </li>
    </React.Fragment>
  );
};

export default withTranslation()(ArrowElement);
