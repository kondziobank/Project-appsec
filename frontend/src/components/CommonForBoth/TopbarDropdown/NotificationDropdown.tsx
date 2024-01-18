import { useEffect, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";
import { withTranslation } from "react-i18next";
import NotificationTile from "./NotificationTile";
import NotificationsCount from "./NotificationsCount";
import { getNotifications } from "src/helpers/api_helper";
import AllNotificationsList from "./AllNotificationsList";
import { markNotificationRead } from "src/helpers/api_helper";


function arrayRemove<T>(array: T[], index: number) {
  return [
    ...array.slice(0, index),
    ...array.slice(index + 1),
  ]
}

const NotificationDropdown = (props: any) => {
  const [isOpen, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!isOpen);

  const [displayAllNotificationsList, setDisplayAllNotificationsList] = useState(false);
  const toggleDisplayAllNotificationsList = () => setDisplayAllNotificationsList(!displayAllNotificationsList);

  const [notifications, setNotifications] = useState<any>([]);
  useEffect(() => {
    // Fetch notifications on begin and after each modal close
    if (!displayAllNotificationsList) {
      getNotifications(false)
        .then(n => setNotifications(n));
    }
  }, [displayAllNotificationsList]);

  async function handleMarkingNotificationRead(index: number) {
    await markNotificationRead(notifications[index].notification._id, true);
    setNotifications(arrayRemove(notifications, index));
  }

  return (
    <>
      <Dropdown
        isOpen={isOpen}
        toggle={toggleOpen}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon position-relative"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <NotificationsCount count={notifications.length} />
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0"> {props.t("Notifications")} </h6>
              </Col>
              <div className="col-auto">
                <Link to="#" className="small" onClick={toggleDisplayAllNotificationsList}>
                  {props.t("View all")}
                </Link>
              </div>
            </Row>
          </div>

          <SimpleBar style={{ maxHeight: "230px" }}>
            {notifications.map((notification: any, index: number) => (
              <NotificationTile
                notification={notification}
                key={index}
                onClick={() => handleMarkingNotificationRead(index)}
              />
            ))}
            {notifications.length === 0
              ? <small style={{ display: 'block', textAlign: 'center', padding: '5px', fontStyle: 'italic' }}>{props.t('notification_dropdown.no_notifications')}</small>
              : null}
          </SimpleBar>

          <div className="p-2 border-top d-grid">
            <Link
              className="btn btn-sm btn-link font-size-14 btn-block text-center"
              to="#"
              onClick={toggleDisplayAllNotificationsList}
            >
              <i className="mdi mdi-arrow-right-circle me-1" />
              {" "}
              {props.t("View all")}
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>

      {displayAllNotificationsList ? (
        <AllNotificationsList
          onClose={toggleDisplayAllNotificationsList}
        />
      ) : null}
    </>
  );
};

export default withTranslation()(withRouter(NotificationDropdown));
