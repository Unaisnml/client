import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import NavBar from "Scenes/Navbar/NavBar";
import Userwidget from "Scenes/Widgets/UserWidget";
import MyPostWidget from "Scenes/Widgets/MyPostWidget";
import PostsWidget from "Scenes/Widgets/PostsWidget";
import FriendListWidget from "Scenes/Widgets/FriendListWidget";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <Box>
      <Box className="navbar">
        <NavBar />
      </Box>
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : null}>
          <Box className="userwidget">
            <Userwidget userId={_id} picturePath={picturePath} />
          </Box>
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : null}
          mt={isNonMobileScreens ? null : "2rem"}
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
