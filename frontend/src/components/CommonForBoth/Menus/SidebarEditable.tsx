import { useState } from "react";
import Icon from "@ailibs/feather-react-ts";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { layoutTheme } from "../../../constants/layout";
import DroppableList from "./DroppableList";
import { TreeData } from '@atlaskit/tree'
import ArticleMetadataEditor from "./ArticleMetadataEditor";
import { toggleEditMode } from "src/store/actions";
import { pushTableOfContents } from "src/store/articles/actions";

function getTreeDataWithInvalidRoot(sidebar: any) {
  const { children, ...rest } = sidebar

  if (!children) {
    return {
      rootId: sidebar.slug,
      items: {
        [sidebar.slug]: { id: sidebar.slug, data: rest, children: [], hasChildren: false }
      }
    };
  }

  const sidebarChildren = sidebar.children.map((el: any) => getTreeDataWithInvalidRoot(el));
  const childrenIds = sidebarChildren.map(({ rootId }: any) => rootId);
  const childrenItems = sidebarChildren.map(({ items }: any) => items).reduce((a: any, b: any) => ({ ...a, ...b }), {});

  return {
    rootId: sidebar.slug,
    items: {
      [sidebar.slug]: { id: sidebar.slug, data: rest, children: childrenIds, hasChildren: true },
      ...childrenItems
    }
  };
}

function getTreeData(sidebar: any) {
  const rootId = '$';
  const treeData = getTreeDataWithInvalidRoot(sidebar);

  return {
    rootId,
    items: {
      ...treeData.items,
      [treeData.rootId]: {
        ...treeData.items[treeData.rootId],
        isExpanded: true,
      },
      [rootId]: { id: rootId, data: {}, children: [treeData.rootId], hasChildren: true }
    }
  }
}

function getSidebarDataWithInvalidRoot(tree: TreeData): any {
  const rootElement = tree.items[tree.rootId];
  if (!rootElement.children) {
    return rootElement.data;
  }

  const children = rootElement.children.map(rootId => getSidebarDataWithInvalidRoot({
    rootId,
    items: tree.items,
  }));

  return {
    ...rootElement.data,
    children,
  };
}

function getSidebarData(tree: TreeData): any {
  const rootId = tree.items[tree.rootId].children[0];
  return getSidebarDataWithInvalidRoot({
    rootId,
    items: tree.items,
  })
}

interface ISidebarEditable {
  layoutMode: string;
}

const SidebarEditable = ({ layoutMode }: ISidebarEditable) => {
  const dispatch = useDispatch();
  const currentTableOfContents = useSelector((state: any) => state.articles.tableOfContents);
  const isEditMode = useSelector((state: any) => state.Layout.isEditMode);
  const userInfo = useSelector((state: any) => state.auth.user);

  const [modal, setModal] = useState<boolean>(false);
  const [tableOfContents, setTableOfContents] = useState<TreeData>(getTreeData(currentTableOfContents));
  const [activeElementId, setActiveElementId] = useState<any>(null);

  const toggleModal = () => setModal(prevState => !prevState);

  function handleToggleEditMode() {
    dispatch(toggleEditMode(!isEditMode));
  }

  function saveTableOfContents() {
    const sidebarData = getSidebarData(tableOfContents);
    dispatch(pushTableOfContents(sidebarData));
    toggleModal();
  }

  const generateModal = () => {
    const sharedProps = {
      tableOfContents,
      activeElementId,
      onUpdateTableOfContents: setTableOfContents,
      onUpdateActiveElementId: setActiveElementId,
    };

    return (
      <Modal isOpen={modal} toggle={toggleModal} fullscreen>
        <ModalHeader toggle={toggleModal}>Konfigurator</ModalHeader>
        <ModalBody className="configurator__Body">
          <div className="configurator__List">
            <DroppableList {...sharedProps} />
          </div>
          <div className="configurator_Editor">
            <ArticleMetadataEditor {...sharedProps} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={toggleModal}>
            Cancel
          </Button>
          <Button color="success" onClick={saveTableOfContents}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  if (userInfo == null || !userInfo.role.permissions.includes('articles.write')) {
    return null;
  }

  return (
    <div className="dropdown d-none d-sm-inline-block">
      <button onClick={handleToggleEditMode} type="button" className="btn header-item">
        {isEditMode
          ? <Icon name="eye" className="icon-lg" />
          : <Icon name="edit" className="icon-lg" />
        }
      </button>

      {isEditMode ? (
        <button onClick={toggleModal} type="button" className="btn header-item">
          {layoutMode === layoutTheme["DARKMODE"] ? (
            <Icon name="sidebar" className="icon-lg layout-mode-light" />
          ) : (
            <Icon name="sidebar" className="icon-lg layout-mode-dark" />
          )}
        </button>
      ) : null}

      {modal ? generateModal() : null}
    </div>
  );
};

export default SidebarEditable;
