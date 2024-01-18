import { withTranslation } from "react-i18next";
interface IDirectElement {
  component: any;
}

const DirectElement = (props: IDirectElement) => {
  return (
    <li className="section__container" style={{ padding: '2px 0'}}>
      <props.component />
    </li>
  );
};

export default withTranslation()(DirectElement);
