import React from "react";
import {
  ManageAccountsOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import TextsmsIcon from "@mui/icons-material/Textsms";
import { Box, Typography, Divider, useTheme, ButtonBase } from "@mui/material";
import UserImage from "Components/UserImage";
import FlexBetween from "Components/FlexBetween";
import WidgetWrapper from "Components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";
import Modal from "@mui/material/Modal";
import { Button, Form, Input } from "antd";
import { setLogin } from "State/State";
import { createUserChat } from "Api/ChatRequest";
import { editUser, getUserProfile } from "Api/UserRequest";

const Userwidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const currentUserId = useSelector((state) => state.user);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (userId === currentUserId._id) {
      setIsCurrentUser(true);
    } else {
      setIsCurrentUser(false);
    }
  }, [isCurrentUser]); //eslint-disable-line react-hooks/exhaustive-deps

  //Crate new Chat
  const createChat = async () => {
    const senderId = currentUserId._id;
    const receiverId = userId;

    const response = await createUserChat({ senderId, receiverId });

    if (response.data) {
      navigate("../Chat");
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid",
    boxShadow: 24,
    p: 4,
  };

  const onFinish = async (values) => {
    try {
      const response = await editUser(currentUserId._id, values);
      if (response.data.success) {
        console.log(response.data, "hellloooo");
        dispatch(
          setLogin({
            user: response.data.user,
            token: response.data.token,
          }),
          setUser(response.data.user),
          handleClose()
        );
        console.log("jdsjshjk111");
      } else {
        console.log("No response");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    const response = await getUserProfile(userId, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data) {
      const data = response.data;
      setUser(data);
    }
  };
  useEffect(() => {
    getUser();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const { firstName, lastName, location, occupation, friends } = user;

  return (
    <WidgetWrapper sx={{ postion: "sticky", top: "0" }}>
      {/* FIRST RAW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile`, { state: { userId: userId } })}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>
              {friends ? friends.length : ""} friends
            </Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      {/* SECOND RAW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
        {isCurrentUser ? (
          <Box display="flex" alignItems="center" gap="1rem">
            <CreateIcon fontSize="large" sx={{ color: main }} />
            <ButtonBase onClick={handleOpen}>
              {" "}
              <Typography color={medium}>Edit Profile</Typography>
            </ButtonBase>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" gap="1rem">
            <TextsmsIcon
              fontSize="large"
              sx={{ cursor: "pointer" }}
              onClick={() => {
                createChat();
              }}
            >
              Message
            </TextsmsIcon>
            <Typography color={medium}>Message</Typography>
          </Box>
        )}
      </Box>

      {/* Edit Profile Section */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" componet="h2">
            Edit Profile
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label={<label style={{ color: "white" }}>First Name</label>}
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: "Please input your First Name!",
                  },
                  {
                    pattern: /^[A-Za-z]+$/,
                    message:
                      "This field should not contain numbers, symbols, or spaces!",
                  },
                ]}
              >
                <Input
                  type="text"
                  value={currentUserId.firstName}
                  placeholder={currentUserId.firstName}
                  defaultValue={currentUserId.firstName}
                />
              </Form.Item>

              <Form.Item
                label={<label style={{ color: "white" }}>Last Name</label>}
                name="lastName"
                rules={[
                  {
                    pattern: /^[A-Za-z]+$/,
                    message:
                      "This field should not contain numbers, symbols, or spaces!",
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder={currentUserId.lastName}
                  defaultValue={currentUserId.lastName}
                />
              </Form.Item>

              <Form.Item
                label={<label style={{ color: "white" }}>Location</label>}
                name="location"
                rules={[
                  {
                    pattern: /^[A-Za-z]+$/,
                    message:
                      "This field should not contain numbers, symbols, or spaces!",
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder={currentUserId.location}
                  defaultValue={currentUserId.location}
                />
              </Form.Item>

              <Form.Item
                label={<label style={{ color: "white" }}>Occupation</label>}
                name="occupation"
                rules={[
                  {
                    pattern: /^[A-Za-z]+$/,
                    message:
                      "This field should not contain numbers, symbols, or spaces!",
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder={currentUserId.occupation}
                  defaultValue={currentUserId.occupation}
                />
              </Form.Item>

              <Form.Item
                name="_id"
                hidden={true}
                initialValue={currentUserId._id}
              >
                <Input />
              </Form.Item>
              <div className="d-flex flex-row">
                <Button
                  style={{ background: "green" }}
                  type="primary"
                  htmlType="submit"
                >
                  Submit
                </Button>
                <Button
                  style={{ background: "red", marginLeft: 2 }}
                  type="primary"
                  htmlType="submit"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Typography>
        </Box>
      </Modal>
    </WidgetWrapper>
  );
};

export default Userwidget;
