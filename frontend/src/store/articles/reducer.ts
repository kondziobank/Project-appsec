
import { ArticlesAction, ArticlesState } from "./actionTypes";

export const INIT_STATE: ArticlesState = {
  tableOfContents: null,
  inProgress: false,
  error: null
};

const ArticlesReducer = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case ArticlesAction.FETCH_TABLE_OF_CONTENTS:
      return {
        ...state,
        inProgress: true,
        error: null
      }

    case ArticlesAction.PUSH_TABLE_OF_CONTENTS:
      return {
        ...state,
        inProgress: true,
        error: null,
      }

    case ArticlesAction.UPDATE_TABLE_OF_CONTENTS:
      return {
        ...state,
        inProgress: false,
        error: null,
        tableOfContents: action.payload
      }
  
    case ArticlesAction.SYNC_ERROR:
      return {
        ...state,
        inProgress: false,
        tableOfContents: null,
        error: action.payload,
      }

    default:
      return state;
  }
};

export default ArticlesReducer;
