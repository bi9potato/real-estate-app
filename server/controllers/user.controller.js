import bcriptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listing.model.js';

const test = (req, res) => {
    res.send('user route test');
}

const updateUser = async (req, res, next) => {

    // console.log(req.headers);
    // console.log(req.user_id.id, typeof req.user_id.id);
    // console.log(req.params.id, typeof req.params.id);
    if (req.user_id.id !== req.params.id) {
        return next(errorHandler(401, 'you can only update your own profile'));
    }

    try {

        if (req.body.password) {
            req.body.password = bcriptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                }
            },
            { new: true }

        )

        const { password, ...userWithoutPass } = updatedUser._doc;
        // console.log(userWithoutPass);

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            userWithoutPass,
        });

    } catch (err) {
        next(err);
    }

};

const deleteUser = async (req, res, next) => {

    if (req.user_id.id !== req.params.id) {
        return next(errorHandler(401, 'you can only delete your own account'));
    }

    try {

        await User.findByIdAndDelete(req.params.id);

        res.clearCookie('access_token');
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });

    } catch (err) {
        next(err);
    }

}

const getUserListings = async (req, res, next) => {

    if (req.user_id.id !== req.params.id) {
        return next(errorHandler(401, 'you can only view your own listings'));
    }

    try {

        const listings = await Listing.find({ userRef: req.params.id });

        res.status(200).json(
            {
                success: true,
                message: 'User listings fetched successfully',
                listings,
            }
        );


    } catch (err) {
        next(err);
    }

}

const getUser = async (req, res, next) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const { password, ...userWithoutPass } = user._doc;

        res.status(200).json(
            {
                success: true,
                message: 'User fetched successfully',
                userWithoutPass,
            }
        );

    } catch (err) {
        next(err);
    }

}

export { test, updateUser, deleteUser, getUserListings, getUser };
