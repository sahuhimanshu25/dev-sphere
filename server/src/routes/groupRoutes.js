import express from 'express'
import { isAuthenticated } from '../middlewares/auth.js';
import { addMembersToGroup, createGroup, getGroupDetails, getUserGroups, joinGroup, searchGroups } from '../controllers/groupController.js';
export const groupRouter=express.Router();

groupRouter.post('/create',isAuthenticated,createGroup);
groupRouter.get('/getUserGroups',isAuthenticated,getUserGroups)
groupRouter.put('/add-members',isAuthenticated,addMembersToGroup)
groupRouter.get('/search',isAuthenticated,searchGroups);
groupRouter.post('/join',isAuthenticated,joinGroup)
groupRouter.get('/:id',isAuthenticated,getGroupDetails)