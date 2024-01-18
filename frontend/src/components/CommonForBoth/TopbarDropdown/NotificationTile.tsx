import moment from "moment";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";

interface INotificationTile {
  notification: any;
  t: any;
  onClick(): any;
}

const NotificationTile = (props: INotificationTile) => {
  const { notification, read } = props.notification;
  const { content, sender, createdAt } = notification;
  const timeDiff = moment(createdAt).fromNow()

  return (
    <div
      className="text-reset notification-item"
      style={{ fontStyle: read ? 'italic' : 'normal', opacity: read ? 0.5 : 1 }}
      onClick={props.onClick}
    >
      <div className="d-flex">
        <img
          src={sender.avatarUrl}
          className="me-3 rounded-circle avatar-sm"
          alt="user-pic"
        />
        <div className="flex-grow-1">
          <h6 className="mt-0 mb-1">{sender.name}</h6>
          <div className="font-size-12 text-muted">
            <p className="mb-1">
              {content}
            </p>
            <p className="mb-0">
              <i className="mdi mdi-clock-outline" />
              {" "}
              <span title={createdAt}>{timeDiff}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(NotificationTile);
