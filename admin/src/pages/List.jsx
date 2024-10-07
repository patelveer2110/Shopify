import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import axios from 'axios'

const List = ({token}) => {
  const [list, setList] = useState([])

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list', {
        headers: { token_admin: token }
      })

      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, {
        headers: { token_admin: token }
      })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='px-4 sm:px-6 lg:px-8 mt-14 sm:mt-auto'>
      <p className='text-lg font-bold mb-4'>All Products List</p>

      <div className='flex flex-col gap-4'>
        {/* ---------------------Table Header (Hidden on small screens)------------------ */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-4 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/* -------------Product List ------------------------ */}
        {list.map((item, index) => (
          <div
            key={index}
            className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-2 px-4 border text-sm bg-white rounded-lg shadow-md'
          >
            <img className='w-16 h-16 object-cover' src={item.image} alt={item.name} />
            <p className='truncate'>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <button
              onClick={() => removeProduct(item._id)}
              className='text-right md:text-center text-red-600 hover:underline'
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default List
