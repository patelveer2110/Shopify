import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';

const ProductItem = ({id, image , name , price}) => {

    const {currency} = useContext(ShopContext);
    const handleClick = () => {
      //navigate(`/product/${product._id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });  // Scroll to top on navigation
  };

  return (
    <Link onClick={handleClick} className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
        <div className='overflow-hidden'>
            <img className='hover:scale-110 transition ease-in-out w-[95%] h-[100%] sm:w-[90%] sm:h-[100%] md:h-[100%] md:w-[90%] ' src={image} alt="" />
        </div>
        <p className='pt-3 pb-1 text-sm'>{name}</p>
        <p className='text-sm font-medium'>{currency}{price}</p>
    </Link>
  )
}

export default ProductItem