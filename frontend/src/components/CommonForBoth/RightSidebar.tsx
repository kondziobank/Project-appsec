import {
  changeLayout,
  changeLayoutWidth,
  changeLayoutPosition,
  changeTopbarTheme,
  changeSidebarType,
  changeSidebarTheme,
} from "../../store/actions";

//constants
import {
  layoutTypes,
  layoutTheme,
  layoutWidthTypes,
  layoutPositions,
  topBarThemeTypes,
  leftSidebarTypes,
  leftSideBarThemeTypes,
} from "../../constants/layout";

//SimpleBar
import SimpleBar from "simplebar-react";

import { Link } from "react-router-dom";

//redux
import { useSelector, useDispatch } from "react-redux";
import { withTranslation } from "react-i18next";

interface IRightSidebar {
  onClose: any;
  onChangeLayoutMode: any;
  t: any;
}

const RightSidebar = (props: IRightSidebar) => {
  const dispatch = useDispatch();
  const { onClose, onChangeLayoutMode } = props;

  const {
    layoutType,
    layoutMode,
    layoutWidth,
    layoutPosition,
    topbarTheme,
    leftSideBarType,
    leftSideBarTheme,
  } = useSelector((state: any) => ({
    layoutType: state.Layout.layoutType,
    layoutMode: state.Layout.layoutMode,
    layoutWidth: state.Layout.layoutWidth,
    layoutPosition: state.Layout.layoutPosition,
    topbarTheme: state.Layout.topbarTheme,
    leftSideBarType: state.Layout.leftSideBarType,
    leftSideBarTheme: state.Layout.leftSideBarTheme,
  }));

  // Light/dark mode
  const onChangeMode = (value: any) => {
    if (onChangeLayoutMode) {
      onChangeLayoutMode(value);
    }
  };

  return (
    <>
      <div className="right-bar">
        <SimpleBar style={{ height: "900px" }}>
          <div data-simplebar className="h-100">
            <div className="rightbar-title d-flex align-items-center bg-dark p-3">
              <h5 className="m-0 me-2 text-white">{props.t('right_sidebar.name')}</h5>
              <Link
                to="#"
                onClick={onClose}
                className="right-bar-toggle ms-auto"
              >
                <i className="mdi mdi-close noti-icon"></i>
              </Link>
            </div>

            <hr className="m-0" />

            <div className="p-4">
              <h6 className="mb-3 pt-2">{props.t('right_sidebar.theme')}</h6>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="radioThemeLight"
                  name="radioTheme"
                  value={layoutTheme.LIGHTMODE}
                  className="form-check-input"
                  checked={layoutMode === layoutTheme.LIGHTMODE}
                  onChange={e => {
                    onChangeMode(e.target.value);
                  }}
                />
                <label className="form-check-label" htmlFor="radioThemeLight">
                  {props.t('right_sidebar.light')}
                </label>
              </div>
              {"   "}
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="radioThemeDark"
                  name="radioTheme"
                  value={layoutTheme.DARKMODE}
                  className="form-check-input"
                  checked={layoutMode === layoutTheme.DARKMODE}
                  onChange={e => {
                    onChangeMode(e.target.value);
                  }}
                />
                <label className="form-check-label" htmlFor="radioThemeDark">
                  {props.t('right_sidebar.dark')}
                </label>
              </div>

              <h6 className="mt-4 mb-3">{props.t('right_sidebar.layout_width')}</h6>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="radioFluid"
                  name="radioWidth"
                  value={layoutWidthTypes.FLUID}
                  className="form-check-input"
                  checked={layoutWidth === layoutWidthTypes.FLUID}
                  onChange={e => {
                    if (e.target.checked) {
                      dispatch(changeLayoutWidth(e.target.value));
                    }
                  }}
                />
                <label htmlFor="radioFluid" className="form-check-label">
                  {props.t('right_sidebar.fluid')}
                </label>
              </div>
              {"   "}
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="radioBoxed"
                  name="radioWidth"
                  value={layoutWidthTypes.BOXED}
                  className="form-check-input"
                  checked={layoutWidth === layoutWidthTypes.BOXED}
                  onChange={e => {
                    if (e.target.checked) {
                      dispatch(changeLayoutWidth(e.target.value));
                    }
                  }}
                />
                <label htmlFor="radioBoxed" className="form-check-label">
                  {props.t('right_sidebar.boxed')}
                </label>
              </div>
              <h6 className="mt-4 mb-3">{props.t('right_sidebar.layout_position')}</h6>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="layout-position-fixed"
                  name="layout-position"
                  value={layoutPositions.SCROLLABLE_FALSE}
                  className="form-check-input"
                  checked={layoutPosition === layoutPositions.SCROLLABLE_FALSE}
                  onChange={e => {
                    if (e.target.checked) {
                      dispatch(changeLayoutPosition(e.target.value));
                    }
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor="layout-position-fixed"
                >
                  {props.t('right_sidebar.fixed')}
                </label>
              </div>

              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="layout-position-scrollable"
                  name="layout-position"
                  value={layoutPositions.SCROLLABLE_TRUE}
                  className="form-check-input"
                  checked={layoutPosition === layoutPositions.SCROLLABLE_TRUE}
                  onChange={e => {
                    if (e.target.checked) {
                      dispatch(changeLayoutPosition(e.target.value));
                    }
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor="layout-position-scrollable"
                >
                  {props.t('right_sidebar.scrollable')}
                </label>
              </div>

              <h6 className="mt-4 mb-3">{props.t('right_sidebar.topbar_color')}</h6>

              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="topbar-color-light"
                  name="topbar-color"
                  value={topBarThemeTypes.LIGHT}
                  className="form-check-input"
                  checked={topbarTheme === topBarThemeTypes.LIGHT}
                  onChange={e => {
                    if (e.target.checked) {
                      dispatch(changeTopbarTheme(e.target.value));
                    }
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor="topbar-color-light"
                >
                  {props.t('right_sidebar.light')}
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="topbar-color-dark"
                  name="topbar-color"
                  value={topBarThemeTypes.DARK}
                  className="form-check-input"
                  checked={topbarTheme === topBarThemeTypes.DARK}
                  onChange={e => {
                    if (e.target.checked) {
                      dispatch(changeTopbarTheme(e.target.value));
                    }
                  }}
                />
                <label className="form-check-label" htmlFor="topbar-color-dark">
                  {props.t('right_sidebar.dark')}
                </label>
              </div>
              {layoutType === "vertical" ? (
                <>
                  <h6 className="mt-4 mb-3 sidebar-setting">{props.t('right_sidebar.sidebar_size')}</h6>

                  <div className="form-check sidebar-setting">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sidebar-size"
                      id="sidebar-size-default"
                      value={leftSidebarTypes.DEFAULT}
                      checked={leftSideBarType === leftSidebarTypes.DEFAULT}
                      onChange={e => {
                        if (e.target.checked) {
                          dispatch(changeSidebarType(e.target.value));
                        }
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="sidebar-size-default"
                    >
                      {props.t('right_sidebar.default')}
                    </label>
                  </div>
                  <div className="form-check sidebar-setting">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sidebar-size"
                      id="sidebar-size-small"
                      value={leftSidebarTypes.ICON}
                      checked={leftSideBarType === leftSidebarTypes.ICON}
                      onChange={e => {
                        if (e.target.checked) {
                          dispatch(changeSidebarType(e.target.value));
                        }
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="sidebar-size-small"
                    >
                      {/*Small (Icon View)*/}
                      {props.t('right_sidebar.small_icon_view')}
                    </label>
                  </div>
                  <h6 className="mt-4 mb-3 sidebar-setting">{props.t('right_sidebar.sidebar_color')}</h6>

                  <div className="form-check sidebar-setting">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sidebar-color"
                      id="sidebar-color-light"
                      value={leftSideBarThemeTypes.LIGHT}
                      checked={leftSideBarTheme === leftSideBarThemeTypes.LIGHT}
                      onChange={e => {
                        if (e.target.checked) {
                          dispatch(changeSidebarTheme(e.target.value));
                        }
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="sidebar-color-light"
                    >
                      {props.t('right_sidebar.light')}
                    </label>
                  </div>
                  <div className="form-check sidebar-setting">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sidebar-color"
                      id="sidebar-color-dark"
                      value={leftSideBarThemeTypes.DARK}
                      checked={leftSideBarTheme === leftSideBarThemeTypes.DARK}
                      onChange={e => {
                        if (e.target.checked) {
                          dispatch(changeSidebarTheme(e.target.value));
                        }
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="sidebar-color-dark"
                    >
                      {props.t('right_sidebar.dark')}
                    </label>
                  </div>
                  <div className="form-check sidebar-setting">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sidebar-color"
                      id="sidebar-color-brand"
                      value={leftSideBarThemeTypes.COLORED}
                      checked={
                        leftSideBarTheme === leftSideBarThemeTypes.COLORED
                      }
                      onChange={e => {
                        if (e.target.checked) {
                          dispatch(changeSidebarTheme(e.target.value));
                        }
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="sidebar-color-brand"
                    >
                      {props.t('right_sidebar.brand')}
                    </label>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </SimpleBar>
      </div>
      <div className="rightbar-overlay" />
    </>
  );
};

export default withTranslation()(RightSidebar);
