import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet,Navigate } from 'react-router-dom';

export default function PrivateRoute() {
    const {currentUser}=useSelector((state)=>state.user);
  return currentUser.usertype==='student'?<Outlet/>:<Navigate to='/login'/>
}
// sobar jonno alada private route banate hbe