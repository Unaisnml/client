import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { feedPosts, GetUserPostData } from "../../Api/PostRequest";
import { setPosts } from "State/State";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await feedPosts({
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data) {
      const data = await response.data;
      dispatch(setPosts(data));
    }
  };

  const getUserPosts = async () => {
    const response = await GetUserPostData(userId, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data) {
      const data = response.data;
      dispatch(setPosts(data));
    }
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, [posts]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      {Array.isArray(posts)
        ? posts.map(
            ({
              _id,
              userId,
              firstName,
              lastName,
              description,
              location,
              picturePath,
              userPicturePath,
              likes,
              comments,
            }) => (
              <PostWidget
                key={_id}
                postId={_id}
                postUserId={userId}
                name={`${firstName} ${lastName}`}
                description={description}
                location={location}
                picturePath={picturePath}
                userPicturePath={userPicturePath}
                likes={likes}
                comments={comments}
              />
            )
          )
        : null}
    </>
  );
};

export default PostsWidget;
