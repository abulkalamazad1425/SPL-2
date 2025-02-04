import React from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import RegVerification from './pages/RegVerification';
import Registration from './pages/Registration';
import LogIn from './pages/LogIn';
import ForgetPass from './pages/ForgetPass';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import PaymentCancelled from './pages/PaymentCancelled';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import UpdataMeal from './pages/UpdataMeal';
import AddManager from './pages/AddManager';
import PrivateRouteTeacher from './components/PrivateRouteTeacher';
import PrivateRouteManager from './components/PrivateRouteManager';
import MealSchedule from './pages/MealSchedule';
import Payment from './pages/Payment';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/registration_verification" element={<RegVerification/>}/>
        <Route path="/registration" element={<Registration/>}/>
        <Route path="/login" element={<LogIn/>}/>
        <Route path='/forget_password' element={<ForgetPass/>}/>
        <Route path='/payment_success/:tranId' element={<PaymentSuccess/>}/> 
        <Route path='/payment_failed' element={<PaymentFailed/>}/> 
        <Route path='/payment_cancelled' element={<PaymentCancelled/>}/>
        <Route element={<PrivateRoute/>}>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/update_mealstatus' element={<UpdataMeal/>}/>
          <Route path='/payment' element={<Payment/>}/>
        </Route>
        <Route element={<PrivateRouteTeacher/>}>
          <Route path='add_manager' element={<AddManager/>}/>
        </Route>
        <Route element={<PrivateRouteManager/>}>
          <Route path='update_mealschedule' element={<MealSchedule/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
