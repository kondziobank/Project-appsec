import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { withTranslation } from "react-i18next";
import { withRouter, Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "src/store/actions";
import UserProfile from './UserProfile'
import UsersManager from './UsersManager'
import NotificationSender from "./NotificationSender";


const ProfileMenu = (props: any) => {
  const dispatch = useDispatch();
  const [menu, setMenu] = useState<boolean>(false);

  const [displayUsersManager, setDisplayUsersManager] = useState<boolean>(false);
  const toggleDisplayUsersManager = () => setDisplayUsersManager(!displayUsersManager);

  const [displayUserProfile, setDisplayUserProfile] = useState<boolean>(false);
  const toggleDisplayUserProfile = () => setDisplayUserProfile(!displayUserProfile);

  const [displayNotificationSender, setDisplayNotificationSender] = useState<boolean>(false);
  const toggleDisplayNotificationSender = () => setDisplayNotificationSender(!displayNotificationSender);

  const userInfo = useSelector((state: any) => state.auth.user);

  function handleLogout(event: any) {
    event.preventDefault();
    dispatch(logoutUser(props.history));
  }

  if (!userInfo) {
    return null;
  }

  const { avatarUrl, name } = userInfo;

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item bg-soft-light border-start border-end"
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={avatarUrl}
            alt="Header Avatar"
          />
          <span className="d-none d-xl-inline-block ms-2 me-1">{name}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem onClick={toggleDisplayUserProfile}>
            <i className="bx bx-user font-size-16 align-middle me-1" />
            {props.t("User Profile")}
          </DropdownItem>

          {userInfo.role.permissions.includes('users.read')
            ? (
              <DropdownItem onClick={toggleDisplayUsersManager}>
                <i className="bx bx-user font-size-16 align-middle me-1" />
                {props.t("Users Manager")}
              </DropdownItem>
            )
            : null
          }

          {userInfo.role.permissions.includes('notifications.send')
            ? (
              <DropdownItem onClick={toggleDisplayNotificationSender}>
                <i className="bx bx-chat font-size-16 align-middle me-1" />
                {props.t("Notification Sender")}
              </DropdownItem>
            )
            : null
          }

          <div className="dropdown-divider" />
          <Link to="/#" onClick={handleLogout} className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span>{props.t("Logout")}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>

      {displayUserProfile ? <UserProfile onClose={toggleDisplayUserProfile} /> : null}
      {displayUsersManager ? <UsersManager onClose={toggleDisplayUsersManager} /> : null}
      {displayNotificationSender ? <NotificationSender onClose={toggleDisplayNotificationSender} /> : null}
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
};

export default withTranslation()(withRouter(ProfileMenu));
