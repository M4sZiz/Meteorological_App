import React from 'react';
import { useNavigate } from "react-router-dom";
import logo from '../images/logo.svg';
const Header = () => {

    const navigate = useNavigate();
    const logout = () => {
        localStorage.clear();
        navigate('/login');
    }

    return (
        <header>
            <nav className="bg-background-1 border-gray-200 px-4 lg:px-6 py-2.5">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <button href="https://flowbite.com" className="flex items-center">
                        <img src={logo} className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap text-text">Weather</span>
                    </button>
                    <div className="flex items-center lg:order-2 gap-x-3">
                        <button className='btn' onClick={()=> logout()}> Logout </button>
                    </div>
                </div>
            </nav>
        </header>

    )
}

export default Header