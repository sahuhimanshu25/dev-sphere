import { useState, useEffect } from "react"
import axios from "axios"
import { FaPlus, FaSearch, FaUsers, FaUserPlus } from "react-icons/fa"
import "./AddFriend.css"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"

const AddFriend = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [groupSearchTerm, setGroupSearchTerm] = useState("")
  const [groupSearchResults, setGroupSearchResults] = useState([])
  const [followersList, setFollowersList] = useState([])
  const [groupName, setGroupName] = useState("")
  const [groupDescription, setGroupDescription] = useState("")
  const [selectedMembers, setSelectedMembers] = useState([])
  const { token } = useSelector((state) => state.user)

  useEffect(() => {
    fetchUserFollowers()
  }, [])

  const fetchUserFollowers = async () => {
    try {
      const { data } = await axios.get(`/user/me`, {
        withCredentials: true,
      })
      const followers = data.data.followers

      const followerDetails = followers.map((follower) => ({
        _id: follower._id,
        username: follower.username,
      }))

      setFollowersList(followerDetails)
    } catch (error) {
      console.error("Error fetching followers list:", error)
      toast.error("Failed to fetch followers list.")
    }
  }

  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const { data } = await axios.get(
          `/user/search-user?username=${searchTerm}`,
          {
            withCredentials: true,
          },
        )
        setSearchResults(data.data)
      } catch (error) {
        console.error("Error searching users:", error)
      }
    }
  }

  const handleGroupSearch = async () => {
    if (groupSearchTerm) {
      try {
        const { data } = await axios.get(
          `/group/search?query=${groupSearchTerm}`,
          {
            withCredentials: true,
          },
        )
        setGroupSearchResults(data.data)
      } catch (error) {
        console.error("Error searching groups:", error)
        toast.error("Failed to search for groups.")
      }
    }
  }

  const handleFollow = async (userId) => {
    try {
      await axios.put(
        `/follow/${userId}`,
        {},
        {
          withCredentials: true,
        },
      )
      await axios.post(
        `/chat/create`,
        {
          receiverId: userId,
        },
        {
          withCredentials: true,
        },
      )
      toast.success("User followed successfully!")
    } catch (error) {
      console.error("Error following user:", error)
      toast.error(error.response?.data?.error || "Error following user")
    }
  }

  const handleJoinGroup = async (groupId) => {
    try {
      await axios.post(
        `/group/join`,
        { groupId },
        {
          withCredentials: true,
        },
      )
      toast.success("Successfully joined the group!")
    } catch (error) {
      console.error("Error joining group:", error)
      toast.error(error.response?.data?.message || "Error joining group")
    }
  }

  const handleCreateGroup = async () => {
    if (!groupName || !groupDescription || selectedMembers.length < 1) {
      toast.error("Please fill all fields and select at least one additional member.")
      return
    }

    try {
      await axios.post(
        `/group/create`,
        {
          name: groupName,
          description: groupDescription,
          members: selectedMembers,
        },
        {
          withCredentials: true,
        },
      )
      toast.success("Group created successfully!")
      setGroupName("")
      setGroupDescription("")
      setSelectedMembers([])
    } catch (error) {
      console.error("Error creating group:", error)
      toast.error(error.response?.data?.message || "Error creating group")
    }
  }

  const handleMemberSelect = (memberId) => {
    setSelectedMembers((prevMembers) =>
      prevMembers.includes(memberId) ? prevMembers.filter((id) => id !== memberId) : [...prevMembers, memberId],
    )
  }

  return (
    <div className="add-friend-container">
      <div className="container-header">
        <h1 className="page-title">Connect & Create</h1>
        <p className="page-subtitle">Find friends, join groups, and build your community</p>
      </div>

      <div className="content-grid">
        {/* Left Column - Search Section */}
        <div className="search-section">
          {/* User Search Card */}
          <div className="search-card">
            <div className="card-header">
              <div className="header-icon">
                <FaUserPlus />
              </div>
              <div className="header-content">
                <h3>Find Users</h3>
                <p>Search and connect with new friends</p>
              </div>
            </div>

            <div className="search-input-group">
              <div className="input-wrapper">
                <FaSearch className="input-icon" />
                <input
                  type="text"
                  placeholder="Enter username to search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <button onClick={handleSearch} className="search-btn">
                Search
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="results-container">
                <div className="results-header">
                  <span className="results-count">{searchResults.length} users found</span>
                </div>
                <div className="results-list">
                  {searchResults.map((user) => (
                    <div key={user._id} className="result-item">
                      <div className="user-info">
                        <div className="avatar-wrapper">
                          <img
                            src={user.avatar || "/placeholder.svg?height=40&width=40&query=user avatar"}
                            alt={`${user.username}'s avatar`}
                            className="user-avatar"
                          />
                        </div>
                        <div className="user-details">
                          <span className="username">@{user.username}</span>
                        </div>
                      </div>
                      <button onClick={() => handleFollow(user._id)} className="follow-btn" title="Follow user">
                        <FaPlus />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Group Search Card */}
          <div className="search-card">
            <div className="card-header">
              <div className="header-icon">
                <FaUsers />
              </div>
              <div className="header-content">
                <h3>Find Groups</h3>
                <p>Discover and join communities</p>
              </div>
            </div>

            <div className="search-input-group">
              <div className="input-wrapper">
                <FaSearch className="input-icon" />
                <input
                  type="text"
                  placeholder="Search groups by name or description..."
                  value={groupSearchTerm}
                  onChange={(e) => setGroupSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <button onClick={handleGroupSearch} className="search-btn">
                Search
              </button>
            </div>

            {groupSearchResults.length > 0 && (
              <div className="results-container">
                <div className="results-header">
                  <span className="results-count">{groupSearchResults.length} groups found</span>
                </div>
                <div className="results-list">
                  {groupSearchResults.map((group) => (
                    <div key={group._id} className="result-item group-item">
                      <div className="group-info">
                        <div className="group-icon">
                          <FaUsers />
                        </div>
                        <div className="group-details">
                          <span className="group-name">{group.name}</span>
                          <span className="group-description">{group.description}</span>
                        </div>
                      </div>
                      <button onClick={() => handleJoinGroup(group._id)} className="join-btn" title="Join group">
                        <FaPlus />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Create Group Section */}
        <div className="create-section">
          <div className="create-card">
            <div className="card-header">
              <div className="header-icon">
                <FaUsers />
              </div>
              <div className="header-content">
                <h3>Create New Group</h3>
                <p>Start your own community</p>
              </div>
            </div>

            <div className="form-container">
              <div className="form-group">
                <label className="form-label">Group Name</label>
                <input
                  type="text"
                  placeholder="Enter group name..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  placeholder="Describe your group's purpose..."
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  className="form-textarea"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Select Members ({selectedMembers.length} selected)</label>
                <div className="members-container">
                  {followersList.length > 0 ? (
                    <div className="members-list">
                      {followersList.map((follower) => (
                        <div key={follower._id} className="member-item">
                          <label className="member-checkbox">
                            <input
                              type="checkbox"
                              checked={selectedMembers.includes(follower._id)}
                              onChange={() => handleMemberSelect(follower._id)}
                            />
                            <span className="checkmark"></span>
                            <span className="member-name">@{follower.username}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>No followers available to add to the group.</p>
                    </div>
                  )}
                </div>
              </div>

              <button onClick={handleCreateGroup} className="create-btn">
                <FaUsers className="btn-icon" />
                Create Group
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddFriend