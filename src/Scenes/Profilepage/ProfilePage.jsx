import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import NavBar from "../Navbar/NavBar";
import FriendListWidget from "../Widgets/FriendListWidget";
import MyPostWidget from "../Widgets/MyPostWidget";
import PostsWidget from "../Widgets/PostsWidget";
import Userwidget from "../Widgets/UserWidget";
import { getUserProfile } from "../../Api/UserRequest";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  //GET USER
  const getUser = async () => {
    const { data } = await getUserProfile(location.state.userId, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <NavBar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <Userwidget
            userId={location.state.userId}
            picturePath={user.picturePath}
          />
          <Box m="2rem 0" />
          <FriendListWidget userId={location.state.userId} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <PostsWidget userId={location.state.userId} isProfile />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
