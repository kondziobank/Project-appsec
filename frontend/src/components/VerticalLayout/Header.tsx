import React, { useState } from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import ReactDrawer from "react-drawer";
import "react-drawer/lib/react-drawer.css";

//Import Icons
import Icon from "@ailibs/feather-react-ts";

//import component
import RightSidebar from "../CommonForBoth/RightSidebar";
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";
import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown";
import LightDark from "../CommonForBoth/Menus/LightDark";
import SidebarEditable from "../CommonForBoth/Menus/SidebarEditable";
import SearchBar from "./SearchBar";

//redux
import { useSelector } from "react-redux";

const Header = (props: any) => {
  const { layoutMode } = useSelector((state: any) => ({
    layoutMode: state.Layout.layoutMode,
  }));

  const [search, setsearch] = useState<boolean>(false);
  const [isClick, setClick] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);

  /**
   * Rightsidebar drawer
   */
  const toggleTopDrawer = () => {
    setOpen(!open);
  };

  const onDrawerClose = () => {
    setOpen(false);
  };

  /*** Sidebar menu icon and default menu set */
  function tToggle() {
    var body = document.body;
    setClick(!isClick);
    if (isClick === true) {
      body.classList.add("sidebar-enable");
      document.body.setAttribute("data-sidebar-size", "sm");
    } else {
      body.classList.remove("sidebar-enable");
      document.body.setAttribute("data-sidebar-size", "lg");
    }
  }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src="/icons/logo-192.png" alt="" height="24" />
                </span>
                <span className="logo-lg">
                  <img src="/icons/logo-192.png" alt="" height="24" />{" "}
                  <span className="logo-txt">Web Crypto Center</span>
                </span>
              </Link>

              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src="/icons/logo-192.png" alt="" height="24" />
                </span>
                <span className="logo-lg">
                  <img src="/icons/logo-192.png" alt="" height="24" />{" "}
                  <span className="logo-txt">Web Crypto Center</span>
                </span>
              </Link>
            </div>

            <button
              onClick={() => {
                tToggle();
              }}
              type="button"
              className="btn btn-sm px-3 font-size-16 header-item"
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars"></i>
            </button>

            <SearchBar />
          </div>
          <div className="d-flex">
            <div className="dropdown d-inline-block d-lg-none ms-2">
              <button
                onClick={() => {
                  setsearch(!search);
                }}
                type="button"
                className="btn header-item noti-icon "
                id="page-header-search-dropdown"
              >
                <Icon name="search" className="icon-lg" />
              </button>
              <div
                className={
                  search
                    ? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
                    : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                }
                aria-labelledby="page-header-search-dropdown"
              >
                <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={props.t("Search...")}
                        aria-label="Recipient's username"
                      />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">
                          <i className="mdi mdi-magnify" />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <LanguageDropdown />

            <SidebarEditable layoutMode={layoutMode} />

            {/* light / dark mode */}
            <LightDark
              layoutMode={layoutMode}
              onChangeLayoutMode={props.onChangeLayoutMode}
            />

            <NotificationDropdown />

            <div
              onClick={() => toggleTopDrawer()}
              className="dropdown d-inline-block"
            >
              <button
                type="button"
                className="btn header-item noti-icon right-bar-toggle"
              >
                <Icon name="settings" className="icon-lg" />
              </button>
            </div>
            <ProfileMenu />
          </div>
        </div>
      </header>
      <ReactDrawer open={open} onClose={onDrawerClose} direction="right">
        <RightSidebar
          onClose={onDrawerClose}
          onChangeLayoutMode={props.onChangeLayoutMode}
        />
      </ReactDrawer>
    </React.Fragment>
  );
};

export default withTranslation()(Header);
