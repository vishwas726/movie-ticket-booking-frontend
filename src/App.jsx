import React, { useContext } from 'react'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import toast, { Toaster } from 'react-hot-toast';
import SignUp from './pages/SignUp.jsx'
import { AuthContext } from './context/AuthContext.jsx'

function App() {

const {token}=useContext(AuthContext)

// const navigate=useNavigate()
  return (
    <>
    
     <Routes>


         
         <Route  path='/login'   element={!token ? <Login /> : <Navigate to="/" replace />}/>
         <Route  path='/signup'  element={!token ? <SignUp /> : <Navigate to="/" replace />}/>

       <Route path="/" element={token ? <Home /> : <Navigate to="/login" replace />} />


     </Routes>

     <Toaster />


    </>
  )
}

export default App
