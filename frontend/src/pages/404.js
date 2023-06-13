import { Link } from 'react-router-dom'

const NotFoundPage = () => {
    //not found page with tawilwind css use for styling pramiry color
    return (
        <div className="bg-gray-100 h-screen flex flex-col justify-center items-center">
            <h1 className="lg:text-2xl md:text-7xl sm:text-5xl text-3xl font-black mb-14">
                404 | Page Not Found
            </h1>
            <Link to="/" className="py-5 px-10 bg-primary rounded-full text-white text-xl hover:bg-backgrounds-table transition duration-300 ease-in-out flex items-center animate-bounce">
                Go Back Home
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                     
                </svg>
            </Link>
        </div>
    )
}

export default NotFoundPage