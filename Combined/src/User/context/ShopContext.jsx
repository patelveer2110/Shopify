import { createContext, useEffect, useState } from "react";
import { toast, useToast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { backendUrl}  from "../../App.jsx";
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    
    const currency = '₹';
    
    const [search , setSearch] = useState('')
    const [showSearch , setShowSearch] = useState(false)
    const [products , setProducts] = useState([])
    const [token,setToken] = useState('')
    const navigate = useNavigate();
    
    
    const getProductsData = async () => {
        try {            
            const response = await axios.get(backendUrl + '/api/product/listall')
            console.log("ygtvrf");
            
            if (response.data.success) {
                setProducts(response.data.products)
            }
            
            console.log(response.data);
            

        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getProductsData()
    },[])

    useEffect(() =>{
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
        }
    },[])

    const value = {
        products , currency ,
        search , setSearch , showSearch , setShowSearch , 
        navigate,backendUrl,
        setToken,token
    }
    
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}
export default ShopContextProvider ;