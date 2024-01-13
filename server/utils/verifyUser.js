import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {

    const token = req.cookies.access_token;

    if (!token) {
        return next(errorHandler(401, 'you need to login first'));
    };

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        // token is encrypted with user_id, so we decrypt it and get user_id in user of payload
        (err, user_id) => {
            if (err) {
                return next(errorHandler(403, 'decryption failed'));
            }

            // console.log("成功解开token", user_id);
            req.user_id = user_id;
            next();
        }
    );


};