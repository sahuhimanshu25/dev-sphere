// Conversation.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import userimg from '../../../../public/userimg.jpg';
import "./Conversation.css";

const Conversation = ({ data, currentUserId, onClick }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = data.members.find((id) => id !== currentUserId);
        const { data: user } = await axios.get(`http://localhost:3000/user/${userId}`);
        setUserData(user.data);
        console.log("Conversation user data:", user.data);
      } catch (error) {
        console.error("Error fetching conversation user data:", error);
      }
    };
    fetchUserData();
  }, [data, currentUserId]);

  return (
    <div className="follower conversation" onClick={() => onClick(userData)}>
      <div>
        <div className="online-dot"></div>
        <img src={userimg} alt="" className="followerImage" />
        <div className="name" style={{ fontSize: "0.8rem" }}>
          <span>{userData?.username}</span>
        </div>
        <span>Online</span>
      </div>
      <hr />
    </div>
  );
};

export default Conversation;
