import { combineReducers, configureStore } from "@reduxjs/toolkit";
import commentReducer from "../features/comment/commentSlice";
import friendReducer from "../features/friend/friendSlice";
import postReducer from "../features/post/postSlice";
import userReducer from "../features/user/userSlice";

const rootRuducer = combineReducers({
  comment: commentReducer,
  friend: friendReducer,
  post: postReducer,
  user: userReducer,
});

const store = configureStore({
  reducer: rootRuducer,
});

export default store;
