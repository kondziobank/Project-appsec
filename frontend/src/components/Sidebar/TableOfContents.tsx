import React from 'react'
import { withTranslation } from "react-i18next";
import DirectElement from "./DirectElement";
import ArrowElement from "./ArrowElement";
import Header from "./Header";
import { useSelector } from 'react-redux';

export interface TocEntry {
  name: string;
  children?: TocEntry[];
  [key: string]: any;
}

type TocPath = number[];
interface ITableOfContent {
  toc: TocEntry;
  parent(props: { path: TocPath, entry: any }): any;
  leaf(props: { path: TocPath, entry: any }): any;
  path?: TocPath;
}

const TableOfContents = (props: ITableOfContent) => {
  const isEditMode = useSelector((state: any) => state.Layout.isEditMode);

  function renderEntry(entry: TocEntry) {
    const path = props.path ?? [];

    if (!entry.public && !isEditMode) {
      return null;
    }

    return entry.children == null || entry.children.length === 0
      ? <DirectElement component={() => props.leaf({ path, entry })} />
      : (
        <ArrowElement component={() => props.parent({ path: path ?? [], entry })}>
          <Header className="sub-menu">
            {entry.children.map((entry: TocEntry, index: number) => (
              <TableOfContents
                toc={entry}
                key={index}
                parent={props.parent}
                leaf={props.leaf}
                path={[...path, index + 1]}
              />
            ))}
          </Header>
        </ArrowElement>
      )
  }

  return (
    <React.Fragment>
      {renderEntry(props.toc)}
    </React.Fragment>
  );
};

export default withTranslation()(TableOfContents);
