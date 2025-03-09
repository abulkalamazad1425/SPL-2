import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet,Navigate } from 'react-router-dom';

export default function PrivateRouteStudent() {
    const {currentUser}=useSelector((state)=>state.user);
  return currentUser?.usertype==='student'?<Outlet/>:<Navigate to='/login'/>
}