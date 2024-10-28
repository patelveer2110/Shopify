import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, loading } = useContext(ShopContext);
  const [productData, setProductData] = useState({});
  const [image, setImage] = useState('');

  const fetchProductData = () => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image);
    }
  };

  useEffect(() => {
    if (!loading && products.length > 0) {
      fetchProductData();
    }
  }, [productId, products, loading]);

  return productData && Object.keys(productData).length > 0 ? (
    <div className='border-t-2 pt-10'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        <div className='flex-1'>
          <img className='w-full h-auto' src={image} alt={productData.name} />
        </div>
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <p className='mt-5 text-3xl font-medium'>{currency} {productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <p>{productData.shopName}</p>
          <p className={productData.inStock ? 'text-green-600' : 'text-red-600'}>
            {productData.inStock ? 'In Stock' : 'Out of Stock'}
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Product;
