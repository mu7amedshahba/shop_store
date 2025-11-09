import React, { useEffect } from 'react'
import { E_SHOP_TOKEN, JWT_TOKEN } from './authPaths'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import Cookies from 'js-cookie'
// 
const RequireBack = ({ redirectTo, children }) => {
    const token = Cookies.get(E_SHOP_TOKEN)
    const location = useLocation()
    try {
        if (token) return <Navigate to={redirectTo} state={{ from: location }} replace={true} />

    } catch (error) {
        console.log(error)
    }


    return children ? children : <Outlet />
}

export default RequireBack
