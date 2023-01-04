

import React, { useState } from "react";
const AuthContext = React.createContext({
  token : '',
  isLoggedIn : false,
  login : (token)=>{},
  logout : ()=>{}
})

 export const AuthContextProvider= (props)=>{
    const [token, setToken]= useState(null)

    const userIsLoggedIn = !!token // to convert it in boolean value it toggle as true & false 
    const loginHandler = (token)=>{
       setToken(token)
    }

    const logoutHandler =()=>{
        setToken(null) // to clear the token after logout
    }

    const contextValue = {
      token: token,
      isLoggedIn: userIsLoggedIn,
      login: loginHandler,
      logout: logoutHandler,
    };
    return (
      <AuthContext.Provider value={contextValue}>
        {props.children}
      </AuthContext.Provider>
    );


}
export default AuthContext;
