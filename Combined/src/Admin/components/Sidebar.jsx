// Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { backendUrl } from '../../App';
import axios from 'axios';
import { assets } from '../assets/assets';

const Sidebar = ({ isSidebarOpen, setToken }) => {
    const [shopStatus, setShopStatus] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token_admin');

        axios
            .get(backendUrl + '/api/admin/shop-status', {
                headers: { token_admin: token },
            })
            .then((response) => {
                if (response.data.success) {
                    setShopStatus(response.data.shopStatus);
                }
            })
            .catch((error) => {
                console.error('Error fetching shop status:', error);
            });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token_admin');
        setToken('');
        navigate('/login');
    };

    return (
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} overflow-y-scroll overflow-x-scroll sm:block fixed sm:static sm:min-h-screen top-0 left-0 w-full h-full sm:w-[18%] bg-gray-100 z-5 border-r-2 transition-transform duration-300 mt-14`}>
            <div className="flex flex-col gap-4 pt-6 text-[15px]">
                
                {/* Sidebar Links */}
                <NavLink to="/add" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 mx-2 rounded-md transition-colors duration-300 border ${isActive ? 'bg-[#ffebf5] border-[#c586a5]' : 'border-gray-300 hover:bg-gray-200 hover:border-[#c586a5]'}`}>
                    <img src={assets.add_icon} alt="Add" />
                    <p className="sm:block">Add items</p>
                </NavLink>

                <NavLink to="/list" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 mx-2 rounded-md transition-colors duration-300 border ${isActive ? 'bg-[#ffebf5] border-[#c586a5]' : 'border-gray-300 hover:bg-gray-200 hover:border-[#c586a5]'}`}>
                    <img src={assets.order_icon} alt="List" />
                    <p className="sm:block">List items</p>
                </NavLink>

                <NavLink to="/profile" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 mx-2 rounded-md transition-colors duration-300 border ${isActive ? 'bg-[#ffebf5] border-[#c586a5]' : 'border-gray-300 hover:bg-gray-200 hover:border-[#c586a5]'}`}>
                    <img src={assets.profile_icon} alt="Profile" />
                    <p className="sm:block">My Profile</p>
                </NavLink>

                {/* Logout Button */}
                <button onClick={handleLogout} className="block sm:hidden mx-2 mb-4 bg-gray-600 text-white px-4 py-2 rounded-full text-xs md:text-sm">
                    Log out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
