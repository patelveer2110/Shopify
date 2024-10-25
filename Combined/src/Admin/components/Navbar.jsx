import React from 'react';
import { assets } from '../assets/assets';

const Navbar = ({ toggleSidebar, isSidebarOpen, setToken, setRole }) => {
  return (
    <div className="flex items-center py-2 px-[4%] fixed justify-between z-10 bg-white shadow-sm h-14 w-full">
      {/* Logo */}
      <img className="w-[max(10%,80px)] md:w-[120px]" src={assets.logo} alt="Logo" />

      {/* Hamburger Menu (Visible on Small Screens) */}
      <button 
        className="sm:hidden text-2xl" 
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Logout Button (Hidden on Small Screens) */}
      <button 
        onClick={() => { setToken(''); setRole(''); }} 
        className="hidden sm:block bg-gray-600 text-white px-4 py-2 md:px-7 md:py-2 rounded-full text-xs md:text-sm"
      >
        Log out
      </button>
    </div>
  );
};

export default Navbar;
