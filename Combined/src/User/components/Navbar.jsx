import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets.js';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';

const Navbar = ({ setToken, setRole }) => {
    const [visible, setVisible] = useState(false);
    const { setShowSearch, token } = useContext(ShopContext);
    const navigate = useNavigate();

    const logout = () => {
        setToken('');
        localStorage.removeItem('token');
        localStorage.removeItem('token_admin');
        localStorage.removeItem('role');

        setTimeout(() => {
            navigate('/login');
        }, 0);
    };

    return (
        <div className='flex items-center justify-between py-5 font-medium '>
            <Link to='/'><img src={assets.logo} className='w-36' alt="" /></Link>

            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
                <NavLink to='/' className='flex flex-col items-center gap-1'>
                    <p>HOME</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/collection' className='flex flex-col items-center gap-1'>
                    <p>COLLECTION</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/cart' className='flex flex-col items-center gap-1'>
                    <p>CART</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/myorders' className='flex flex-col items-center gap-1'>
                    <p>ORDERS</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/about' className='flex flex-col items-center gap-1'>
                    <p>ABOUT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                    <p>CONTACT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
            </ul>

            <div className='flex items-center gap-6'>
                <img onClick={() => setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="" />
                <div className='group relative'>
                    <button
                        onClick={() => { setToken(''); setRole(''); }}
                        className="hidden sm:block bg-gray-600 text-white px-4 py-2 md:px-7 md:py-2 rounded-full text-xs md:text-sm"
                    >
                        Log out
                    </button>
                    {/* Dropdown menu */}

                    
                </div>
                
                <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
            </div>

            {/* sidebar menu for small screen */}
            <div className={`absolute top-0 right-0 bottom-0 min-h-max h-full overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
                        <p>Back</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection'>COLLECTION</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/cart'>CART</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/myorders'>ORDERS</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
                    <button 
        onClick={() => { setToken(''); setRole(''); }} 
        className="block mb-8 bg-black text-white px-4 py-2 md:px-7 md:py-2 rounded-full text-xs md:text-sm"
      >
        Log out
      </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
