import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { backendUrl } from '../../App';
import axios from 'axios'

const Product = () => {
  const { productId } = useParams();
  const { products, currency } = useContext(ShopContext);
  const [productData , setProductData] = useState(false);
  const [image , setImage ] = useState('')
  const [shopStatus, setShopStatus] = useState(null);

  // Fetch shop status by adminId (shopId)
  const fetchShopStatus = async (adminId) => {
    try {
      const response = await axios.post(backendUrl+`/api/admin/${adminId}/status`); // Fetch shop status from backend
      setShopStatus(response.data.shopStatus); // Set the shop status (true for open, false for closed)
    } catch (error) {
      console.error('Error fetching shop status:', error);
    }
  };

  const fetchProductData = async () => {
    products.map((item) => {
      if(item._id === productId){
        setProductData(item)
        setImage(item.image)
        fetchShopStatus(item.adminId);
        return null  ;
      }
    })
  }
  
  useEffect(() => {
    fetchProductData()
  },[productId])
  
  return productData? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
        {/*------------------- Product Data------------------------- */}
        <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row '>
          {/* ------------------- Product Images -------------------- */}
          <div className='flex-1 flex flex-col-reverse gap-4 sm:flex-row'>
            {/* <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
               <img  src={image}  className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
                
            </div> */}
            <div className='w-full sm:w-[80%]'>
              <img className='w-full h-auto ' src={image} alt="" />
            </div>
          </div>

          {/* -------------- Product information -------------- */}
          <div className='flex-1'>
            <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>

            {/* This 'div' is for rating stars and reviews  */}
            {/* <div className='flex items-center gap-1 mt-2'>
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_dull_icon} alt="" className="w-3 5" />
              <p className='pl-2'>(122)</p>
            </div> */}
            <p className='mt-5 text-3xl font-medium'> {currency} {productData.price} </p>
            <p className='mt-5 text-gray-500 md:w-4/5'> {productData.description} </p>
            <div className='flex flex-col gap-4 my-8'>
              <p>{productData.shopName}</p>
              {/* <p>{productData.adminId}</p> */}

              {/* Show shop status (open/closed) */}
              <div className='flex gap-2'>
  <button
    className={`border py-2 px-4 font-semibold rounded ${
      shopStatus === null
        ? 'bg-gray-100 text-gray-600 border-gray-400 cursor-not-allowed' // Loading state
        : shopStatus
        ? 'bg-green-100 text-green-700 border-green-500 hover:bg-green-200' // Shop is Open
        : 'bg-red-100 text-red-700 border-red-500 hover:bg-red-200' // Shop is Closed
    }`}
    disabled={shopStatus === null} // Disable button during loading
  >
    {shopStatus === null ? 'Loading...' : shopStatus ? 'Shop is Open' : 'Shop is Closed'}
  </button>
</div>


              {/* <div className='flex gap-2'>
                 {productData.sizes.map((item , index) => (
                  <button onClick={() => setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : '' }`} key={index} >{item}</button>
                 ))} 
              </div> */}

              {/* change in S M L and updated to Is open ? */}
             
              {/* here change ends */}
            </div>
            {/* <button onClick={() => addToCart(productData._id , size , )} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button> */}
            <hr className='mt-8 sm:w-4/5 ' />
            <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              {productData.shopAddress}
            </div>
          </div>
        </div>

        {/* ----------------Description and Review Section ------------- */}
        <div className='mt-16'>
          <div className='flex'>
            <b className='border cursor-pointer px-5 py-3 text-sm'>Description</b>
            <p className='border cursor-pointer px-5 py-3 text-sm '>Reviews</p>
          </div>
          <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
             <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur, atque explicabo. Nisi impedit vero nihil corporis unde voluptatem, sapiente culpa tempore quo? Ipsam repellat veritatis consequuntur quidem vero. Vel consequuntur debitis veritatis sint deserunt perferendis dignissimos cum ipsam. Harum, ipsam autem!</p>
             <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos voluptatum deleniti numquam earum repellat, sunt praesentium reiciendis pariatur adipisci! Ea iste omnis dolores totam blanditiis? Recusandae ab dignissimos nam molestiae praesentium!</p>
          </div>
        </div>

        {/* ---------------Display Related Products -------------- */}
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product