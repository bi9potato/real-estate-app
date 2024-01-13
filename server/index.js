import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';

// load environment variables
dotenv.config();

const app = express();

// allow json as the input to server
app.use(express.json());
// it is used to parse the cookie header and populate req.cookies with an object keyed by the cookie names
app.use(cookieParser());
// allow cross origin resource sharing
app.use(cors());

// connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// start server
app.listen(3000, () => {
    console.log('Server is running on port 3000!');
});


app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);


// error handling middleware, 4 parameters
app.use( (err, req, res, next) => {

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message,
    });

});
