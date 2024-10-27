import { Message } from '../models/messageModel.js';
import  ErrorHandler  from "../utils/errorHandler.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
// Add a new message to a chat
export const addMessage =AsyncHandler( async (req, res) => {
  try {
    const { chatId, text } = req.body;
    const senderId = req.user.id;  // Use the logged-in user's ID as the senderId

    // Create a new message instance
    const message = new Message({
      chatId,
      senderId,
      text,
    });

    // Save the message to the database
    const result = await message.save();
    console.log(result);
    
    // Respond with the saved message
    res.status(200).json(result);
  } catch (error) {
    // Handle any errors and return a meaningful response
    throw new ErrorHandler(500,'Failed to add message')
  }
});

// Get all messages from a specific chat
export const getMessages =AsyncHandler( async (req, res) => {
  const { chatId } = req.params;

  try {
    // Find all messages in the specified chat
    const messages = await Message.find({ chatId });
    // Respond with the list of messages
    res.status(200).json(messages);
  } catch (error) {
    // Handle errors and return a meaningful response
    throw new ErrorHandler(500,'Failed to retrieve messages')
  }
});