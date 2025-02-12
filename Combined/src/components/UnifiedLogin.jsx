import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../User/context/ShopContext.jsx'; // Assuming you have a context for managing state
import { backendUrl } from '../App';

const UnifiedLogin = ({ setToken, setAdminToken, setRole }) => {
  const [isUserMode, setIsUserMode] = useState(true); // Toggle between User and Admin
  const [currentState, setCurrentState] = useState('Login'); // States: 'Login', 'Sign Up'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    shopName: '',
    address: '',
    contactNumber: ''
  });

  const { token } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        // User or Admin Registration
        const endpoint = isUserMode
          ? `${backendUrl}/api/user/register`
          : `${backendUrl}/api/admin/register`;

        const response = await axios.post(endpoint, {
          name: formData.name,  // Include name in the request
          email: formData.email,
          password: formData.password,
          contactNumber: formData.contactNumber,
          ...(isUserMode
            ? {} // User-specific fields
            : { // Admin-specific fields
              shopName: formData.shopName,
              address: formData.address,
            })
        });

        if (response.data.success) {
          if (isUserMode) {
            setToken(response.data.token);
            setRole('user');
            localStorage.setItem('token', response.data.token);
          } else {
            setAdminToken(response.data.token_admin);
            setRole('admin');
          }
          toast.success(response.data.message);
          navigate(isUserMode ? '/' : '/admin'); // Redirect based on role
        } else {
          toast.error(response.data.message);
        }
      } else if (currentState === 'Login') {
        // User or Admin Login
        const endpoint = isUserMode
          ? `${backendUrl}/api/user/login`
          : `${backendUrl}/api/admin/login`;

        const response = await axios.post(endpoint, {
          email: formData.email,
          password: formData.password
        });

        if (response.data.success) {
          if (isUserMode) {
            setToken(response.data.token);
            setRole('user');
            localStorage.setItem('token', response.data.token);
          } else {
            setAdminToken(response.data.token_admin);
            setRole('admin');
          }
          toast.success(response.data.message);
          navigate(isUserMode ? '/' : '/admin'); // Redirect based on role
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/'); // Redirect to home if user is already logged in
    }
  }, [token, navigate]);

  return (
    <div className='min-h-screen  flex items-center justify-center p-4'>
      <div className='bg-white shadow-lg rounded-lg px-8 py-6 w-full max-w-sm sm:max-w-md m-4'>
        {/* Toggle Button */}
        <div className='flex justify-center mb-4'>
          <button
            onClick={() => setIsUserMode(true)}
            className={`py-2 px-4 rounded-l-md ${isUserMode ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            User
          </button>
          <button
            onClick={() => setIsUserMode(false)}
            className={`py-2 px-4 rounded-r-md ${!isUserMode ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Admin
          </button>
        </div>

        <h1 className='text-2xl font-bold mb-4 text-center'>
          {isUserMode ? 'User' : 'Admin'} {currentState}
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Show name field for both Sign Up and Admin Register */}
          {currentState === 'Sign Up' && (
            <div className='mb-3'>
              <p className='text-sm font-medium text-gray-700'>Name</p>
              <input
                onChange={handleChange}
                value={formData.name}
                name='name'
                className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
                type='text'
                placeholder='Name'
                required
              />
            </div>
          )}
          <div className='mb-3'>
            <p className='text-sm font-medium text-gray-700'>Email Address</p>
            <input
              onChange={handleChange}
              value={formData.email}
              name='email'
              className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
              type='email'
              placeholder='you@gmail.com'
              required
            />
          </div>
          <div className='mb-3'>
            <p className='text-sm font-medium text-gray-700'>Password</p>
            <input
              onChange={handleChange}
              value={formData.password}
              name='password'
              className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
              type='password'
              placeholder='Password'
              required
            />
          </div>
          {isUserMode && currentState === 'Sign Up' && (
            <>
              <div className='mb-3'>
                <p className='text-sm font-medium text-gray-700'>Contact Number</p>
                <input
                  onChange={handleChange}
                  value={formData.contactNumber}
                  name='contactNumber'
                  className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
                  type='text'
                  placeholder='Contact Number'
                  required
                />
              </div>
            </>
          )}

          {/* Show additional fields for Admin Register */}
          {!isUserMode && currentState === 'Sign Up' && (
            <>
              <div className='mb-3'>
                <p className='text-sm font-medium text-gray-700'>Shop Name</p>
                <input
                  onChange={handleChange}
                  value={formData.shopName}
                  name='shopName'
                  className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
                  type='text'
                  placeholder='Shop Name'
                  required
                />
              </div>
              <div className='mb-3'>
                <p className='text-sm font-medium text-gray-700'>Address</p>
                <input
                  onChange={handleChange}
                  value={formData.address}
                  name='address'
                  className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
                  type='text'
                  placeholder='Address'
                  required
                />
              </div>
              <div className="mb-4">
                <label className="font-semibold">Delivery Option:</label>
                <select
                  name="deliveryOption"
                  value={deliveryOption}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="delivery">Delivery & Takeaway</option>
                  <option value="takeaway">Only Takeaway</option>
                </select>
              </div>

            </>
          )}

          <button className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black' type='submit'>
            {currentState === 'Sign Up' ? 'Sign Up' : 'Login'}
          </button>
        </form>

        {/* Links to switch between states */}
        <div className='mt-4 text-center'>
          {currentState === 'Login' ? (
            <>
              <p className='text-sm'>
                Don't have an account?
                <span onClick={() => setCurrentState('Sign Up')} className='text-blue-500 hover:underline cursor-pointer ml-1'>
                  Sign Up
                </span>
              </p>
            </>
          ) : (
            <>
              <p className='text-sm'>
                Already have an account?
                <span onClick={() => setCurrentState('Login')} className='text-blue-500 hover:underline cursor-pointer ml-1'>
                  Login Here
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;
