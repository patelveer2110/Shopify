import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Order'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const currency ='₹'

export const backendUrl = import.meta.env.VITE_BACKEND_URL

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token_admin')?localStorage.getItem('token_admin'):'')
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(()=>{
    localStorage.setItem('token_admin',token)
  },[token])
  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer/>
      {token === ""
        ? <Login setToken={setToken}/>
        :
        <>
          <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar isSidebarOpen={isSidebarOpen} setToken={setToken}/>
            <div className="flex-1  w-[70%] mx-auto ml-[max(5vw,25px)]  text-gray-600 text-base ">
              <Routes>
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App