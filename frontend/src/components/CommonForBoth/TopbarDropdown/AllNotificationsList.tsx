import { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { FormGroup, Label, Input } from 'reactstrap';
import ConfigurationModal from 'src/components/Common/ConfigurationModal';
import { getNotifications, markNotificationRead } from 'src/helpers/api_helper';
import NotificationTile from './NotificationTile';

function arrayUpdateElement<T>(array: T[], index: number, callback: (elem: T) => T) {
  return [
    ...array.slice(0, index),
    callback(array[index]),
    ...array.slice(index + 1)
  ]
}

interface IAllNotificationsList {
  onClose(): any;
  t: any;
}

const AllNotificationsList = (props: IAllNotificationsList) => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState<any[]>([]);
  const toggleNotificationRead = (id: string) => {
    const index = notifications.findIndex(n => n.notification._id === id);
    markNotificationRead(id, !notifications[index].read);
    setNotifications(arrayUpdateElement(
      notifications,
      index,
      n => ({ ...n, read: !n.read })
    ));
  }

  const filteredNotifications = (() => {
    if (filter === 'all') {
      return notifications;
    }

    const readValue = filter === 'read';
    return notifications.filter(n => n.read === readValue);
  })();

  useEffect(() => {
    getNotifications().then(n => setNotifications(n));
  }, []);

  return (
    <ConfigurationModal
      title={props.t('All notifications list')}
      onCancel={props.onClose}
      cancelCaption={props.t('Close')}
    >
      <FormGroup>
        <Label>
          {props.t('notifications_list.show')}:
        </Label>
        <Input type="select" bsSize="sm" onChange={e => setFilter(e.target.value)} value={filter}>
          <option value="all">{props.t('notifications_list.all_notifications')}</option>
          <option value="read">{props.t('notifications_list.read')}</option>
          <option value="unread">{props.t('notifications_list.unread')}</option>
        </Input>
      </FormGroup>

      {filteredNotifications.map((n: any, index: number) => (
        <NotificationTile
          notification={n}
          key={n.notification._id}
          onClick={() => toggleNotificationRead(n.notification._id)}
        />
      ))}
    </ConfigurationModal>
  )
}

export default withTranslation()(AllNotificationsList);
