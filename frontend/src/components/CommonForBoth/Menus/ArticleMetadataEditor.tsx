import { useState, useEffect} from 'react';
import { ItemId, TreeData } from '@atlaskit/tree';
import { FormGroup, Label, Input } from "reactstrap";
import { getArticle } from 'src/helpers/api_helper';
import { withTranslation } from 'react-i18next';


function getBaseUrl() {
    return location.origin + process.env.PUBLIC_URL;
}

function getArticleBaseUrl() {
    return `${getBaseUrl()}/a/`;
}

function isValidSlug(slug: string) {
  return /^[a-z0-9-]*$/.test(slug);
}

const PrefixedInput = (props: any) => {
  const { prefix, value, onValueChange, ...rest } = props;
  return (
    <Input
      {...rest}
      value={prefix + value}
      onChange={e => {
        const { value } = e.target;
        if (value.substring(0, prefix.length) === prefix) {
          const slug = value.slice(prefix.length);
          if (isValidSlug(slug)) {
            onValueChange(slug);
          }
        } else if (value.length === 0) {
            onValueChange('');
        }
      }}
    />
  );
}

interface IArticleMetadataEditor {
  tableOfContents: TreeData;
  activeElementId: ItemId;

  onUpdateTableOfContents(tableOfContents: TreeData): any;
  onUpdateActiveElementId(activeElementId: ItemId): any;

  t: any;
}

interface IArticleChoosen extends IArticleMetadataEditor {
  data: any;
  t: any;
}

const ArticleNotChoosen = (props: any) => <div>{props.t('article_metadata_editor.article_not_selected')}</div>;

const ArticleChoosen = (props: IArticleChoosen) => {
  const [data, setData] = useState(props.data);
  const [activeElementId, setActiveElementId] = useState(props.activeElementId);
  const [displaySlugAlreadyUsedError, setDisplaySlugAlreadyUsedError] = useState(false);

  useEffect(() => {
    setDisplaySlugAlreadyUsedError(false);
    updateConfiguration();
    setActiveElementId(props.activeElementId);
    setData(props.data);
  }, [props.activeElementId]);

  useEffect(() => {
    if (data.public !== props.data.public) {
      updateConfiguration();
    }
  }, [data]);

  async function checkIsArticleSlugFree() {
    /*if (Object.values(props.tableOfContents.items).some((item: any) => item.data.slug === data.slug && item.data.id !== data.id)) {
      return false;
    }*/

    try {
      const article = await getArticle(data.slug);
      return article._id === data._id;
    } catch (e) {
      const error: any = e;
      if (error.response.status === 404) {
        return true;
      }
    }
  }

  async function updateConfiguration() {    
    const isFree = await checkIsArticleSlugFree();
    setDisplaySlugAlreadyUsedError(!isFree);
    if (!isFree) {
      return;
    }

    props.onUpdateTableOfContents({
      ...props.tableOfContents,
      items: {
        ...props.tableOfContents.items,
        [activeElementId]: {
            ...props.tableOfContents.items[activeElementId],
            data
        }
      }
    });
  }

  return (
    <>
      <FormGroup>
        <Label>{props.t('article_metadata_editor.article_name')}</Label>
        <Input
          placeholder={props.t('article_metadata_editor.article_name')}
          value={data.name}
          onChange={e => setData({ ...data, name: e.target.value })}
          onBlur={updateConfiguration}
        />
      </FormGroup>

      <FormGroup>
        <Label>{props.t('article_metadata_editor.url_address')}</Label>
        <PrefixedInput
          placeholder={props.t('article_metadata_editor.url_address')}
          prefix={getArticleBaseUrl()}
          value={data.slug}
          onValueChange={(slug: string) => setData({ ...data, slug })}
          onBlur={updateConfiguration}
          spellCheck="false"
        />
        {displaySlugAlreadyUsedError ? (
          <div>
            <small className='text-danger'>{props.t('article_metadata_editor.url_address')}</small>
          </div>
        ) : null}
      </FormGroup>
      <FormGroup switch>
        <Input
          type="switch"
          checked={data.public}
          onChange={() => setData({ ...data, public: !data.public })}
        />
        <Label check>{props.t('article_metadata_editor.public')}</Label>
      </FormGroup>
    </>
  )
}

const ArticleMetadataEditor = (props: IArticleMetadataEditor) => {
  const data = props.activeElementId
    ? props.tableOfContents.items[props.activeElementId]?.data
    : null;

  return data == null
    ? <ArticleNotChoosen t={props.t} />
    : <ArticleChoosen {...props} data={data} t={props.t} />
  ;
}

export default withTranslation()(ArticleMetadataEditor);
