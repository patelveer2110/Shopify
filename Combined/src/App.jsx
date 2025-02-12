import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './User/pages/Home';
import Collection from './User/pages/Collection';
import Cart from './User/pages/Cart';
import PreviousOrders from './User/pages/PreviousOrders';
import Order from './User/pages/Order';
import About from './User/pages/About';
import Contact from './User/pages/Contact';
import Product from './User/pages/Product';
import SearchBar from './User/components/SearchBar';
import UserNavbar from './User/components/Navbar';
import UserFooter from './User/components/Footer';

import AdminAdd from './Admin/pages/Add';
import AdminList from './Admin/pages/List';
import AdminOrder from './Admin/pages/Order';
import AdminHistoryOrder from './Admin/pages/HistoryOrders';
import AdminProfile from './Admin/pages/AdminProfile';
import AdminNavbar from './Admin/components/Navbar';
import AdminSidebar from './Admin/components/Sidebar';
import AdminRegister from './components/AdminRegister';

import UnifiedLogin from './components/UnifiedLogin';

export const currency = '₹';
export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [userToken, setUserToken] = useState(localStorage.getItem('token') || '');
  const [adminToken, setAdminToken] = useState(localStorage.getItem('token_admin') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || 'user');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    localStorage.setItem('token', userToken);
    localStorage.setItem('token_admin', adminToken);
    localStorage.setItem('role', role);

    if (!userToken && !adminToken) {
      console.log('No tokens found, navigating to /login'); // Debugging
      navigate('/login');
  } else if (userToken && !adminToken) {
      setRole('user');
  } else if (!userToken && adminToken) {
      setRole('admin');
  }
}, [userToken, adminToken, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ToastContainer />
      {userToken === '' && adminToken === '' ? (
        <div className="flex justify-center items-center min-h-screen">
          <Routes>
            <Route
              path='/login'
              element={
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                  <UnifiedLogin setToken={setUserToken} setAdminToken={setAdminToken} setRole={setRole} />
                </div>
              }
            />
            <Route
              path='/register'
              element={
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                  <AdminRegister setToken={setAdminToken} />
                </div>
              }
            />
            <Route
              path='*'
              element={
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                  <UnifiedLogin setToken={setUserToken} setAdminToken={setAdminToken} setRole={setRole} />
                </div>
              }
            />
          </Routes>
        </div>
      ) : (
        <>
          {role === 'admin' ? (
            <>
              <AdminNavbar toggleSidebar={toggleSidebar} setToken={setAdminToken} setRole={setRole} isSidebarOpen={isSidebarOpen} />
              <div className="flex w-full">
                <AdminSidebar isSidebarOpen={isSidebarOpen} setToken={setAdminToken} />
                <div className="flex-1 p-4">
                  <Routes>
                    <Route path='/add' element={<AdminAdd token={adminToken} />} />
                    <Route path='/list' element={<AdminList token={adminToken} />} />
                    <Route path='/profile' element={<AdminProfile token={adminToken} />} />
                    <Route path='/order' element={<AdminOrder token={adminToken} />} />
                    <Route path='/history-orders' element={<AdminHistoryOrder />} />
                    <Route path='*' element={<AdminAdd token={adminToken} />} />
                  </Routes>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
                <UserNavbar setToken={setUserToken} setRole={setRole} />
                <SearchBar />
                <Routes>
                  <Route path='/' element={<Home />} />
                  <Route path='/collection' element={<Collection />} />
                  <Route path='/cart' element={<Cart token={userToken}/>} />
                  <Route path='/myorders' element={<PreviousOrders/>} />
                  <Route path='/order/:cartId' element={<Order token={userToken}/>} />
                  <Route path='/about' element={<About />} />
                  <Route path='/contact' element={<Contact />} />
                  <Route path='/product/:productId' element={<Product token={userToken} />} />
                  <Route path='*' element={<Home />} />
                </Routes>
                <UserFooter />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;
