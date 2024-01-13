import { useEffect, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';


export default function CreateListing() {

    const { currentUser } = useSelector(state => state.user);


    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState(
        {
            imageUrls: [],
            name: '',
            description: '',
            address: '',
            type: 'rent',
            bedrooms: 1,
            bathrooms: 1,
            regularPrice: 0,
            discountPrice: 0,
            offer: false,
            parking: false,
            furnished: false,
        }
    );
    // console.log(formData);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const params = useParams();

    useEffect(
        () => {

            const fetchListing = async () => {

                const listingId = params.listingId;
                const res = await fetch(`/api/listing/get-listing/${listingId}`);
                const data = await res.json();

                setFormData(data.listing);

                if (data.success === false) {
                    setError(data.message);
                } else if (data.success === true) {
                    setError(false);
                }

            }

            fetchListing();

        },
        []
    );



    const handleImageSubmit = (e) => {
        e.preventDefault();

        // check if all files are images
        const allFilesAreImages = Array.from(files).every(file => file.type.startsWith('image/'));
        if (!allFilesAreImages) {
            setImageUploadError('Only image files are allowed');
            return;
        }

        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {

            setUploading(true);
            setImageUploadError(false);

            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData(
                        {
                            ...formData,
                            imageUrls: formData.imageUrls.concat(urls)
                        }
                    );
                    setImageUploadError(false);
                    setUploading(false);
                })
                .catch((err) => {
                    setImageUploadError('Error uploading images (20 MB per img max)');
                });

        } else if (files.length + formData.imageUrls.length == 0) {
            setImageUploadError('No images selected');

        } else {
            setImageUploadError('Error uploading images (6 images max)');
            setUploading(false);
        }

    }

    const storeImage = (file) => {

        return new Promise((resolve, reject) => {

            const storage = getStorage(app);
            const imageRef = new Date().getTime() + file.name;
            const storageRef = ref(storage, imageRef);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });

    }


    const handleRemoveImg = (e, index) => {

        e.preventDefault();

        setFormData(
            {
                ...formData,
                imageUrls: formData.imageUrls.filter((url, i) => i !== index)
            }
        );

    }


    const handleChanges = (e) => {

        const { id, value, checked } = e.target;

        if (id === 'sale' || id === 'rent') {
            setFormData(
                {
                    ...formData,
                    type: id
                }
            );
        } else if (id === 'parking' || id === 'furnished' || id === 'offer') {
            setFormData(
                {
                    ...formData,
                    [id]: checked
                }
            );
        } else {
            setFormData(
                {
                    ...formData,
                    [id]: value
                }
            );
        }

    }



    const handleSubmit = async (e) => {
        e.preventDefault();

        // console.log(formData);

        try {

            if (formData.imageUrls.length < 1) {
                setError('Please upload at least one image');
                return;
            }
            if (+formData.regularPrice < +formData.discountPrice) {
                setError('Discount price cannot be higher than regular price');
                return;
            }

            setLoading(true);
            setError(false);

            const res = await fetch(`/api/listing/update-listing/${params.listingId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            ...formData,
                            userRef: currentUser._id
                        }
                    )
                }
            );
            const data = await res.json();
            setLoading(false);

            if (data.success === true) {
                // console.log(data);
                navigate(`/listing/${params.listingId}`);
            } else if (data.success === false) {
                setError(data.message);
            }


        } catch (error) {
            setError(error.message);
            setLoading(false);
        }

    }


    // firebase storage
    // allow read;
    // allow write: if
    //    request.resource.size < 20 * 1024 * 1024 &&
    //    request.resource.contentType.matches('image/.*')
    return (
        <main className="p-3 max-w-4xl mx-auto">

            <h1 className="text-3xl font-semibold text-center my-7">
                Update a listing
            </h1>

            <form
                className="flex flex-col sm:flex-row gap-4"
                onSubmit={handleSubmit}
            >

                {/* left side */}
                <div className="flex flex-col gap-4 flex-1">
                    <input
                        type="text"
                        placeholder="Name"
                        className="border p-3 rounded-lg"
                        id="name"
                        maxLength='26'
                        minLength='6'
                        required
                        value={formData.name}
                        onChange={handleChanges}
                    />
                    <textarea
                        type="text"
                        placeholder="Description"
                        className="border p-3 rounded-lg"
                        id="description"
                        required
                        value={formData.description}
                        onChange={handleChanges}
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        className="border p-3 rounded-lg"
                        id="address"
                        required
                        value={formData.address}
                        onChange={handleChanges}
                    />

                    {/* checkbox */}
                    <div className="flex gap-6 flex-wrap">

                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="sale"
                                className="w-5"
                                checked={formData.type === 'sale'}
                                onChange={handleChanges}
                            />
                            <span>Sale</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="rent"
                                className="w-5"
                                checked={formData.type === 'rent'}
                                onChange={handleChanges}
                            />
                            <span>Rent</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="parking"
                                className="w-5"
                                checked={formData.parking}
                                onChange={handleChanges}
                            />
                            <span>Parking spot</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="furnished"
                                className="w-5"
                                checked={formData.furnished}
                                onChange={handleChanges}
                            />
                            <span>Furnished</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="offer"
                                className="w-5"
                                checked={formData.offer}
                                onChange={handleChanges}
                            />
                            <span>Offer</span>
                        </div>

                    </div>

                    {/* number of rooms and prices */}
                    <div className="flex flex-wrap gap-6">

                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                id="bedrooms"
                                min="1"
                                max="10"
                                required
                                className="p-3 border-gray-300 rounded-lg"
                                value={formData.bedrooms}
                                onChange={handleChanges}
                            />
                            <p>Beds</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                id="bathrooms"
                                min="1"
                                max="10"
                                required
                                className="p-3 border-gray-300 rounded-lg"
                                value={formData.bathrooms}
                                onChange={handleChanges}
                            />
                            <p>Baths</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                id="regularPrice"
                                min="0"
                                max="999999"
                                required
                                className="p-3 border-gray-300 rounded-lg"
                                value={formData.regularPrice}
                                onChange={handleChanges}
                            />
                            <div className="flex flex-col items-center">
                                <p>Regular price</p>
                                {
                                    formData.type === 'rent' && (
                                        <span className="text-xs">($ / month)</span>
                                    )
                                }
                            </div>
                        </div>

                        {
                            formData.offer && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        id="discountPrice"
                                        min="0"
                                        max="999999"
                                        required
                                        className="p-3 border-gray-300 rounded-lg"
                                        value={formData.discountPrice}
                                        onChange={handleChanges}
                                    />
                                    <div className="flex flex-col items-center">
                                        <p>Discount price</p>
                                        {
                                            formData.type === 'rent' && (
                                                <span className="text-xs">($ / month)</span>
                                            )
                                        }
                                    </div>
                                </div>
                            )
                        }


                    </div>

                </div>

                {/* right side */}
                <div className="flex flex-col gap-4 flex-1 ">

                    <p className="font-semibold">
                        Images:
                        <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                    </p>

                    <div className="flex gap-4">
                        <input
                            onChange={(e) => setFiles(e.target.files)}
                            type="file"
                            id="images"
                            accept="image/*"
                            className="p-3 border border-gray-300 rounded w-full"
                            multiple
                        />
                        <button
                            onClick={handleImageSubmit}
                            disabled={uploading || loading}
                            className="p-3 text-green-700 border border-green-700 rounded-lg uppercase hover:shadow-lg disabled:opacity-80"
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>

                    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div key={index} className='flex justify-between p-3 border items-center'>
                                <img src={url} alt="img" className='w-20 h-20 object-contain rounded-lg' />
                                <button onClick={(e) => { handleRemoveImg(e, index) }} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                            </div>
                        ))
                    }


                    {/* submit button */}
                    <button disabled={loading || uploading} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
                        {loading ? 'Loading...' : 'Update listing'}
                    </button>

                    {error && <p className="text-red-700">{error}</p>}

                </div>



            </form>

        </main>
    )
}
