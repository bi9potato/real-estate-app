import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";



export default function Search() {


    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'createdAt',
        order: 'desc',
    });
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {

        const urlParams = new URLSearchParams(location.search);

        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setSidebarData(
                {
                    searchTerm: searchTermFromUrl || '',
                    type: typeFromUrl || 'all',
                    parking: parkingFromUrl === 'true' ? true : false,
                    furnished: furnishedFromUrl === 'true' ? true : false,
                    offer: offerFromUrl === 'true' ? true : false,
                    sort: sortFromUrl || 'createdAt',
                    order: orderFromUrl || 'desc',
                }
            )
        }

        const fetchListings = async () => {

            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get-listings?${searchQuery}`);
            const data = await res.json();

            // console.log(data);

            if (data.listings.length > 8) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }

            setLoading(false);
            setListings(data.listings);

        }
        fetchListings();

        // console.log(urlParams.toString());
        // console.log(listings);

    }, [location.search])


    const handleChange = (e) => {

        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSidebarData(
                {
                    ...sidebarData,
                    type: e.target.id
                }
            )
        }

        if (e.target.id === 'searchTerm') {
            setSidebarData(
                {
                    ...sidebarData,
                    searchTerm: e.target.value
                }
            )
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSidebarData(
                {
                    ...sidebarData,
                    [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false
                }
            )
        }

        if (e.target.id === 'sort_order') {
            const [sort, order] = e.target.value.split('_');
            setSidebarData(
                {
                    ...sidebarData,
                    sort,
                    order
                }
            )
        }


    };


    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(sidebarData);

        const urlParams = new URLSearchParams();

        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('type', sidebarData.type);
        urlParams.set('parking', sidebarData.parking);
        urlParams.set('furnished', sidebarData.furnished);
        urlParams.set('offer', sidebarData.offer);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('order', sidebarData.order);
        const searchQuery = urlParams.toString() ? `?${urlParams.toString()}` : '';

        // console.log(urlParams.toString());

        navigate(`/search${searchQuery}`)

    }


    const onShowMoreCilck = async () => {

        const numberOfListings = listings.length;
        const startIndex = numberOfListings - 1;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();

        const res = await fetch(`/api/listing/get-listings?${searchQuery}`);
        const data = await res.json();

        if (data.listings.length < 9) {
            setShowMore(false);
        }

        setListings([...listings, ...data.listings]);
        

    }


    return (
        <div className='flex flex-col md:flex-row'>

            <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
                <form
                    className='flex flex-col gap-5'
                    onSubmit={handleSubmit}
                >

                    <div className='flex items-center gap-2'>
                        <label
                            htmlFor=""
                            className='whitespace-nowrap font-semibold'
                        >
                            Search Terms
                        </label>
                        <input
                            type="text"
                            id='searchTerm'
                            placeholder='Search Terms'
                            className='border rounded-lg p-3 w-full'
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='flex gap-2 flex-wrap items-center'>
                        <label htmlFor="" className=' font-semibold'>Type</label>

                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                name=""
                                id="all"
                                className='w-5'
                                checked={sidebarData.type === 'all'}
                                onChange={handleChange}
                            />
                            <span>Rent & Sale</span>
                        </div>

                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                name=""
                                id="rent"
                                className='w-5'
                                checked={sidebarData.type === 'rent'}
                                onChange={handleChange}
                            />
                            <span>Rent</span>
                        </div>

                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                name=""
                                id="sale"
                                className='w-5'
                                checked={sidebarData.type === 'sale'}
                                onChange={handleChange}
                            />
                            <span>Sale</span>
                        </div>

                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                name=""
                                id="offer"
                                className='w-5'
                                checked={sidebarData.offer === true}
                                onChange={handleChange}
                            />
                            <span>Offer</span>
                        </div>

                    </div>


                    <div className='flex gap-2 flex-wrap items-center'>
                        <label htmlFor="" className=' font-semibold'>Amenities</label>

                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                name=""
                                id="parking"
                                className='w-5'
                                checked={sidebarData.parking === true}
                                onChange={handleChange}
                            />
                            <span>Parking</span>
                        </div>

                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                name=""
                                id="furnished"
                                className='w-5'
                                checked={sidebarData.furnished === true}
                                onChange={handleChange}
                            />
                            <span>Furnished</span>
                        </div>

                    </div>

                    <div className='flex items-center gap-2'>
                        <label htmlFor="" className=' font-semibold'>Sort</label>
                        <select
                            name=""
                            id="sort_order"
                            className='border rounded-lg p-3'
                            defaultValue={'createdAt_desc'}
                            onChange={handleChange}
                        >
                            <option value="regularPrice_desc">Price hign to low</option>
                            <option value="regularPrice_asc">Price low to hign</option>
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Oldest</option>
                        </select>
                    </div>

                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
                        Search
                    </button>

                </form>
            </div>

            <div className='flex-1'>
                <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
                    Listing results:
                </h1>

                <div className="p-7 flex flex-wrap gap-4">
                    {
                        !loading && listings.length === 0 && (
                            <p className="text-xl text-slate-700">
                                No listing found!
                            </p>
                        )
                    }

                    {
                        loading && (
                            <p className="text-xl text-slate-700">
                                Loading...
                            </p>
                        )
                    }

                    {
                        !loading && listings.length > 0 && listings.map(listing => <ListingItem key={listing._id} listing={listing} />)
                    }

                    {
                        showMore && (
                            <button
                                onClick={
                                    () => {
                                        onShowMoreCilck();
                                    }
                                }
                                className='text-green-700 text-large p-7 uppercase hover:underline test-centre w-full'
                            >
                                Show More
                            </button>
                        )
                    }
                </div>
            </div>


        </div>
    )
}
