import React, { useEffect, useState } from "react";
import axios from "axios";
import { HiUserGroup } from "react-icons/hi";

import "./GroupChatConversation.css";

const GroupChatConversation = ({ group, onSelect }) => {
  const [groupData, setGroupData] = useState(null);

  // Fetch group data on component mount
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/group/${group._id}`);
        setGroupData(data);
        console.log("Group data:", data);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchGroupData();
  }, [group._id]);

  return (
    <div className="group-conversation" onClick={() => onSelect(groupData)}>
      <div>
        <HiUserGroup/>
        <div className="group-name" style={{ fontSize: "0.8rem" }}>
          <span>{groupData?.name}</span>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default GroupChatConversation;
