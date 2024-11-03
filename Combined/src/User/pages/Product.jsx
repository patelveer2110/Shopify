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
    <div className="border-t-2 pt-10 px-4 md:px-8 lg:px-16 bg-gray-50">
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
        <div className="flex-1">
          <img className="w-full h-auto rounded-lg shadow-lg" src={image} alt={productData.name} />
        </div>
        <div className="flex-1 text-gray-800">
          <h1 className="font-semibold text-2xl sm:text-3xl mt-4">{productData.name}</h1>
          <p className="mt-4 text-3xl font-semibold text-gray-800">
            {currency} {productData.price}
          </p>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            {productData.description}
          </p>
          <p className="mt-4 text-lg font-medium text-gray-800">{productData.shopName}</p>
          <p className="mt-2 text-gray-700">{productData.shopAddress}</p>
          <p className={`mt-4 font-semibold ${productData.inStock ? 'text-green-600' : 'text-red-600'}`}>
            {productData.inStock ? 'In Stock' : 'Out of Stock'}
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center py-12 text-gray-500 font-medium">Loading...</div>
  );
};

export default Product;
