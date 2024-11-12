import { Group } from "../models/groupModel.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

// Create a new group
export const createGroup = AsyncHandler(async (req, res) => {
  const { name, description, members } = req.body; // We expect name, description, and members array

  if (!Array.isArray(members) || members.length < 2) {
    return res.status(400).json({ message: "A group must have at least two members." });
  }

  // Add the current user to the members list (assumes the user is req.user.id)
  const userId = req.user.id;
  const newGroup = new Group({
    name,
    description,
    members: [...members, userId], // Include the current user in the group
  });

  const result = await newGroup.save();
  return res.status(201).json(new ApiResponse(201, result, "Group created successfully"));
});

// Get all groups that the current user is a member of
export const getUserGroups = AsyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Find groups where the current user is a member
  const groups = await Group.find({
    members: { $in: [userId] },
  });

  return res.status(200).json(new ApiResponse(200, groups, "Groups retrieved successfully"));
});

// Add members to an existing group
export const addMembersToGroup = AsyncHandler(async (req, res) => {
  const { groupId, newMembers } = req.body;
  const userId = req.user.id;

  // Find the group by ID
  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  // Check if the current user is a member of the group
  if (!group.members.includes(userId)) {
    return res.status(403).json({ message: "You are not authorized to add members to this group" });
  }

  // Add new members to the group (ensure there are no duplicates)
  const updatedMembers = [...new Set([...group.members, ...newMembers])];

  group.members = updatedMembers;
  const updatedGroup = await group.save();

  return res.status(200).json(new ApiResponse(200, updatedGroup, "Members added to the group"));
});

// Remove a member from an existing group
export const removeMemberFromGroup = AsyncHandler(async (req, res) => {
  const { groupId, memberId } = req.body;
  const userId = req.user.id;

  // Find the group by ID
  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  // Check if the current user is the admin or a member of the group
  if (!group.members.includes(userId)) {
    return res.status(403).json({ message: "You are not authorized to remove members from this group" });
  }

  // Remove the member from the group
  group.members = group.members.filter((member) => member !== memberId);

  const updatedGroup = await group.save();
  return res.status(200).json(new ApiResponse(200, updatedGroup, "Member removed from the group"));
});
// Search for groups by name or description
export const searchGroups = AsyncHandler(async (req, res) => {
  const { query } = req.query;

  // Search for groups with a name or description matching the query (case-insensitive)
  const groups = await Group.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
    ],
  });

  return res.status(200).json(new ApiResponse(200, groups, "Groups retrieved successfully"));
});

// Join a group by group ID
export const joinGroup = AsyncHandler(async (req, res) => {
  const { groupId } = req.body;
  const userId = req.user.id;

  // Find the group by ID
  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  // Check if the user is already a member of the group
  if (group.members.includes(userId)) {
    return res.status(400).json({ message: "You are already a member of this group" });
  }

  // Add the user to the group members
  group.members.push(userId);
  const updatedGroup = await group.save();

  return res.status(200).json(new ApiResponse(200, updatedGroup, "Successfully joined the group"));
});
