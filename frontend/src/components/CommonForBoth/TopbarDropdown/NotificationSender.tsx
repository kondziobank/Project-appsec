import { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Alert, FormGroup, Input, Label } from 'reactstrap';
import ConfigurationModal from 'src/components/Common/ConfigurationModal';
import { getRoles, sendNotification } from 'src/helpers/api_helper';

interface IRoleEntry {
  name: string;
  onChange?: () => any;
}

const RoleEntry = (props: IRoleEntry) => {
  return (
    <FormGroup check style={{ flex: '50%' }}>
      <Label check>
        <Input type="checkbox" onChange={props.onChange} />
        {' '}
        {props.name}
      </Label>
    </FormGroup>
  );
}

interface INotificationSender {
  onClose(): any;
  t: any;
}

const NotificationSender = (props: INotificationSender) => {
  const [roles, setRoles] = useState<any>([]);
  const [recipients, setRecipients] = useState<any>({});
  const toggleRecipients = (id: string) => setRecipients({
    ...recipients,
    [id]: !(recipients[id] ?? false)
  })
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string|null>(null);

  useEffect(() => {
    getRoles().then(roles => setRoles(roles));
  }, []);

  async function validateAndSend() {
    setError(false);
    setMessage(null);

    const recipientsList = Object.entries(recipients)
      .filter(([_id, checked]) => checked)
      .map(([id, _checked]) => id);

    if (content.length === 0) {
      setError(true);
      setMessage(props.t('notification_sender.content_empty'));
      return;
    } else if (recipientsList.length === 0) {
      setError(true);
      setMessage(props.t('notification_sender.no_recipient'));
      return;
    }

    await sendNotification({ content, roles: recipientsList });

    setMessage(props.t('notification_sender.successfully_sent'));
    setTimeout(props.onClose, 1000);
  }

  return (
    <ConfigurationModal
      title={props.t('Notification Sender')}
      onCancel={props.onClose}
      onSave={validateAndSend}
      saveCaption={props.t('notification_sender.send')}
    >
      <FormGroup>
        <Label>{props.t('notification_sender.notification_content')}</Label>
        <Input type="textarea" value={content} onChange={e => setContent(e.target.value)} />
      </FormGroup>

      <FormGroup>
        <Label>
          {props.t('notification_sender.recipients')}
          <small style={{ display: 'block', fontWeight: 'normal' }}>
            {props.t('notification_sender.select_roles')}
          </small>
        </Label>

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {roles.map((role: any, index: number) => (
            <RoleEntry name={role.name} key={index} onChange={() => toggleRecipients(role._id)} />
          ))}
        </div>
      </FormGroup>

      {message !== null ? (
        <Alert color={error ? 'danger' : 'success'}>
          {message}
        </Alert>
      ) : null}
    </ConfigurationModal>
  )
}

export default withTranslation()(NotificationSender);
