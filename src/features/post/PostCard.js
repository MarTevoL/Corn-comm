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
  Menu,
  Divider,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { fDate } from "../../utils/formatTime";
import PostReaction from "./PostReaction";
import CommentList from "../comment/CommentList";
import CommentForm from "../comment/CommentForm";
import useAuth from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { deletePost } from "./postSlice";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function PostCard({ post }) {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpenConfirm(false);
    setAnchorEl(null);
  };

  const handleEditPost = () => {
    console.log(`edit post ${post._id}`);
    navigate(`/post/${post._id}`);
  };

  const handleDeletePost = () => {
    dispatch(deletePost({ postId: post._id }));
    setAnchorEl(null);
  };

  const handleEditMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEditMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={post._id}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleEditMenuClose}
    >
      <MenuItem onClick={handleEditPost} sx={{ mx: 1 }}>
        edit
      </MenuItem>
      <Divider sx={{ borderStyle: "dashed" }} />
      <MenuItem onClick={() => setOpenConfirm(true)} sx={{ mx: 1 }}>
        delete
      </MenuItem>
    </Menu>
  );

  return (
    <Card>
      <Dialog
        open={openConfirm}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"You are deleting this post"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            do you want to continue ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleDeletePost} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
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
            <IconButton onClick={handleEditMenuOpen}>
              <MoreVertIcon sx={{ fontSize: 30 }} />
            </IconButton>
          )
        }
      />
      {renderMenu}
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
