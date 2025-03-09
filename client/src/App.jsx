import React from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import RegVerification from './pages/RegVerification';
import Registration from './pages/Registration';
import LogIn from './pages/LogIn';
import ForgetPass from './pages/ForgetPass';
import PaymentFailed from './pages/PaymentFailed';
import PaymentCancelled from './pages/PaymentCancelled';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import PrivateRouteStudent from './components/PrivateRouteStudent';
import AddManager from './pages/AddManager';
import PrivateRouteTeacher from './components/PrivateRouteTeacher';
import PrivateRouteManager from './components/PrivateRouteManager';
import MealSchedule from './pages/MealSchedule';
import Payment from './pages/Payment';
import UploadNotice from './pages/UploadNotice';
import GiveFeedback from './pages/GiveFeedback';
import UploadExpense from './pages/UploadExpense';
import SurveyTool from './pages/SurveyTool';
import SurveyResponse from './pages/SurveyResponse';
import Notice from './pages/Notice';
import NoticeDetails from './pages/NoticeDetails';
import Expense from './pages/Expense';
import ExpenseDetails from './pages/ExpenseDetails';
import SurveyList from './pages/SurveyList';
import SurveyResults from './pages/SurveyResults';
import FeedbackList from './pages/FeedbackList';
import MealList from './pages/MealList';
import RefundList from './pages/RefundList';
import PaymentHistory from './pages/PaymentHistory';
import MealHistory from './pages/MealHistory';
import Header from './components/Header';
import Footer from './components/Footer';
import RefundHistory from './pages/RefundHistory';
import AllTransaction from './pages/AllTransaction';
import ResignView from './pages/ResignView';
import RegistrationStatus from './pages/RegistrationStatus';
import MealPayment from './pages/MealPayment';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import UpdataMealStatus from './pages/UpdateMealStatus';
import PrivateRouteBoth from './components/PrivateRouteBoth'

export default function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/registration_verification" element={<RegVerification/>}/>
        <Route path="/registration/:hallId" element={<Registration/>}/>
        <Route path="/login" element={<LogIn/>}/>
        <Route path='/forget_password' element={<ForgetPass/>}/>
        <Route path='/payment_failed' element={<PaymentFailed/>}/> 
        <Route path='/payment_cancelled' element={<PaymentCancelled/>}/>
        <Route path='/view_notice' element={<Notice/>}/>
        <Route path='/view_notice_details/:noticeId' element={<NoticeDetails/>}/>
        <Route path='/view_expense' element={<Expense/>}/>
        <Route path='/view_expense_details/:expenseId' element={<ExpenseDetails/>}/>
        <Route path='/view_survey' element={<SurveyList/>}/>
        <Route path='/terms_of_service' element={<TermsOfService/>}/>
        <Route path='/privacy_policy' element={<PrivacyPolicy/>}/>
        <Route element={<PrivateRouteStudent/>}>
          <Route path='/update_mealstatus' element={<UpdataMealStatus/>}/>
          <Route path='/payment' element={<Payment/>}/>
          <Route path='/give_feedback' element={<GiveFeedback/>}/>
          <Route path='/payment_history/:studentId' element={<PaymentHistory/>}/>
          <Route path='/meal_history/:studentId' element={<MealHistory/>}/>
          <Route path='/survey_response/:surveyId' element={<SurveyResponse/>}/>
        </Route>
        <Route element={<PrivateRouteTeacher/>}>
          <Route path='/add_manager' element={<AddManager/>}/>
        </Route>
        <Route element={<PrivateRouteBoth/>}>
          <Route path='/create_survey' element={<SurveyTool/>}/>
          <Route path='/view_survey_result/:surveyId' element={<SurveyResults/>}/>
        </Route>
        <Route element={<PrivateRouteManager/>}>
          <Route path='/update_mealschedule' element={<MealSchedule/>}/>
          <Route path='/upload_notice' element={<UploadNotice/>}/>
          <Route path='/upload_expense' element={<UploadExpense/>}/>
          <Route path='/student_feedback' element={<FeedbackList/>}/>
          <Route path='/view_meal_list' element={<MealList/>}/>
          <Route path='/view_refund_list' element={<RefundList/>}/>
          <Route path='/view_refund_history' element={<RefundHistory/>}/>
          <Route path='/view_all_transaction' element={<AllTransaction/>}/>
          <Route path='/resign_view' element={<ResignView/>}/>
          <Route path='/unregistered_student' element={<RegistrationStatus/>}/>
          <Route path='/meal_payment' element={<MealPayment/>}/>
        </Route>
        <Route element={<PrivateRoute/>}>
          <Route path='/profile' element={<Profile/>}/>
        </Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}
