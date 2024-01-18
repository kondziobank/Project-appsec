import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDrag } from "react-dnd";
import { widgets } from "src/constants/extensions";
import { COMPONENT } from "../../constants/constants";
import { withTranslation } from "react-i18next";
import Icon from "@ailibs/feather-react-ts";
import i18n from "src/i18n";

import {
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Col,
} from "reactstrap";

const style = {
  backgroundColor: "white",
  cursor: "move",
};

interface IComponent {
  data: any;
  components: any;
  path: string;
  t: any;
  config: any;
  onConfigUpdate: any;
  onConfigInit: any;
  onRemove: any;
}

const Component = (props: IComponent) => {
  const isEditMode = useSelector((state: any) => state.Layout.isEditMode)

  const [modal, setModal] = useState(false);
  function toggleModal() {
    setModal(!modal)
  }

  const ref = useRef(null);
  const item = { type: COMPONENT, id: props.data.id, path: props.path };

  const [{ isDragging }, drag] = useDrag({
    type: COMPONENT,
    item,
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: monitor => isEditMode,
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const component = props.components[props.data.id];
  const specific = component.content;

  const language: any = i18n.language
  const { layoutMode } = useSelector((state: any) => ({
    layoutMode: state.Layout.layoutModeprint
  }))

  const widgetObject = widgets[specific]({ lang: language, theme: layoutMode })

  const WidgetViewer = widgetObject.viewer;
  const WidgetConfigurator = widgetObject.configurator;

  function handleRemove() {
    props.onRemove(item);
  }

  const TrashButton = () => (
    <button className="tooltip-button" onClick={handleRemove}>
      <Icon name="trash-2" size={14} className="widget-tooltip-icon" />
    </button>
  )

  const EditButton = () => (
    <button className="tooltip-button" onClick={toggleModal}>
      <Icon name="edit-2" size={14} className="widget-tooltip-icon" />
    </button>
  )

  const ConfiguratorModal = () => (
    <Modal
      isOpen={modal}
      toggle={toggleModal}
      className={"modal-dialog-centered"}
      style={{ minWidth: "75vw", minHeight: "50vh" }}
    >
      <ModalHeader toggle={toggleModal} tag="h4">
        <h3>{props.t("Update Widget")}{' - '}{widgetObject.metadata.name}</h3>
      </ModalHeader>
      <ModalBody>
        <Row>
          <div className="modal-body">
            <WidgetConfigurator
              ref={configuratorRef}
              config={props.config}
            />
          </div>
        </Row>
        <Row>
          <Col>
            <div className="text-end">
              <button
                type="button"
                className="btn btn-light me-2"
                onClick={toggleModal}
              >
                {props.t("Close")}
              </button>
              <button
                type="submit"
                className="btn btn-success save-event"
                onClick={async () => {
                  const configurator: any = configuratorRef.current
                  if (configurator) {
                    try {
                      const currentConfig = await configurator.save();
                      props.onConfigUpdate(props.data.id, currentConfig)
                      toggleModal(); 
                    } catch (err) {
                    }
                  }
                }}
              >
                {props.t("Save")}
              </button>
            </div>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  )

  const configuratorRef = useRef(null);

  useEffect(() => {
    if (props.config == null) {
      props.onConfigInit(props.data.id, widgetObject.metadata.initialConfig);
    }
  }, []);

  if (props.config === null) {
    return null;
  }

  return (
    <div
      ref={ref}
      style={{ ...style, opacity, cursor: isEditMode ? 'pointer' : 'default' }}
      className={`component draggable`}
    >
      <div className={`widget-container${isEditMode ? ' widget-container-editable' : ''}`}>
        <WidgetViewer config={props.config} />
        {isEditMode ? (
          <div className="widget-tooltip">
            <div>{widgetObject.metadata.name}</div>
            <div>
              <TrashButton /> 
              {WidgetConfigurator != null ? <EditButton /> : null }
            </div>
          </div>
        ) : null}
      </div>

      {WidgetConfigurator != null ? (<ConfiguratorModal />) : null}
    </div>
  );
};

export default withTranslation()(Component);
