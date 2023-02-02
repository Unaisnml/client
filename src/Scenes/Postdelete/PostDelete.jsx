import { Alert, Button, IconButton, Menu } from "@mui/material";
import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";

import { useState } from "react";
import { setPost } from "State/State";
import { UserPostDelete } from "Api/PostRequest";
const ITEM_HEIGHT = 48;

const PostDelete = ({ setLoading, postUserId, postId }) => {
  const [loaderDelete, setLoaderDelete] = useState(false);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const loggedInUserId = useSelector((state) => state.user._id);

  //Delete the post
  const deletePost = async (postId) => {
    const response = await UserPostDelete(postId);

    if (response.data.success) {
      setLoaderDelete(true);
      let updatedPosts = response.data.newposts;
      dispatch(setPost({ post: updatedPosts }));
      setLoading(false);
    }
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        onchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "40ch",
          },
        }}
      >
        {postUserId === loggedInUserId ? (
          <Alert
            severity="error"
            action={
              <Button
                size="medium"
                onClick={() => {
                  deletePost(postId);
                }}
              >
                Delete
              </Button>
            }
          >
            Are You sure?,
            <br />
            you want to delete this post
          </Alert>
        ) : (
          ""
        )}
      </Menu>
    </div>
  );
};

export default PostDelete;
