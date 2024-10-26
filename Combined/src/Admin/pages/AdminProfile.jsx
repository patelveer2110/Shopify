// src/pages/AdminProfile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';

const AdminProfile = () => {
    const [adminDetails, setAdminDetails] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token_admin'); // Retrieve token from localStorage
        console.log(token);
        
        axios
            .get(backendUrl+'/api/admin/admindetail', {
                headers: { token_admin: token },
            })
            .then((response) => {
                if (response.data.success) {
                    setAdminDetails(response.data.admin);
                }
            })
            .catch((error) => {
                console.error('Error fetching admin details:', error);
            });
    }, []);

    if (!adminDetails) {
        return <p className="text-center text-gray-500 mt-4">Loading profile...</p>;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Profile</h2>
            <div className="space-y-4 text-gray-700">
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold">Name:</span>
                    <span>{adminDetails.name}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold">Email:</span>
                    <span>{adminDetails.email}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold">Shop Name:</span>
                    <span>{adminDetails.shopName}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold">Address:</span>
                    <span>{adminDetails.address || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold">Contact Number:</span>
                    <span>{adminDetails.contactNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-semibold">Shop Status:</span>
                    <span className={adminDetails.shopStatus ? 'text-green-600' : 'text-red-600'}>
                        {adminDetails.shopStatus ? 'Open' : 'Closed'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
