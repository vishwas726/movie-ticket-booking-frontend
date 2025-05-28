import React, { createContext, useState } from "react";
import Cookies from 'js-cookie'; // ✅ correct import

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {

  const [authUser, setAuthUser] = useState({});

  const [token, setToken] = useState(Cookies.get("token"))

  console.log(token)

  
 

  const value = {
    authUser,
    setAuthUser,
    token,
    setToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
