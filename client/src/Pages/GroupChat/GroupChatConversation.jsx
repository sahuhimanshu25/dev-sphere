import React, { useEffect, useState } from "react";
import axios from "axios";
import userimg from "../../../public/userimg.jpg";
import "./GroupChatConversation.css";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader";

const GroupChatConversation = ({ group, onSelect, selectedGroup }) => {
  const { token } = useSelector((state) => state.user);
  const [groupData, setGroupData] = useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/group/${group._id}`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
        setGroupData(data);
        // console.log("Group data:", groupData?.data?.name);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
      finally{
        setLoading(false);
      }
    };
    fetchGroupData();
  }, [group._id]);

  const handleClick = () => {
    onSelect(groupData); 
  };
  if (loading) {
    return (
      <div className="conv-loader-wrapper">
        <Loader /> {/* Display the loader while loading */}
      </div>
    );
  }
  return (
    <div
      className={`group-conversation ${selectedGroup === groupData?.data?.name ? "group-conversation-selected" : ""}`}
      onClick={handleClick}
    >
      <div className="group-conversation-det">
        <img src={userimg} alt="" />
        <div className="group-name">
          <span>{groupData?.data?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default GroupChatConversation;
