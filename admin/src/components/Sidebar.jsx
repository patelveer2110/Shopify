import React from 'react';
import { NavLink } from 'react-router-dom';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';
import axios from 'axios';
import { useEffect, useState } from 'react';

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

    // Handle shop status toggle
    const handleToggle = () => {
        const updatedStatus = !shopStatus;
        setShopStatus(updatedStatus);

        axios
            .post(
                backendUrl + '/api/admin/update-shop-status',
                { shopStatus: updatedStatus },
                { headers: { token_admin: localStorage.getItem('token_admin') } }
            )
            .then((response) => {
                if (!response.data.success) {
                    setShopStatus(!updatedStatus);
                    alert('Failed to update shop status.');
                } else {
                    alert(`Shop is now ${updatedStatus ? 'Open' : 'Closed'}`);
                }
            })
            .catch((error) => {
                console.error('Error updating shop status:', error);
                setShopStatus(!updatedStatus);
            });
    };

    return (
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} sm:block fixed sm:static sm:min-h-screen top-0 left-0 w-full h-full sm:w-[18%]  bg-gray-100 z-5 border-r-2 transition-transform duration-300  mt-14 `}  >
            <div className="flex flex-col gap-4 pt-6  text-[15px]">
                {/* Sidebar Links */}
                <NavLink className="flex items-center gap-3 border border-gray-300 px-3 py-2 mx-2 rounded-1" to="/add" >
                    <img src={assets.add_icon} alt="" />
                    <p className="sm:block">Add items</p>
                </NavLink>
                <NavLink className="flex items-center gap-3 border border-gray-300 px-3 py-2 mx-2 rounded-1" to="/list" >
                    <img src={assets.order_icon} alt="" />
                    <p className="sm:block">List items</p>
                </NavLink>

                {/* Shop Status Toggle */}
                <div className="flex items-center gap-3 mt-4 ml-2 justify-center">
    <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={shopStatus} onChange={handleToggle} className="sr-only peer" />

        {/* Toggle background */}
        <div className={`relative w-12 h-6 sm:w-16 sm:h-8 md:w-20 md:h-10 rounded-full flex items-center ${shopStatus ? 'bg-green-500' : 'bg-red-500'} transition-colors duration-300`} >
            {/* Toggle button */}
            <div className={`relative bg-white w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full  transform transition-transform duration-300  ${shopStatus ? 'translate-x-[calc(100%)]' : 'translate-x-[0%]'}`} ></div>
        </div>

        {/* Shop status text */}
        <span className={`ml-3 text-sm ${shopStatus ? 'text-green-800' : 'text-red-800'}`}>
            {shopStatus ? 'Shop is Open' : 'Shop is Closed'}
        </span>
    </label>
</div>




                {/* Login out */}
                <button onClick={() => setToken('')} className=" block sm:hidden bg-gray-600 text-white px-4 py-2 md:px-7 md:py-2 rounded-full text-xs md:text-sm" >Log out</button>


                {/* </div> */}
            </div>
        </div>
    );
};

export default Sidebar;
