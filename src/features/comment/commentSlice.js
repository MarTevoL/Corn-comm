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
      //call by every CommentCard
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
    sendCommentReactionSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { commentId, reactions } = action.payload;
      state.commentsById[commentId].reactions = reactions;
    },
    deleteCommentSuccess(state, action) {
      const { commentId, postId } = action.payload;
      state.isLoading = false;
      state.error = null;

      delete state.commentsById[commentId];

      const newCommentsOfPost = state.commentsByPost[postId].filter(
        (id) => id !== commentId
      );
      state.commentsByPost[postId] = newCommentsOfPost;
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

export const sendCommentReaction =
  ({ commentId, emoji }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.post(`/reactions`, {
        targetType: "Comment",
        targetId: commentId,
        emoji,
      });
      dispatch(
        slice.actions.sendCommentReactionSuccess({
          commentId,
          reactions: response.data,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };

export const deleteComment =
  ({ commentId, postId }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await apiService.delete(`/comments/${commentId}`);
      dispatch(slice.actions.deleteCommentSuccess({ commentId, postId }));
      dispatch(getComments({ postId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };
