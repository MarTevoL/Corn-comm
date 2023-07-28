import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostEdit from "../features/post/PostEdit";

function EditPostPage() {
  const { postId } = useParams();

  return <PostEdit postId={postId} />;
}

export default EditPostPage;
