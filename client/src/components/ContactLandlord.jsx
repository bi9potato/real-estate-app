import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function ContactLandlord({ listing }) {

    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");


    const onChange = (event) => {
        setMessage(event.target.value);
    }


    useEffect(
        () => {

            const fetchLandlord = async () => {

                try {

                    const response = await fetch(`/api/user/get-user/${listing.userRef}`)
                    const data = await response.json()
                    // console.log(data)

                    if (data.success === true) {
                        setLandlord(data.userWithoutPass);
                    } else if (data.success === false) {
                        setLandlord(null);
                    }

                } catch (error) {
                    setLandlord(null);
                }

            };
            fetchLandlord();

        }, [listing.userRef]
    )

    if (!landlord) {
        return <p>No user</p>;
    }

    return (
        <div className="flex flex-col gap-2">

            <p>
                Contact {" "}
                <span className="font-semibold">{landlord.username}</span> for {" "}
                <span className="font-semibold">{listing.name.toLowerCase()}</span>
            </p>

            <textarea
                name="message" id="message" rows="3" value={message}
                placeholder="Enter your message here"
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg p-3"
            >

            </textarea>

            <Link
                to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                className="bg-slate-700 text-white text-center p-3 rounded-lg hover:opacity-95"
            >
                Send Message
            </Link>

            {/* <a
                href={`mailto:${landlord.email}?subject=Regarding ${encodeURIComponent(listing.name)}&body=${encodeURIComponent(message)}`}
                className="bg-slate-700 text-white text-center p-3 rounded-lg hover:opacity-95"
            >
                Send Message
            </a> */}

        </div>
    )
}
