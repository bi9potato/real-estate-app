import { useSelector } from 'react-redux'
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {

  const { currentUser, loading, error } = useSelector(state => state.user);

  const fileRef = useRef(null);

  const [file, setFile] = useState(undefined);
  // console.log(file);
  const [filePercent, setFilePercent] = useState(0);
  // console.log(filePercent);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  // console.log(formData);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [deleteListingError, setDeleteListingError] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        setFilePercent(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        // console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL) => {
            setFormData({ ...formData, avatar: downloadURL });
          }
        )

      }
    );



  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);

    dispatch(updateUserStart());

    const res = await fetch(`/api/user/update-user/${currentUser._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await res.json();
    // console.log(data);

    if (data.success === false) {
      // console.log(data.message);
      dispatch(updateUserFailure(data.message));
      setUpdateSuccess(false);
    } else if (data.success === true) {
      // console.log(data.userWithoutPass);
      setFormData({}); // clear form, avoid user submit same data again
      dispatch(updateUserSuccess(data.userWithoutPass));
      setUpdateSuccess(true);
    }


  }

  const handleDeleteUser = async () => {

    try {

      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete-user/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      // console.log(data);

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
      } else if (data.success === true) {
        dispatch(deleteUserSuccess(data.message));
      }

    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }

  }

  const handleSignOut = async () => {

    try {

      dispatch(signOutStart());

      const res = await fetch("/api/auth/sign-out",
        {
          method: "GET",
        }
      );

      const data = await res.json();
      // console.log(data);

      if (data.success === true) {
        dispatch(signOutSuccess());
      } else if (data.success === false) {
        dispatch(signOutFailure(data.message));
      }

    } catch (error) {
      console.log(error);
    }

  }


  const showListings = async () => {

    try {

      setShowListingsError(false);

      const res = await fetch(`/api/user/get-user-listings/${currentUser._id}`,
        {
          method: "GET",
        }
      );

      const data = await res.json();
      // console.log(data);

      if (data.success === true) {
        // console.log(data.listings);
        setUserListings(data.listings);
      } else if (data.success === false) {
        setShowListingsError(true);
      }

    } catch (error) {
      setShowListingsError(true);
    }

  }


  const handleListingDelete = async (listingId) => {

    try {

      const res = await fetch(`/api/listing/delete-listing/${listingId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      // console.log(data);

      if (data.success === true) {
        // console.log(data.listings);
        setUserListings(
          userListings.filter((listing) => listing._id !== listingId)
        );
      } else if (data.success === false) {
        setDeleteListingError(true);
      }

    } catch (error) {
      setDeleteListingError(true);
    }

  }


  // firebase storage
  // allow read;
  // allow write: if
  //    request.resource.size < 20 * 1024 * 1024 &&
  //    request.resource.contentType.matches('image/.*')
  return (

    <div className='p-3 max-w-lg mx-auto'>

      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        <input
          onChange={(e) => { setFile(e.target.files[0]) }}
          type="file"
          ref={fileRef}
          hidden accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="avatar"
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center'
        />
        <p className='text-sm self-center'>
          {
            fileUploadError ? (
              <span className='text-red-700'>Error uploading image</span>
            ) : filePercent > 0 && filePercent < 100 ? (
              <span className='text-green-700'>Uploading image {filePercent}%</span>
            ) : filePercent === 100 ? (
              <span className='text-green-700'>Succesfully upload image!</span>
            ) : (
              ""
            )
          }
        </p>

        <input
          type="text"
          defaultValue={currentUser.username}
          placeholder='username'
          id='username'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type="email"
          defaultValue={currentUser.email}
          placeholder='email'
          id='email'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder='password'
          id='password'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />

        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? "Loading..." : "Update"}
        </button>

        <Link
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
          to={"/create-listing"}
        >
          Creating listing
        </Link>

      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'User is updated successfully' : ''}</p>

      <button
        className='text-green-700 w-full'
        onClick={showListings}
      >
        Show listings
      </button>
      <p className='text-red-700 mt-5'>{showListingsError ? 'Error show listings' : ''}</p>

      {userListings && userListings.length > 0 &&

        <div className='flex flex-col gap-4'>

          <h1 className='text-center text-2xl font-semibold'>Your Listings</h1>

          {
            userListings.map((listing) => (

              <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>

                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="img"
                    className='h-16 w-16 object-contain'
                  />
                </Link>
                <Link to={`/listing/${listing._id}`} className='text-slate-700 font-semibold flex-1 hover:underline truncate'>
                  <p>{listing.name}</p>
                </Link>

                <div className='flex flex-col item-center'>

                  <button
                    className='text-red-700 uppercase'
                    onClick={() => { handleListingDelete(listing._id) }}
                  >
                    Delete
                  </button>

                  <Link to={`/update-listing/${listing._id}`}>
                  <button
                    className='text-green-700 uppercase'
                  >
                    Edit
                  </button>
                  </Link>

                </div>

              </div>

            ))
          }
        </div>

      }

    </div>

  )
}
