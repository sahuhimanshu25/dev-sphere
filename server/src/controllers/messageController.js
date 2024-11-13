import { Message } from '../models/messageModel.js';
import ErrorHandler from "../utils/errorHandler.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

// Add a new message to a chat
export const addMessage = AsyncHandler(async (req, res, next) => {
  const { chatId, text, isGroup } = req.body;
  const senderId = req.user.id;  // Use the logged-in user's ID as the senderId

  try {
    // Create a new message instance
    const messageData = { chatId, senderId, text };
    if (isGroup) messageData.isGroup = isGroup;
    
    const message = new Message(messageData);
    const result = await message.save();

    // Respond with the saved message
    res.status(200).json(new ApiResponse(200, "Message added successfully", result));
  } catch (error) {
    next(new ErrorHandler(500, 'Failed to add message'));
  }
});

// Get all messages from a specific chat
export const getMessages = AsyncHandler(async (req, res, next) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId });
    res.status(200).json(new ApiResponse(200, "Messages retrieved successfully", messages));
  } catch (error) {
    next(new ErrorHandler(500, 'Failed to retrieve messages'));
  }
});
