import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../../App';
import { toast } from 'react-toastify';

const Add = ({ token }) => {
  const [image, setImage] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('select');
  const [bestseller, setBestseller] = useState('false');
  const [inStock, setInStock] = useState(true); // New state for stock status
  const [formKey, setFormKey] = useState(Date.now()); // Key for form re-render

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!image) {
      toast.error('Please upload an image');
      return;
    }
    if (name.trim() === '') {
      toast.error('Please enter the product name');
      return;
    }
    if (description.trim() === '') {
      toast.error('Please enter the product description');
      return;
    }
    if (price === '' || price <= 0) {
      toast.error('Please enter a valid product price');
      return;
    }
    if (category === 'select') {
      toast.error('Please select a product category');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('bestseller', bestseller);
      formData.append('image', image);
      formData.append('inStock', inStock); // Add stock status to form data

      const token = localStorage.getItem('token_admin');
      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        { headers: { token_admin: token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setImage(false);
        setPrice('');
        setCategory('select'); // Reset category to "Select" option
        setInStock(true); // Reset in-stock checkbox to default
        setFormKey(Date.now()); // Trigger form re-render
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      key={formKey} // Use key to force re-render
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-4 mt-10 p-8 bg-gray-50 rounded-lg shadow-md"
    >
      <div>
        <p className="mb-2 text-gray-700 font-semibold">Upload Image</p>
        <div>
          <label htmlFor="image" className="cursor-pointer">
            <img
              className="w-24 h-24 object-cover rounded-md border border-gray-300"
              src={!image ? assets.upload_area : URL.createObjectURL(image)}
              alt="Upload"
            />
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2 text-gray-700 font-semibold">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2 text-gray-700 font-semibold">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Write content here"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="w-full sm:w-auto">
          <p className="mb-2 text-gray-700 font-semibold">Product Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="select">Select</option>
            <option value="Dairy">Dairy Items</option>
            <option value="Personal">Personal Care</option>
            <option value="Snacks">Namkeen and Snacks</option>
            <option value="Basic">Basic Groceries</option>
            <option value="Food">Fast And Street Foods</option>
          </select>
        </div>

        <div className="w-full sm:w-auto">
          <p className="mb-2 text-gray-700 font-semibold">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 border border-gray-300 rounded-md sm:w-32"
            type="number"
            placeholder="Price"
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="inStock"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
        />
        <label htmlFor="inStock" className="text-gray-700 font-semibold">In Stock</label>
      </div>

      <button
        type="submit"
        className="w-full sm:w-32 py-2 mt-4 bg-black hover:bg-slate-900 text-white font-semibold rounded-md transition duration-200"
      >
        Add Product
      </button>
    </form>
  );
};

export default Add;
