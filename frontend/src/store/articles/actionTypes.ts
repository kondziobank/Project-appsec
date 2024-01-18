import { TocEntry } from "src/components/Sidebar/TableOfContents";

export enum ArticlesAction {
  FETCH_TABLE_OF_CONTENTS = '@@articles/FETCH_TABLE_OF_CONTENTS',
  PUSH_TABLE_OF_CONTENTS = '@@articles/PUSH_TABLE_OF_CONTENTS',
  UPDATE_TABLE_OF_CONTENTS = '@@articles/UPDATE_TABLE_OF_CONTENTS',
  SYNC_ERROR = '@@articles/SYNC_ERROR',
}

export interface ArticlesState {
  tableOfContents: TocEntry|null;
  inProgress: boolean;
  error: any|null;
}
