import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {

        username: {
            type: String,
            required: true,
            unique: true,
            // min: 6,
            // max: 15
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: "https://toppng.com/uploads/preview/instagram-default-profile-picture-11562973083brycehrmyv.png"
        },


    },
    { timestamps: true }
)

const User = mongoose.model("User", userSchema);

export default User;