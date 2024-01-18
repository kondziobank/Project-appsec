import { combineReducers } from "redux"

import Layout from "./layout/reducer";
import auth from "./auth/reducer";
import articles from "./articles/reducer";

const rootReducer = combineReducers({ Layout, auth, articles })

export default rootReducer
