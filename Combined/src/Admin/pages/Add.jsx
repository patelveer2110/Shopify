import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import axios from "axios"
import { backendUrl } from '../../App'
import { toast } from 'react-toastify'

const Add = ({token}) => {

  const [image, setImage] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("select")
  const [bestseller, setBestseller] = useState("false")

  const onSumbitHandler =async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData()

      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("bestseller", bestseller)

      formData.append("image",image)
      const token = localStorage.getItem('token_admin')
      
      const response = await axios.post(backendUrl + "/api/product/add",formData,{headers:{token_admin : token}})

      // console.log(response);

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage(false)
        setPrice('')
        setCategory('')
      } else {
        toast.error(response.data.message)
      }
      

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSumbitHandler} className="flex flex-col w-full items-start gap-3 mt-14 p-8">
  <div>
    <p className="mb-2">Upload Image</p>
    <div>
      <label htmlFor="image">
        <img className="w-20 sm:w-32" src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" />
        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
      </label>
    </div>
  </div>

  <div className="w-full">
    <p className="mb-2">Product Name</p>
    <input onChange={(e) => setName(e.target.value)} value={name} className="w-full px-3 py-2" type="text" placeholder="Type here" required />
  </div>

  <div className="w-full">
    <p className="mb-2">Product Description</p>
    <textarea onChange={(e) => setDescription(e.target.value)} value={description} className="w-full px-3 py-2" type="text" placeholder="Write content here" required />
  </div>

  <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
    <div className="w-full sm:w-auto">
      <p className="mb-2">Product Category</p>
      <select onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2" placeholder="Select" required>
        <option value="select">Select</option>
        <option value="Dairy">Dairy Items</option>
        <option value="Personal">Personal Care</option>
        <option value="Snacks">Namkeen and Snacks</option>
        <option value="Basic">Basic Groceries</option>
      </select>
    </div>

    <div className="w-full sm:w-auto">
      <p className="mb-2">Product Price</p>
      <input onChange={(e) => setPrice(e.target.value)} value={price} className="w-full sm:w-28 px-3 py-2" type="number" placeholder="Price" />
    </div>
  </div>

  <button type="submit" className="w-full sm:w-28 py-3 mt-4 bg-black text-white">Add</button>
</form>

  )
}

export default Add      