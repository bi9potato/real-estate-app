import express from 'express';
import { test, updateUser, deleteUser, getUserListings, getUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';



const userRouter = express.Router();

userRouter.get('/test', test);
userRouter.post('/update-user/:id', verifyToken, updateUser);
userRouter.delete('/delete-user/:id', verifyToken, deleteUser);
userRouter.get('/get-user-listings/:id', verifyToken, getUserListings);
userRouter.get('/get-user/:id', verifyToken, getUser);

export default userRouter;