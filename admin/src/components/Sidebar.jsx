import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';
import axios from 'axios';

const Sidebar = ({ isSidebarOpen, setToken }) => {
    const [shopStatus, setShopStatus] = useState(true);

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

    return (
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} sm:block fixed sm:static sm:min-h-screen top-0 left-0 w-full h-full sm:w-[18%] bg-gray-100 z-5 border-r-2 transition-transform duration-300 mt-14`}>
            <div className="flex flex-col gap-4 pt-6 text-[15px]">
                {/* Sidebar Links */}
                <NavLink className="flex items-center gap-3 border border-gray-300 px-3 py-2 mx-2 rounded-1" to="/add">
                    <img src={assets.add_icon} alt="" />
                    <p className="sm:block">Add items</p>
                </NavLink>
                <NavLink className="flex items-center gap-3 border border-gray-300 px-3 py-2 mx-2 rounded-1" to="/list">
                    <img src={assets.order_icon} alt="" />
                    <p className="sm:block">List items</p>
                </NavLink>

                {/* Shop Status Toggle */}
                <div className="flex items-center gap-3 mt-4 ml-2 justify-center">
                    <span className={`text-lg font-semibold ${shopStatus ? 'text-green-800' : 'text-red-800'}`}>
                        {shopStatus ? 'Shop is Open' : 'Shop is Closed'}
                    </span>
                    <label className="flex items-center ml-3 cursor-pointer" onClick={handleSliderClick}>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            value={shopStatus ? 1 : 0}
                            onChange={handleToggle}
                            className={`w-20 h-2 appearance-none rounded-lg text-white cursor-pointer ${shopStatus ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ backgroundColor: shopStatus ? '#48bb78' : '#f56565' }} // Inline style for dynamic background
                        />

                    </label>
                </div>

                {/* Log out button */}
                <button onClick={() => setToken('')} className="block sm:hidden bg-gray-600 text-white px-4 py-2 md:px-7 md:py-2 rounded-full text-xs md:text-sm">Log out</button>
            </div>
        </div>
    );
};

export default Sidebar;
