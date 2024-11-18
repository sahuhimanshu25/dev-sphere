import React, { useEffect, useState } from "react";
import axios from "axios";
import userimg from "../../../../public/userimg.jpg";
import "./Conversation.css";

const Conversation = ({ data, currentUserId, onClick, onlineUsers }) => {
  const [userData, setUserData] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = data.members.find((id) => id !== currentUserId);
        const { data: user } = await axios.get(`http://localhost:3000/user/${userId}`);
        setUserData(user.data);
        console.log("Conversation user data:", user.data.userdata);
        setIsOnline(onlineUsers.some((user) => user.userId === userId));
      } catch (error) {
        console.error("Error fetching conversation user data:", error);
      }
    };
    fetchUserData();
  }, [data, currentUserId, onlineUsers]);

  const handleClick = () => {
    setSelectedChat(userData?.userdata.username); 
    // onClick(userData); 
  };

  return (
    <div
      className={`conv-follower conv-conversation ${
        selectedChat === userData?.userdata.username ? "conv-selected" : ""
      }`}
      onClick={handleClick}
    >
      <div className="conv-list">
        <div>
          <div className="conv-img-wrapper">
            <img src={userData?.userdata.avatar} alt="" className="conv-followerImage" />
            <div className={`conv-online-dot ${isOnline ? "conv-online" : "conv-offline"}`}></div>
          </div>
          <div className="conv-name">
            <span>{userData?.userdata.username}</span>
          </div>
        </div>
        <div className="conv-on-s">
          <span className={isOnline ? "Online-s" : "Offline-s"}>{isOnline ? "Online" : "Offline"}</span>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
