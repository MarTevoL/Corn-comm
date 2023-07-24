import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { COMMENTS_PER_POST } from "../../app/config";

const initialState = {
  isLoading: false,
  error: null,
  commentsByPost: {},
  commentsById: {},
  totalCommentsByPost: {},
  currentPageByPost: {},
};

const slice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createCommentSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },
    getCommentsSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { postId, comments, count, page } = action.payload;
      comments.forEach((comment) => {
        state.commentsById[comment._id] = comment;
      });
      state.commentsByPost[postId] = comments
        .map((comment) => comment._id)
        .reverse();
      state.currentPageByPost[postId] = page;
      state.totalCommentsByPost[postId] = count;
    },
  },
});

export default slice.reducer;

export const createComment =
  ({ postId, content }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.post("/comments", { content, postId });
      dispatch(slice.actions.createCommentSuccess(response.data));
      dispatch(getComments({ postId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };

export const getComments =
  ({ postId, page = 1, limit = COMMENTS_PER_POST }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    const params = {
      page: page,
      limit: limit,
    };
    const response = await apiService.get(`/posts/${postId}/comments`, {
      params,
    });
    dispatch(
      slice.actions.getCommentsSuccess({ ...response.data, postId, page })
    );
    try {
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };
