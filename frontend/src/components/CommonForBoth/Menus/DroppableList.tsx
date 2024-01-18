import Icon from '@ailibs/feather-react-ts'
import Tree, { mutateTree, moveItemOnTree, TreeData, TreeItem } from '@atlaskit/tree'
import { withTranslation } from 'react-i18next';
import shortid from "shortid";

interface IDroppableList {
  tableOfContents: TreeData;
  activeElementId: any;

  onUpdateTableOfContents(tableOfContents: TreeData): any;
  onUpdateActiveElementId(activeElementId: any): any;
  t: any;
}

const DroppableList = (props: IDroppableList) => {
  function createNewEntry(parent: TreeItem) {
    const entryId = shortid.generate();
    props.onUpdateTableOfContents({
      rootId: props.tableOfContents.rootId,
      items: {
        ...props.tableOfContents.items,
        [parent.id]: {
          ...props.tableOfContents.items[parent.id],
          hasChildren: true,
          isExpanded: true,
          children: [
            ...(props.tableOfContents.items[parent.id].children ?? []),
            entryId,
          ],
        },
        [entryId]: { id: entryId, children: [], hasChildren: false, data: { name: props.t('table_of_contents_manager.new_article_name'), slug: entryId, public: false } }
      }
    })
    props.onUpdateActiveElementId(entryId)
  }

  function removeEntry(entry: TreeItem) {
    entry.children?.forEach(e => removeEntry(props.tableOfContents.items[e]));
    const [parentId, parent]: any = Object.entries(props.tableOfContents.items).find(([_, parent]) => parent.children?.includes(entry.id) ?? false);
    props.onUpdateTableOfContents({
      ...props.tableOfContents,
      items: {
        ...props.tableOfContents.items,
        [parentId]: {
          ...parent,
          children: parent.children.filter((e: string) => e !== entry.id),
          hasChildren: parent.children.length > 1,
        }
      }
    })
  }

  function handle(callback: () => any) {
    return (event: any) => {
      event.stopPropagation();
      callback();
    }
  }

  return (
    <Tree
      tree={props.tableOfContents}
      renderItem={({ item, provided, onExpand, onCollapse }) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <div
            style={{ display: 'flex', justifyContent: 'space-between' }}
            onClick={() => props.onUpdateActiveElementId(item.id)}
            className={`configurator__Item${item.id === props.activeElementId ? ' configurator__Item--active' : ''}`}
          >
            <div className={`configurator__Item--text ${!item.data.public ? ' configurator_Item--private' : ''}`}>
              {item?.data?.name ?? ''}
            </div>

            <div className="configurator__Actions">
              <button onClick={handle(() => removeEntry(item))} className="configurator__Button">
                <Icon name="trash-2" color="#555" size="16" />
              </button>
              <button onClick={handle(() => createNewEntry(item))} className="configurator__Button">
                <Icon name="plus" color="#555" size="16" />
              </button>

              {item.hasChildren ? (
                <button onClick={handle(() => (item.isExpanded ? onCollapse : onExpand)(item.id))} className="configurator__Button configurator__Collapse">
                  <Icon name={item.isExpanded ? 'chevron-up' : 'chevron-down'} color="#555" size="16" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
      onExpand={(itemId) => props.onUpdateTableOfContents(mutateTree(props.tableOfContents, itemId, { isExpanded: true }))}
      onCollapse={(itemId) => props.onUpdateTableOfContents(mutateTree(props.tableOfContents, itemId, { isExpanded: false }))}
      onDragEnd={(source, destination) => {
        if (!destination) {
          return;
        }

        props.onUpdateTableOfContents(moveItemOnTree(props.tableOfContents, source, destination));
      }}
      offsetPerLevel={30}
      isDragEnabled
      isNestingEnabled
    />
  );
};

export default withTranslation()(DroppableList);
