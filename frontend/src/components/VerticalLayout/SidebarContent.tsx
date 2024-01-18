import React, { useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

//i18n
import { withTranslation } from "react-i18next";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter, useHistory } from "react-router-dom";
import { RouteComponentProps } from 'react-router';
import Draggable from "../DragNDrop/Draggable";

import { widgets, categories } from "../../constants/extensions";
import { Link } from 'react-router-dom'
import Header from "../Sidebar/Header";
import TableOfContents from "../Sidebar/TableOfContents";

import { SIDEBAR_ITEM } from "src/constants/constants";
import i18n from "src/i18n";
import Icon from "@ailibs/feather-react-ts/dist/Icon";

export const getWidgetsToc = (props: any) => {
  const language: any = i18n.language
  const { layoutMode } = useSelector((state: any) => ({
    layoutMode: state.Layout.layoutMode,
  }));

  const mappedCategories = Object.entries(categories).map(([categoryId, category]) => [
    categoryId,
    category({ theme: layoutMode, lang: language })
  ]);

  const mappedWidgets = Object.entries(widgets).map(([widgetId, widget]) => [
    widgetId,
    widget({ theme: layoutMode, lang: language })
  ]);

  const toc = {
    name: 'Widgety',
    children: mappedCategories.map(([categoryId, category]) => ({
      name: category.metadata.name,
      children: mappedWidgets
        .filter(([_, widget]) => widget.metadata.category.includes(categoryId))
        .map(([widgetId, widget]) => ({
          name: widget.metadata.name,
          id: widgetId,
        }))
    }))
  };

  return toc;
};

interface ISidebarContent {
  location: any,
  t: any,
}

const SidebarContent = (props: RouteComponentProps<ISidebarContent>) => {
  const history = useHistory();
  const ref = useRef<any>();
  const isEditMode = useSelector((state: any) => state.Layout.isEditMode);
  const tableOfContents = useSelector((state: any) => state.articles.tableOfContents);
  const widgets = getWidgetsToc(props);

  const activateParentDropdown = useCallback(item => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, [tableOfContents]);

  useEffect(() => {
    new MetisMenu("#side-menu");
  })

  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const initMenu = () => {
      const ul: any = document.getElementById("side-menu");
      const matchingMenuItem = [...ul.querySelectorAll('a')]
        .find((e: any) => e.pathname === props.location.pathname);

      if (matchingMenuItem) {
        // activateParentDropdown(matchingMenuItem);
      }
    };

    initMenu();
  }, [props.location.pathname, activateParentDropdown, tableOfContents]);

  useEffect(() => {
    ref.current.recalculate();
  });

  function scrollElement(item: any) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  function formatPath(path: number[]) {
    return [...path, ' '].join('.');
  }

  // function parentClickableFix(path: string) {
  //   // It's a workaround for metis menu
  //   return () => history.push(path);
  // }
  // onClick={parentClickableFix(`/a/${entry.slug}`)}

  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu">
          <Header className="metismenu list-unstyled sidebar-sections-wrapper" id="side-menu">
            <TableOfContents
              toc={tableOfContents}
              leaf={({ path, entry }) => <Link to={`/a/${entry.slug}`}>{`${formatPath(path)}${entry.name}`}</Link>}
              parent={({ path, entry }) => (
                <Link className="has-arrow" to={`/a/${entry.slug}`}>
                  {path.length === 0 ? <Icon name="book-open" size={16} className="sidebar-entry-icon" /> : null }
                  {`${formatPath(path)}${entry.name}`}
                </Link>
              )}
            />

            {isEditMode ? (
              <>
                <div style={{ borderTop: '1px solid #eee', margin: '10px 0' }}></div>
                <TableOfContents
                  toc={widgets}
                  leaf={({ path, entry }) => (
                    <Draggable
                      data={{ type: SIDEBAR_ITEM, component: { content: entry.id } }}
                      iconName="home"
                      text={entry.name}
                    />
                  )}
                  parent={({ path, entry }) => (
                    <Link to="#" className="has-arrow">
                      {path.length === 0 ? <Icon name="tool" size={16} className="sidebar-entry-icon" /> : null }
                      {entry.name}
                    </Link>
                  )}
                />
              </>
            ) : null}
          </Header>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

export default withTranslation()(withRouter(SidebarContent));
