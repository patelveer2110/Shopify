import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Import useNavigate
import { backendUrl } from '../../App';
import { assets } from '../assets/assets';
import axios from 'axios';

const Sidebar = ({ isSidebarOpen, setToken }) => {
    const [shopStatus, setShopStatus] = useState(true);
    const navigate = useNavigate(); // Initialize useNavigate hook

    // Fetch current shop status when the component mounts
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

    // Function to update shop status in backend
    const updateShopStatus = (status) => {
        axios
            .post(
                backendUrl + '/api/admin/update-shop-status',
                { shopStatus: status },
                { headers: { token_admin: localStorage.getItem('token_admin') } }
            )
            .then((response) => {
                if (!response.data.success) {
                    alert('Failed to update shop status.');
                } else {
                    alert(`Shop is now ${status ? 'Open' : 'Closed'}`);
                }
            })
            .catch((error) => {
                console.error('Error updating shop status:', error);
            });
    };

    // Handle slider change
    const handleToggle = (e) => {
        const updatedStatus = e.target.value === "1"; // Convert slider value to boolean
        setShopStatus(updatedStatus);
        updateShopStatus(updatedStatus);
    };

    // Handle slider click to toggle between min and max
    const handleSliderClick = () => {
        const newStatus = !shopStatus; // Toggle the status
        setShopStatus(newStatus);
        updateShopStatus(newStatus);
    };

    // Handle logout and navigation to login page
    const handleLogout = () => {
        localStorage.removeItem('token_admin'); // Clear the token
        setToken(''); // Clear the token state
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} overflow-y-scroll overflow-x-scroll sm:block fixed sm:static sm:min-h-screen top-0 left-0 w-full h-full sm:w-[18%] bg-gray-100 z-5 border-r-2 transition-transform duration-300 mt-14`}>
            <div className="flex flex-col gap-4 pt-6 text-[15px]">
                
                {/* Sidebar Links */}
                <NavLink 
                    to="/add"
                    end
                    className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 mx-2 rounded-md transition-colors duration-300 border 
                        ${isActive ? 'bg-[#ffebf5] border-[#c586a5]' : 'border-gray-300 hover:bg-gray-200 hover:border-[#c586a5]'}`}
                >
                    <img src={assets.add_icon} alt="Add" />
                    <p className="sm:block">Add items</p>
                </NavLink>

                <NavLink 
                    to="/list"
                    end
                    className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 mx-2 rounded-md transition-colors duration-300 border 
                        ${isActive ? 'bg-[#ffebf5] border-[#c586a5]' : 'border-gray-300 hover:bg-gray-200 hover:border-[#c586a5]'}`}
                >
                    <img src={assets.order_icon} alt="List" />
                    <p className="sm:block">List items</p>
                </NavLink>

                {/* Shop Status Toggle */}
                <div className="flex flex-col items-center gap-2 mt-4 ml-2 justify-center">
                    <span className={`text-md font-semibold ${shopStatus ? 'text-green-800' : 'text-red-800'}`}>
                        {shopStatus ? 'Shop is Open' : 'Shop is Closed'}
                    </span>
                    <label className="flex items-center cursor-pointer" onClick={handleSliderClick}>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            value={shopStatus ? 1 : 0}
                            onChange={handleToggle}
                            className={`w-20 h-2 appearance-none rounded-lg cursor-pointer ${shopStatus ? 'bg-green-500' : 'bg-red-500'}`}
                        />
                    </label>
                </div>

                {/* Log out button (visible only on small screens) */}
                <button onClick={handleLogout} className="block sm:hidden mx-2 mb-4 bg-gray-600 text-white px-4 py-2 rounded-full text-xs md:text-sm">
                    Log out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
