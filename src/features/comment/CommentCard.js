import React from "react";
import {
  Avatar,
  Box,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { fDate } from "../../utils/formatTime";
import CommentReaction from "./CommentReaction";
import ClearIcon from "@mui/icons-material/Clear";

import useAuth from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { deleteComment, getComments } from "./commentSlice";

function CommentCard({ comment }) {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const handleDeleteComment = () => {
    const confirm = window.confirm("Do you want to delete this comment ?");
    console.log(comment._id);

    if (confirm) {
      dispatch(deleteComment({ commentId: comment._id, postId: comment.post }));
    }
  };

  return (
    <Stack direction="row" spacing={2}>
      <Avatar alt={comment.author?.name} src={comment.author?.avatarUrl} />
      <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: "background.neutral" }}>
        <Stack
          direction="row"
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 0.5 }}
        >
          <Box sx={{ display: "flex", alignItems: "baseline" }}>
            <Typography variant="subtitle2" mr={1} sx={{ fontWeight: 600 }}>
              {comment.author?.name}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.disabled",
                fontWeight: "regular",
                fontSize: 12,
              }}
            >
              {fDate(comment.createdAt)}
            </Typography>
          </Box>
          {user._id === comment.author._id && (
            <IconButton onClick={handleDeleteComment}>
              <ClearIcon sx={{ fontSize: 12 }} />
            </IconButton>
          )}
        </Stack>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {comment.content}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <CommentReaction comment={comment} />
        </Box>
      </Paper>
    </Stack>
  );
}

export default CommentCard;
