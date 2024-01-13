import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleGoogleClick = async (e) => {
        e.preventDefault();

        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const googleAccountInfo = await signInWithPopup(auth, provider);
            // console.log(res);

            const res = await fetch("/api/auth/sign-in-google",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: googleAccountInfo.user.displayName,
                        email: googleAccountInfo.user.email,
                        photoURL: googleAccountInfo.user.photoURL,
                    }),

                }
            );
            // console.log(res);

            const data = await res.json();
            dispatch(signInSuccess(data.userWithoutPass));

            navigate("/");

        } catch (err) {
            console.log('could not sign in with google', err);
        }

    }


    return (
        <button onClick={handleGoogleClick} className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Continue with Google
        </button>
    )
}
