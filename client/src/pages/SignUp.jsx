import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // setError(null);
  }
  // console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    // console.log(JSON.stringify(formData));

    setLoading(true);

    const res = await fetch("/api/auth/sign-up",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      }
    );
    const data = await res.json();
    // console.log(data);

    if (data.success === false) {
      setLoading(false);
      setError(data.message);
    } else if (data.success === true) {
      setLoading(false);
      setError(null);
      // sign up successful then redirect to sign-in page
      navigate("/sign-in");
    }

  }


  return (
    <div className="p-3 max-w-lg mx-auto">

      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />

        <button disabled={loading} className="bg-slate-700 text-white p-3  rounded-lg uppercase hover:opacity-90 disabled:opacity-75" >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        <OAuth />

      </form>


      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-600">Sign in</span>
        </Link>
      </div>

      {error && <p className="text-red-500 mt-5">{error}</p>}

    </div>
  )
}