import { ArticlesAction } from "./actionTypes"

export const fetchTableOfContents = () => ({
  type: ArticlesAction.FETCH_TABLE_OF_CONTENTS,
  payload: null
})

export const pushTableOfContents = (tableOfContents: any) => ({
  type: ArticlesAction.PUSH_TABLE_OF_CONTENTS,
  payload: tableOfContents
})

export const updateTableOfContents = (tableOfContents: any) => ({
  type: ArticlesAction.UPDATE_TABLE_OF_CONTENTS,
  payload: tableOfContents
})

export const syncError = (error: any) => ({
  type: ArticlesAction.SYNC_ERROR,
  payload: error
})

