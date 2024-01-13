import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from "swiper/modules";
import 'swiper/css/bundle';
import { FaShare, FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";
import {useSelector} from "react-redux";
import ContactLandlord from "../components/ContactLandlord";

export default function Listing() {

    SwiperCore.use([Navigation]);

    const params = useParams()
    // console.log(params)

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [contactLandlord, setContactLandlord] = useState(false);

    const curentUser = useSelector((state) => state.user.currentUser);

    useEffect(
        () => {

            const fetchListing = async () => {

                try {

                    setLoading(true);

                    const response = await fetch(`/api/listing/get-listing/${params.listingId}`)
                    const data = await response.json()
                    // console.log(data)

                    if (data.success === true) {
                        setListing(data.listing);
                        setError(false);
                        setLoading(false);
                    } else if (data.success === false) {
                        setError(true);
                        setLoading(false);
                    }

                } catch (error) {
                    setError(true);
                    setLoading(false);
                }

            };
            fetchListing();

        }, []
    )

    return (
        <main>
            {loading && <p className="text-cen">Loading...</p>}
            {error && <p className="text-center">Error</p>}
            {
                listing && !loading && !error && <>

                    <Swiper>
                        {
                            listing.imageUrls.map(
                                (imageUrl) => (
                                    <SwiperSlide key={imageUrl}>
                                        <div
                                            className="h-[550px]"
                                            style={{
                                                background: `url(${imageUrl}) center no-repeat`,
                                                backgroundSize: "cover"
                                            }}
                                        >

                                        </div>
                                    </SwiperSlide>
                                )
                            )
                        }
                    </Swiper>

                    <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
                        <FaShare
                            className="text-slate-500"
                            onClick={
                                () => {
                                    navigator.clipboard.writeText(window.location.href);
                                    setLinkCopied(true);
                                    setTimeout(
                                        () => {
                                            setLinkCopied(false)
                                        }, 2000
                                    );
                                }
                            }
                        />
                    </div>

                    {
                        linkCopied && (
                            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
                                Link copied
                            </p>
                        )
                    }

                    <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-6">
                        <p className="text-2xl font-semibold">
                            {listing.name} - ${" "} {
                                listing.offer ? listing.discountPrice.toLocaleString("en-US") : listing.regularPrice.toLocaleString("en-US")
                            }
                            {listing.type === "rent" && " / month"}
                        </p>

                        <p className="flex items-center mt-6 gap-2 text-slate-600 my-2 text-sm">
                            <FaMapMarkerAlt className="text-green-700" />
                            {listing.address}
                        </p>

                        <div className="flex gap-4">
                            <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                                {
                                    listing.type === "rent" ? "For rent" : "For sale"
                                }
                            </p>
                            {
                                listing.offer && (
                                    <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                                        ${+listing.regularPrice - +listing.discountPrice} off
                                    </p>
                                )
                            }
                        </div>

                        <p className="text-slate-800">
                            <span className="font-semibold text-black">
                                Description - {" "}
                            </span>
                            {listing.description}
                        </p>

                        <ul className="text-green-900 font-semibold text-sm flex items-center gap-4 sm:gap-6 flex flex-wrap">
                            <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaBed className="text-lg"/>
                                {
                                    listing.bedrooms > 1 ? `${listing.bedrooms} bedrooms` : `${listing.bedrooms} bedroom`
                                }
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaBath className="text-lg"/>
                                {
                                    listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms` : `${listing.bathrooms} bathroom`
                                }
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaParking className="text-lg"/>
                                {
                                    listing.parking ? "Parking available" : "No parking"
                                }
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaChair className="text-lg"/>
                                {
                                    listing.furnished ? "Furnished" : "Not furnished"
                                }
                            </li>
                        </ul>
                        
                        {
                            curentUser && !contactLandlord && listing.userRef !== curentUser._id && (
                                <button 
                                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
                                onClick={
                                    () => {
                                        setContactLandlord(true);
                                    }
                                }
                                >
                                    Contact Landlord
                                </button>
                            )
                        }

                        {contactLandlord && <ContactLandlord listing={listing}/>}

                    </div>


                </>
            }
        </main>
    )
}
