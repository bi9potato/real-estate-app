import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

export default function Header() {

    const { currentUser } = useSelector(state => state.user);
    // console.log(currentUser);

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const urlParams = new URLSearchParams(window.location.search);

        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);

    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTerm = urlParams.get('searchTerm');
        setSearchTerm(searchTerm);
    }, [location.search])

    return (
        <>
            <header className="bg-slate-200 shadow-md">
                <div className="flex justify-between items-center max-w-6xl mx-auto p-3">

                    <Link to='/'>
                        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap" >
                            <span className="text-slate-500">Real</span>
                            <span className="text-slate-700">Estate</span>
                        </h1>
                    </Link>

                    <form
                        className="bg-slate-100 rounded-lg p-3 flex items-center"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="text"
                            placeholder="Search real estate..."
                            className="bg-transparent focus:outline-none w-24 sm:w-64"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                        <button>
                            <FaSearch className='text-slate-500'></FaSearch>
                        </button>
                    </form>

                    <ul className='flex gap-4'>
                        <Link to='/'>
                            <li className='hidden sm:inline text-slate-700 hover:underline'>
                                Home
                            </li>
                        </Link>
                        <Link to='/about'>
                            <li className='hidden sm:inline text-slate-700 hover:underline'>
                                About
                            </li>
                        </Link>
                        {/* <Link to='/sign-in'>
                            <li className=' text-slate-700 hover:underline'>
                                Sign in
                            </li>
                        </Link> */}
                        {
                            currentUser ? (
                                <Link to='/profile'>
                                    <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt="profile" />
                                </Link>
                            ) : (
                                <Link to='/sign-in'>
                                    <li className=' text-slate-700 hover:underline'>
                                        Sign in
                                    </li>
                                </Link>
                            )
                        }
                    </ul>
                </div >
            </header >
        </>
    )
}
