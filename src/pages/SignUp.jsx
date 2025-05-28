import React, { useState } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
const SignUp = () => {

  const {token , setToken , setAuthUser }=useContext(AuthContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")



  const handleSubmit = async (e) => {

    try {

      e.preventDefault();
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/user/signup", { email, password ,name})
      if (response.data.success) {
        
        Cookies.set("token", response.data.token)
        setToken(response.data.token)
       
        toast.success("SignUp Successfull")

      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }

  }



  return (
     <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md ">
        <h1 className="text-2xl font-bold mb-4 ">Sign Up Now</h1>

        <form onSubmit={handleSubmit}>

         <div className="mb-3 min-w-72 ">
            <p className="text-sm font-medium text-gray-700 mb-2 ">Name</p>
            <input value={name} onChange={(e) => setName(e.target.value)} name="email" className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none" type="text" placeholder="your@email.com" required />
          </div>

          <div className="mb-3 min-w-72 ">
            <p className="text-sm font-medium text-gray-700 mb-2 ">Email Address</p>
            <input value={email} onChange={(e) => setEmail(e.target.value)} name="email" className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none" type="text" placeholder="your@email.com" required />
          </div>

          <div className="mb-3 min-w-72 ">
            <p className="text-sm font-medium text-gray-700 mb-2 ">Password</p>
            <input value={password} onChange={(e) => setPassword(e.target.value)} name="password" className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none" type="password" placeholder="password" required />
          </div>


          <button className="cursor-pointer mt-2 w-full py-2 px-4 rounded-md bg-black text-white" type="submit">Sign Up</button>
              <div className=" flex justify-center items-center">
              <Link to="/login" className='text-sm mx-auto text-blue-500 mt-4  text-center' >Alredy Have Account ? Login</Link>
              </div>
        </form>
      </div>
    </div>

  )
}

export default SignUp