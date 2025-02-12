import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { backendUrl } from '../../App';
import { toast } from 'react-toastify';

const Product = ({ token }) => {
  const { productId } = useParams();
  const { products, currency, loading } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState('takeaway');
  const [address, setAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const [adminId, setAdminId] = useState(''); // Added to handle adminId

  // Fetch product data from the context (or API)
  const fetchProductData = () => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image);
      setAdminId(product.adminId._id); // Set adminId from product data
    } else {
      toast.error('Product not found');
    }
  };

  // Handle submitting the order
  const handleOrder = async (e) => {
    e.preventDefault();

    // Validation checks
    if (quantity <= 0) {
      toast.error('Please select a valid quantity');
      return;
    }
    if (orderType === 'delivery' && !address) {
      toast.error('Please enter a delivery address');
      return;
    }

    try {
      const orderData = {
        productId: productData._id,
        adminId: productData.adminId,
        orderType,
        mobileNumber,
        quantity,
        address: orderType === 'delivery' ? address : undefined,
        total: quantity * productData.price
      };

      const response = await axios.post(`${backendUrl}/api/order/place-order`, orderData, {
        headers: { token: token },
      });

      if (response.data.success) {

        toast.success('Product Ordered successfully');
      } else {

        toast.error(response.data.message);
      }


    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle adding to cart
  // Handle adding to cart
  const handleAddToCart = async () => {
    if (!productData.inStock) {
      setQuantity(0); // Ensure out-of-stock items are added with quantity 0
    }

    try {
      const cartData = {
        productId: productData._id,
        quantity: productData.inStock ? quantity : 0, // 0 if out of stock
        adminId, // Include adminId in the cart data
      };

      const response = await axios.post(`${backendUrl}/api/cart/add`, cartData, {
        headers: { token: token },
      });

      if (response.data.success) {
        setCartMessage('Added to cart successfully!');
        toast.success('Product added to cart');
      } else {
        setCartMessage('Failed to add to cart');
        toast.error(response.data.message);
      }
    } catch (error) {
      setCartMessage('Failed to add to cart');
      toast.error(error.message);
    }
  };


  useEffect(() => {
    if (!loading && products.length > 0) {
      fetchProductData();
    }
  }, [productId, products, loading]);

  return productData ? (
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
          <p className={`mt-4 font-semibold ${productData.inStock ? 'text-green-600' : 'text-red-600'}`}>
            {productData.inStock ? 'In Stock' : 'Out of Stock'}
          </p>
          <p className="mt-4 text-lg font-medium text-gray-800">{productData.adminId?.shopName}</p>
          <p className="mt-2 text-gray-700">{productData.adminId?.address}</p>

          {/* Order Form */}
          {/* Order Form - Show only if inStock is true */}
          {productData.inStock && (
            <form onSubmit={handleOrder} className="mt-6 bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <label className="mr-4 font-semibold">Order Type:</label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                  disabled={productData.adminId?.deliveryOption === 'takeaway'} // Disable dropdown if only takeaway is available
                >
                  <option value="takeaway">Takeaway</option>
                  {productData.adminId?.deliveryOption === 'delivery' && <option value="delivery">Delivery</option>}
                </select>
              </div>

              {/* Show message if delivery is not available */}
              {productData.adminId?.deliveryOption === 'takeaway' && (
                <p className="text-red-600 font-semibold mt-2">Delivery is not available for this shop.</p>
              )}


              <div className="mb-4">
                <label htmlFor="mobileNumber" className="font-semibold">Contact Number</label>
                <input
                  type="text"
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your mobile number"
                  required
                />
              </div>

              {orderType === 'delivery' && (
                <div className="mb-4">
                  <label htmlFor="address" className="font-semibold">Delivery Address:</label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter your delivery address"
                    required
                  />
                </div>
              )}

              <div className="flex items-center mb-4">
                <label htmlFor="quantity" className="mr-4 font-semibold">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 mt-4 bg-black hover:bg-slate-900 text-white font-semibold rounded-md transition duration-200"
              >
                Place Order
              </button>
            </form>
          )}

          {/* Add to Cart Button */}
          <div className="mt-6">
            <button
              onClick={handleAddToCart}
              className="w-full py-2 mt-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-md transition duration-200"
            >
              Add to Cart
            </button>
            {cartMessage && <p className="mt-2 text-sm text-gray-500">{cartMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  ) : loading ? (
    <div className="text-center py-12 text-gray-500 font-medium">Loading product details...</div>
  ) : (
    <div className="text-center py-12 text-gray-500 font-medium">Product not found</div>
  );
};

export default Product;
