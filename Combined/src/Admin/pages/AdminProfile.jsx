import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';
import { toast } from 'react-toastify';

const AdminProfile = () => {
    const [adminDetails, setAdminDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

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
                    setFormData({
                        name: response.data.admin.name,
                        email: response.data.admin.email,
                        shopName: response.data.admin.shopName,
                        address: response.data.admin.address || '',
                        contactNumber: response.data.admin.contactNumber || '',
                        shopStatus: response.data.admin.shopStatus,
                    });
                }
            })
            .catch((error) => {
                console.error('Error fetching admin details:', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token_admin');

        try {
            const response = await axios.put(backendUrl + '/api/admin/update', formData, {
                headers: { token_admin: token },
            });
            if (response.data.success) {
                setAdminDetails(formData); // Update admin details with new data
                setIsEditing(false);
                toast.success("Updated successfully") // Exit editing mode
            } else {
                console.error('Update failed:', response.data.message);
            }
        } catch (error) {
            console.error('Error updating admin details:', error);
        }
    };

    if (!adminDetails) {
        return <p className="text-center text-gray-500 mt-4">Loading profile...</p>;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold">Name:</span>
                    {isEditing ? (
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border rounded p-1"
                        />
                    ) : (
                        <span>{adminDetails.name}</span>
                    )}
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold">Email:</span>
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border rounded p-1"
                        />
                    ) : (
                        <span>{adminDetails.email}</span>
                    )}
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold">Shop Name:</span>
                    {isEditing ? (
                        <input
                            type="text"
                            name="shopName"
                            value={formData.shopName}
                            onChange={handleChange}
                            className="border rounded p-1"
                        />
                    ) : (
                        <span>{adminDetails.shopName}</span>
                    )}
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold">Address:</span>
                    {isEditing ? (
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="border rounded p-1"
                        />
                    ) : (
                        <span>{adminDetails.address || 'N/A'}</span>
                    )}
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold">Contact Number:</span>
                    {isEditing ? (
                        <input
                            type="text"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            className="border rounded p-1"
                        />
                    ) : (
                        <span>{adminDetails.contactNumber || 'N/A'}</span>
                    )}
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold">Shop Status:</span>
                    {isEditing ? (
                        <select
                            name="shopStatus"
                            value={formData.shopStatus}
                            onChange={handleChange}
                            className="border rounded p-1"
                        >
                            <option value={true}>Open</option>
                            <option value={false}>Closed</option>
                        </select>
                    ) : (
                        <span className={adminDetails.shopStatus ? 'text-green-600' : 'text-red-600'}>
                            {adminDetails.shopStatus ? 'Open' : 'Closed'}
                        </span>
                    )}
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        type="button"
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-blue-500 hover:underline"
                    >
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                    {isEditing && (
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Save Changes
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AdminProfile;
