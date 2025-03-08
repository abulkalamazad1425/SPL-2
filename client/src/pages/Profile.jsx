import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import StudentProfile from '../components/StudentProfile';
import ManagerProfile from '../components/ManagerProfile';
import TeacherProfile from '../components/TeacherProfile';
import { logInSuccess } from '../redux/user/userSlice';
export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch=useDispatch();
  useEffect(()=>{
    async function fetchCurrentUser(){
      const res=await fetch(`/api/auth/current_profile/${currentUser._id}`);
      const data=await res.json();
      if(data.success===false){
        console.log('error profile');
        return;
      }
      dispatch(logInSuccess(data));
    }
    fetchCurrentUser();
  },[])

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  // Render different profiles based on usertype
  switch (currentUser?.usertype) {
    case 'student':
      return <StudentProfile currentUser={currentUser} />;
    case 'manager':
      return <ManagerProfile currentUser={currentUser} />;
    case 'admin':
      return <TeacherProfile currentUser={currentUser} />;
    default:
      return <div>User type not recognized</div>;
  }
}
