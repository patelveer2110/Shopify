// import React, { useState, useContext, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { ShopContext } from '../User/context/ShopContext.jsx'; // Assuming you have a context for managing state
// import { backendUrl } from '../App';

// const UnifiedLogin = ({ setToken, setAdminToken }) => {
//   const [currentState, setCurrentState] = useState('Login'); // States: 'Login', 'Sign Up', 'Admin Login', 'Admin Register'
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     shopName: '',
//     address: '',
//     contactNumber: ''
//   });

//   // Using context for backend URL and navigation
//   const { token } = useContext(ShopContext);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Handle registration or login based on the current state
//       const response = await axios.post(`${backendUrl}/api/${currentState.includes('Admin') ? 'admin' : 'user'}/${currentState.toLowerCase().includes('login') ? 'login' : 'register'}`, formData);
      
//       if (response.data.success) {
//         if (currentState.includes('Admin')) {
//           setAdminToken(response.data.token_admin);
//         } else {
//           setToken(response.data.token);
//         }
//         toast.success(response.data.message);
//         navigate(currentState.includes('Admin') ? '/admin' : '/');
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error('An error occurred. Please try again.');
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       navigate('/'); // Redirect to home if user is already logged in
//     }
//   }, [token, navigate]);

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md w-full">
//         <h1 className="text-3xl font-semibold text-center mb-6">{currentState}</h1>
//         <form onSubmit={handleSubmit}>
//           {/* Name field only for Sign Up and Admin Register */}
//           {(currentState === 'Sign Up' || currentState === 'Admin Register') && (
//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm font-medium mb-2">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                 placeholder="Name"
//                 required
//               />
//             </div>
//           )}
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               placeholder="you@example.com"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               placeholder="Password"
//               required
//             />
//           </div>
//           {/* Additional fields for Admin Register */}
//           {currentState === 'Admin Register' && (
//             <>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-medium mb-2">Shop Name</label>
//                 <input
//                   type="text"
//                   name="shopName"
//                   value={formData.shopName}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                   placeholder="Shop Name"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-medium mb-2">Address</label>
//                 <input
//                   type="text"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                   placeholder="Address"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-medium mb-2">Contact Number</label>
//                 <input
//                   type="text"
//                   name="contactNumber"
//                   value={formData.contactNumber}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                   placeholder="Contact Number"
//                   required
//                 />
//               </div>
//             </>
//           )}

//           <button className="w-full py-2 mt-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300">
//             {currentState === 'Sign Up' || currentState === 'Admin Register' ? 'Sign Up' : 'Login'}
//           </button>
//         </form>

//         <div className="mt-4 text-center">
//           {currentState === 'Login' ? (
//             <>
//               <p className="text-sm">
//                 Don't have an account?{' '}
//                 <span
//                   className="text-indigo-500 cursor-pointer hover:underline"
//                   onClick={() => setCurrentState('Sign Up')}
//                 >
//                   Sign Up
//                 </span>
//               </p>
//               <p className="text-sm">
//                 Admin?{' '}
//                 <span
//                   className="text-indigo-500 cursor-pointer hover:underline"
//                   onClick={() => setCurrentState('Admin Login')}
//                 >
//                   Admin Login
//                 </span>
//               </p>
//             </>
//           ) : currentState === 'Sign Up' ? (
//             <p className="text-sm">
//               Already have an account?{' '}
//               <span
//                 className="text-indigo-500 cursor-pointer hover:underline"
//                 onClick={() => setCurrentState('Login')}
//               >
//                 Login Here
//               </span>
//             </p>
//           ) : (
//             <>
//               <p className="text-sm">
//                 Don't have an account?{' '}
//                 <span
//                   className="text-indigo-500 cursor-pointer hover:underline"
//                   onClick={() => setCurrentState('Admin Register')}
//                 >
//                   Register as Admin
//                 </span>
//               </p>
//               <p className="text-sm">
//                 User?{' '}
//                 <span
//                   className="text-indigo-500 cursor-pointer hover:underline"
//                   onClick={() => setCurrentState('Login')}
//                 >
//                   User Login
//                 </span>
//               </p>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UnifiedLogin;
