import React from 'react'
import { NavLink } from 'react-router-dom'
import { backendUrl } from '../App'
import { assets } from '../assets/assets'
import { createContext, useEffect, useState } from "react";
import axios from 'axios';

const Sidebar = () => {

    const [shopStatus, setShopStatus] = useState(true);

    // Fetch current shop status when the component mounts
    useEffect(() => {
        const token = localStorage.getItem('token_admin')
        console.log(token);

        axios.get(backendUrl + "/api/admin/shop-status", {
            headers: { token_admin: token }
        })
            .then(response => {
                if (response.data.success) {
                    setShopStatus(response.data.shopStatus);
                }
            })
            .catch(error => {
                console.error("Error fetching shop status:", error);
            });
    }, []);


    // Handle toggle
    const handleToggle = () => {
        const updatedStatus = !shopStatus;
        setShopStatus(updatedStatus);  // Optimistically update UI

        axios.post(backendUrl + "/api/admin/update-shop-status", { shopStatus: updatedStatus }, {
            headers: { token_admin: localStorage.getItem("token_admin") }
        })
            .then(response => {
                if (!response.data.success) {
                    // Revert the status if the update fails
                    setShopStatus(!updatedStatus);
                    alert("Failed to update shop status.");
                } else {
                    alert(`Shop is now ${updatedStatus ? 'Open' : 'Closed'}`);
                }
            })
            .catch(error => {
                console.error("Error updating shop status:", error);
                setShopStatus(!updatedStatus);  // Revert if failed
            });
    };

    return (
        <div className='w-[18%] min-h-screen border-r-2'>
            <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px] '>
                <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/add">
                    <img src={assets.add_icon} alt="" />
                    <p className='hidden md:block'>Add items</p>
                </NavLink>
                <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/list">
                    <img src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>List items</p>
                </NavLink>
                {/* <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/orders"> 
                <img src={assets.order_icon} alt="" />
                <p className='hidden md:block'>orders</p>
            </NavLink> */}
                <div className="flex items-center gap-3 mt-4 justify-center"> {/* Centered row */}
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={shopStatus}
                            onChange={handleToggle}
                            className="sr-only peer"
                        />
                        <div className={`w-16 h-8 rounded-full transition-colors duration-200 ease-in-out ${shopStatus ? 'bg-green-500' : 'bg-red-500'} flex items-center `}>
                            <div className={`w-6 h-6 bg-white border border-gray-300 rounded-full transition-transform duration-200 ease-in-out ${shopStatus ? 'translate-x-7' : 'translate-x-1'}`}></div>
                        </div>
                        <span className={`ml-3 text-sm font-medium ${shopStatus ? 'text-green-800' : 'text-red-800'}`}>
                            {shopStatus ? 'Shop is Open' : 'Shop is Closed'}
                        </span>
                    </label>
                </div>



            </div>
        </div>

    )
}

export default Sidebar