import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';

import ListingItem from '../components/ListingItem';

export default function Home() {


  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  SwiperCore.use([Navigation]);

  useEffect(() => {

    const fetchOfferListings = async () => {

      // offer listings
      try {
        const response = await fetch('api/listing/get-listings?offer=true&&limit=4');
        const data = await response.json();

        console.log(data);

        setOfferListings(data.listings);

        fetchRentListings();
        fetchSaleListings();


      } catch (error) {
        console.log(error);
      }

    }
    fetchOfferListings();

    const fetchRentListings = async () => {

      try {
        const response = await fetch('api/listing/get-listings?type=rent&&limit=4');
        const data = await response.json();

        console.log(data);

        setRentListings(data.listings);

      } catch (error) {
        console.log(error);
      }

    }

    const fetchSaleListings = async () => {

      try {
        const response = await fetch('api/listing/get-listings?type=sale&&limit=4');
        const data = await response.json();

        console.log(data);

        setSaleListings(data.listings);

      } catch (error) {
        console.log(error);
      }

    }

  }, []);


  return (
    <>

      <div>

        {/* top */}
        <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>

          <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
            Find yout next <span className='text-slate-500'>perfect</span>
            <br />
            place with ease
          </h1>

          <div className='text-gray-400 text-xs sm:text-sm'>
            Real Estate is the perfect choice for you to find your next place to live.
            <br />
            We have a wide range of properties for you to choose from.
          </div>

          <Link to={"/search"} className='text-xs sm:text-blue-800 font-bold hover:underline'>
            Let's get started ...
          </Link>


        </div>


        {/* swiper */}
        <Swiper navigation>
          {
            offerListings && offerListings.length > 0 &&
            offerListings.map(
              (listing) => {
                return (
                  <SwiperSlide>
                    <div style={{ background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover' }} className='h-[500px]' key={listing._id}>

                    </div>
                  </SwiperSlide>
                );

              }
            )
          }
        </Swiper>




        {/* listing results for offer, sale and rent */}
        <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
          
          {/* offer */}
          {
            offerListings && offerListings.length > 0 && (
              <div className=''>

                <div className='my-3'>
                  <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
                  <Link to={`search?offer=true`} className='text-sm text-blue-800 hover:underline'>
                    Show more offers
                  </Link>
                </div>

                <div className='flex flex-wrap gap-4'>
                  {
                    offerListings.map(
                      (listing) => {
                        return (
                          <ListingItem listing={listing} key={listing._id} />
                        );
                      }
                    )
                  }
                </div>

              </div>
            )
          }

          {/* rent */}
          {
            offerListings && offerListings.length > 0 && (
              <div className=''>

                <div className='my-3'>
                  <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
                  <Link to={`search?type=rent`} className='text-sm text-blue-800 hover:underline'>
                    Show more places for rent

                  </Link>
                </div>

                <div className='flex flex-wrap gap-4'>
                  {
                    rentListings.map(
                      (listing) => {
                        return (
                          <ListingItem listing={listing} key={listing._id} />
                        );
                      }
                    )
                  }
                </div>

              </div>
            )
          }
          {
            saleListings && saleListings.length > 0 && (
              <div className=''>

                <div className='my-3'>
                  <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
                  <Link to={`search?type=sale`} className='text-sm text-blue-800 hover:underline'>
                    Show more places for sale

                  </Link>
                </div>

                <div className='flex flex-wrap gap-4'>
                  {
                    saleListings.map(
                      (listing) => {
                        return (
                          <ListingItem listing={listing} key={listing._id} />
                        );
                      }
                    )
                  }
                </div>

              </div>
            )
          }
        </div>


      </div>

    </>
  )
}
