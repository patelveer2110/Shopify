import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../../App.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newImage, setNewImage] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: { token_admin: token },
      });
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        {
          headers: { token_admin: token },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateProduct = async (product) => {
    try {
      const formData = new FormData();
      formData.append('Id', product._id);
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('price', product.price);
      formData.append('category', product.category);
      formData.append('inStock', product.inStock);
      if (newImage) formData.append('image', newImage); // Add new image if provided
      console.log('Updating product:', formData);
      const response = await axios.post(`${backendUrl}/api/product/update`,formData,{  headers: { token_admin: token },});
      console.log(response);
      
      if (response.data.success) {
        toast.success('Product updated successfully');
        setEditingProduct(null);
        setNewImage(null);
        await fetchList();
      } else {
        toast.error(response.data.message);
        console.error(response.data.message); // Log error for debugging
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-16 sm:mt-auto">
      <p className="text-lg font-bold mb-4">All Products List</p>

      <div className="flex flex-col gap-4">
        {list.map((item) => (
          <div
            key={item._id}
            className="flex flex-col sm:flex-row items-start gap-4 py-4 px-4 border text-sm bg-white rounded-lg shadow-md"
          >
            {/* Product Image */}
            <div className="flex items-center">
              <label htmlFor={`image-${item._id}`} className="cursor-pointer">
                <img
                  className="w-20 h-20 object-cover rounded-md border border-gray-300"
                  src={
                    newImage && editingProduct?._id === item._id
                      ? URL.createObjectURL(newImage)
                      : item.image
                  }
                  alt={item.name}
                />
                <input
                  type="file"
                  id={`image-${item._id}`}
                  hidden
                  onChange={(e) => {
                    if (editingProduct?._id === item._id) {
                      setNewImage(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>

            {/* Product Details */}
            <div className="flex flex-col gap-2 flex-grow">
              {editingProduct?._id === item._id ? (
                <div>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Dairy">Dairy Items</option>
                    <option value="Personal">Personal Care</option>
                    <option value="Snacks">Namkeen and Snacks</option>
                    <option value="Basic">Basic Groceries</option>
                    <option value="Food">Fast And Street Foods</option>
                  </select>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingProduct.inStock}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          inStock: e.target.checked,
                        })
                      }
                    />
                    In Stock
                  </label>
                  <button
                    onClick={() => updateProduct(editingProduct)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md mt-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setNewImage(null); // Reset new image on cancel
                    }}
                    className="px-4 py-2 bg-gray-400 text-white rounded-md mt-2 ml-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:justify-between items-center w-full">
                  <div>
                    <p>
                      <b>Name:</b> {item.name}
                    </p>
                    <p>
                      <b>Category:</b> {item.category}
                    </p>
                    <p>
                      <b>Price:</b> {currency}
                      {item.price}
                    </p>
                    <p>
                      <b>Stock:</b>{' '}
                      <span className={item.inStock ? 'text-green-600' : 'text-red-600'}>
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => setEditingProduct(item)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeProduct(item._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
