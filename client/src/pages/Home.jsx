import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
//profile sobar jonno banate hbe
export default function Home() {
  const{currentUser}=useSelector(state=>state.user);
  return (
    <div>
      <ul>
        {currentUser?(
          <Link to='/profile'>
              <li className='text-blue-700 hover:underline'>profile</li>
          </Link>
        ):(
          <Link to='/login'>
              <li className='text-blue-700 hover:underline'>login</li>
          </Link>
        )}
        <Link to='/about'>
            <li className='text-blue-700 hover:underline'>about</li>
        </Link>
        <Link to='/registration_verification'>
              <li className='text-blue-700 hover:underline'>registration</li>
        </Link>
        {currentUser?.usertype==='student' && (
          <>
            <Link to='/update_mealstatus'>
              <li className='text-blue-700 hover:underline'>update meal</li>
            </Link>
            <Link to='/payment'>
              <li className='text-blue-700 hover:underline'>payment page</li>
            </Link>
          </>
        )}
        {currentUser?.usertype==='admin' && (
          <>
            <Link to='/add_manager'>
              <li className='text-blue-700 hover:underline'>add manager</li>
            </Link>
          </>
        )}
        {currentUser?.usertype==='manager' && (
          <>
            <Link to='/update_mealschedule'>
              <li className='text-blue-700 hover:underline'>update mealschedule</li>
            </Link>
          </>
        )}
      </ul>
    </div>
  )
}
