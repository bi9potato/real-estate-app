import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

const signUp = async (req, res, next) => {
    const { username, password, email } = req.body;


    // try {
    //     const hashedPassword = bcrypt.hashSync(password, 10);
    //     const newUser = new User({ username, password: hashedPassword, email });
    //     await newUser.save();
    //     res.status(201).json(
    //         {
    //             success: true,
    //             message: 'User created successfully' 
    //         }
    //     );
    // } catch (error) {
    //     // express skip all miidleware, go to error handling middleware (4 parameters)
    //     next(error);
    // }

    let hashedPassword;
    try {
        hashedPassword = bcrypt.hashSync(password, 10);
        // console.log(hashedPassword);
    } catch (error) {
        // Handle bcrypt error
        next(new Error('Error hashing password'));
        return;
    }

    try {
        const newUser = new User({ username, password: hashedPassword, email });
        await newUser.save();

        // Handle success
        res.status(201).json(
            {
                success: true,
                message: 'User created successfully'
            }
        );

    } catch (error) {
        // Handle MongoDB error
        // express skip all miidleware, go to error handling middleware (4 parameters)
        next(new Error('Error saving user'));
        return;
    }



}

const signIn = async (req, res, next) => {
    // res.send('Sign in');

    const { email, password } = req.body;
    // console.log(email, password);

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            next(errorHandler(404, 'User not found'));
            return;
        }
        // console.log(validUser);

        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) {
            next(errorHandler(400, 'wrong password'));
            return;
        }
        // console.log(validPassword)

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        // console.log(token);

        // remove password from user object
        const { password: pass, ...userWithoutPass } = validUser._doc;
        // return cookie to client
        res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(
                {
                    success: true,
                    message: 'signed in successfully',
                    userWithoutPass
                }
            );

    } catch (error) {
        next(new Error('Error signing in'));
        return;
    }


}

const signInGoogle = async (req, res, next) => {

    try {

        const validUser = await User.findOne({ email: req.body.email });

        if (!validUser) {
            // if validUser does not exist
            // the same as signUp, but create new user with random password
            // then the same as signIn

            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(randomPassword, 10);
            // username get from google has space, so remove space and lowercase it, and add random string
            const newUser = new User(
                {
                    username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                    password: hashedPassword,
                    email: req.body.email,
                    avatar: req.body.photoURL
                }
            );
            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...userWithoutPass } = newUser._doc;

            res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(
                    {
                        success: true,
                        message: 'google signed in successfully',
                        userWithoutPass
                    }
                );

        } else {
            // if validUser exists
            // same as signIn

            const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...userWithoutPass } = validUser._doc;

            res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(
                    {
                        success: true,
                        message: 'google signed in successfully',
                        userWithoutPass
                    }
                );

        }

    } catch (error) {
        next(new Error('Error signing in with Google'));
        return;
    }

};

const signOut = async (req, res, next) => {

    try {

        res
            .clearCookie('access_token')
            .status(200)
            .json(
                {
                    success: true,
                    message: 'signed out successfully'
                }
            );

    } catch (error) {
        next(new Error('Error signing out'));
        return;
    }

}

export { signUp, signIn, signInGoogle, signOut };