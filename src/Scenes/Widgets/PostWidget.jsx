import React from "react";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
} from "@mui/icons-material";

import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  TextField,
  Button,
} from "@mui/material";
import FlexBetween from "Components/FlexBetween";
import Friend from "Components/Friend";
import WidgetWrapper from "Components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "State/State";
import { CommentPost, LikePost } from "Api/PostRequest";
import PostDelete from "Scenes/Postdelete/PostDelete";
// const ITEM_HEIGHT = 48;

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);

  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const medium = palette.neutral.medium;

  const [loading, setLoading] = useState(true);

  const patchLike = async () => {
    const response = await LikePost(postId, loggedInUserId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) {
      const updatedPost = response.data;
      dispatch(setPost({ post: updatedPost }));
    }
  };

  const patchComment = async () => {
    const userName = user.firstName + " " + user.lastName;
    if (!comment.trim()){
      return;
    }
    const response = await CommentPost(comment, userName, postId);

    if (response.data) {
      dispatch(setPost({ post: response.data.newCommentPost }));
    }
  };

  return (
    <Box>
      {loading ? (
        <WidgetWrapper m="2rem 0">
          <Friend
            friendId={postUserId}
            name={name}
            subtitle={location}
            userPicturePath={userPicturePath}
          />

          <Typography color={main} sx={{ mt: "1rem" }}>
            {description}
          </Typography>
          {picturePath && (
            <img
              width="100%"
              height="auto"
              alt="post"
              style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
              src={`${process.env.REACT_APP_BASE_URL}/assets/${picturePath}`}
            />
          )}
          <FlexBetween mt="0.25rem">
            <FlexBetween gap="1rem">
              <FlexBetween gap="0.3rem">
                <IconButton onClick={patchLike}>
                  {isLiked ? (
                    <FavoriteOutlined sx={{ color: primary }} />
                  ) : (
                    <FavoriteBorderOutlined />
                  )}
                </IconButton>
                <Typography>{likeCount}</Typography>
              </FlexBetween>

              <FlexBetween gap="0.3rem">
                <IconButton onClick={() => setIsComments(!isComments)}>
                  <ChatBubbleOutlineOutlined />
                  <Typography>{comments.length}</Typography>
                </IconButton>

                {isComments && (
                  <FlexBetween gap="1.5rem">
                    <TextField
                      id="outlined-name"
                      placeholder="Write a comment here"
                      required
                      onChange={(e) => setComment(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <Button
                          variant="outlined" onClick={patchComment}>
                            Comment
                          </Button>
                        ),
                      }}
                    />
                  </FlexBetween>
                )}
              </FlexBetween>
            </FlexBetween>

            <IconButton>
              <PostDelete
                setLoading={setLoading}
                postUserId={postUserId}
                postId={postId}
              />
            </IconButton>
          </FlexBetween>
          {isComments && (
            <Box mt="0.5rem">
              {comments.map((comment, i) => (
                <Box key={`${name}-${i}`}>
                  <Divider />
                  <Typography sx={{ color: medium, m: "0.5rem 0", pl: "1rem" }}>
                    {comment.username}
                  </Typography>

                  <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                    {comment.comment}
                  </Typography>
                </Box>
              ))}
              <Divider />
            </Box>
          )}
        </WidgetWrapper>
      ) : (
        ""
      )}
    </Box>
  );
};

export default PostWidget;
