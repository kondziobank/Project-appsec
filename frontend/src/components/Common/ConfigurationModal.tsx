import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { withTranslation } from 'react-i18next'

interface IConfigurationModal {
  title: string;
  fullscreen?: boolean;
  children: any;
  actions?: any[];
  onSave?: () => any;
  onCancel?: () => any;
  t: any;
  saveCaption?: string;
  cancelCaption?: string;
}

const ConfigurationModal = (props: IConfigurationModal) => {
  const fullscreen = props.fullscreen ?? false;

  return (
    <Modal isOpen={true} toggle={props.onCancel} fullscreen={fullscreen}>
      <ModalHeader style={{ display: 'block' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>{props.title}</div>
          <div>{props.actions}</div>
        </div>
      </ModalHeader>
      <ModalBody>
        {props.children}
      </ModalBody>
      <ModalFooter>
        {props.onCancel !== undefined ? (
          <Button color="light" onClick={props.onCancel}>
            {props.cancelCaption ?? props.t('Cancel')}
          </Button>
        ) : null}
        {props.onSave !== undefined ? (
          <Button color="success" onClick={props.onSave}>
            {props.saveCaption ?? props.t('Save')}
          </Button>
        ) : null}
      </ModalFooter>
    </Modal>
  );
}

export default withTranslation()(ConfigurationModal);
