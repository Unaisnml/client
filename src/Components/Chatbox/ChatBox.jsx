import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "./ChatBox.css";
import { format } from "timeago.js";
// import axios from "axios";

import { getUserProfile } from "Api/UserRequest";
import { addMessage, getMessages } from "Api/MessageRequest";

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scroll = useRef();
  const token = useSelector((state) => state.token);

  const handleChange = (e) => {
    setNewMessage(e.target.value);
  };

  //Fetching data for header
  useEffect(() => {
    const userId = chat
      ? chat.members
        ? chat.members.find((id) => id !== currentUser)
        : console.log("hello")
      : console.log("hello2");

    console.log(userId, "Chat userid");
    const getUserData = async () => {
      try {
        const { data } = await getUserProfile(userId, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(data);
      } catch (error) {
        console.log(error, "error aanu");
      }
    };
    getUserData();
  }, [chat, currentUser]); //eslint-disable-line react-hooks/exhaustive-deps

  //fetching data from messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(data);
      } catch (error) {
        console.log(error, "Fetch messages failed");
      }
    };
    if (chat !== null) fetchMessages();
  }, [chat]); //eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = async (event) => {
    event.preventDefault();
    if (newMessage === "") {
      return console.log("empty message");
    }
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };
    console.log(message, "message");

    //send message to database
    try {
      const { data } = await addMessage(message, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data) {
        console.log(data, "new message");
        setMessages([...messages, data]);
        setNewMessage("");
      } else {
        console.log("no data");
      }
    } catch (error) {
      console.log(error);
    }

    //Send Message to socket server
    const receiverId = chat.members.find((id) => id !== currentUser);
    setSendMessage({ ...message, receiverId });
  };

  //Receive Message from paraent component
  useEffect(() => {
    if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
      console.log("Data received from child chatBox", receivedMessage);
      setMessages([...messages, receivedMessage]);
    }
  }, [receivedMessage]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="ChatBox-container">
        {chat ? (
          <>
            <div className="chat-header">
              <div className="follower">
                <div className="follower conversation">
                  <div>
                    <img
                      src={`${process.env.REACT_APP_BASE_URL}/assets/${
                        userData ? userData.picturePath : console.log("nothing")
                      }`}
                      alt="user"
                      className="followerImage"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                    <div className="name" style={{ fontSize: "0.8rem" }}>
                      <span>
                        {userData ? userData.firstName : ""}{" "}
                        {userData ? userData.lastName : ""}
                      </span>
                      <br />
                    </div>
                  </div>
                </div>
                {/* <hr style={{ width: "85%", border: "0.1px solid #ececec" }} /> */}
              </div>
            </div>
            {/* ChatBox Messages */}
            <div className="chat-body">
              {messages?.map((message) => (
                <>
                  <div
                    ref={scroll}
                    className={
                      message.senderId === currentUser
                        ? "message own"
                        : "message"
                    }
                  >
                    <span>{message.text}</span>
                    <span>{format(message.createdAt)}</span>
                  </div>
                </>
              ))}
            </div>
            {/* Chat Sender */}
            <div className="chat-sender">
              <div>+</div>
              <input
                type="text"
                sx={{ fontSize: "25px" }}
                placeholder="Message"
                value={newMessage}
                onChange={handleChange}
              />
              <div className="send-button button" onClick={handleSend}>
                Send
              </div>
            </div>
          </>
        ) : (
          <span className="chatbox-empty-message">
            Tap on a Chat to start Conversation...
          </span>
        )}
      </div>
    </>
  );
};

export default ChatBox;
