import React from "react";
import {
  Box,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

import { Link as RouterLink } from "react-router-dom";
import { fDate } from "../../utils/formatTime";
import PostReaction from "./PostReaction";
import CommentList from "../comment/CommentList";
import CommentForm from "../comment/CommentForm";
import useAuth from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { deletePost } from "./postSlice";

function PostCard({ post }) {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const handleDeletePost = () => {
    const confirm = window.confirm("Do you want to delete this post");
    if (confirm) {
      dispatch(deletePost({ postId: post._id }));
    }
  };

  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={
          <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
        }
        title={
          <Link
            variant="subtitle2"
            color="text.primary"
            component={RouterLink}
            sx={{ fontWeight: 600 }}
            to={`/user/${post.author._id}`}
          >
            {post?.author?.name}
          </Link>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {fDate(post.createdAt)}
          </Typography>
        }
        action={
          user._id === post.author._id && (
            <IconButton onClick={handleDeletePost}>
              <ClearIcon sx={{ fontSize: 30 }} />
            </IconButton>
          )
        }
      />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography>{post.content}</Typography>

        {post.image && (
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              height: 300,
              "& img": { objectFit: "cover", width: 1, height: 1 },
            }}
          >
            <img src={post.image} alt="post" />
          </Box>
        )}
        <PostReaction post={post} />
        <CommentList postId={post._id} />
        <CommentForm postId={post._id} />
      </Stack>
    </Card>
  );
}

export default PostCard;
