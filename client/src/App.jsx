import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import PrivateRouteStudent from './components/PrivateRoute';
import UpdataMeal from './pages/UpdataMeal';
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

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/registration_verification" element={<RegVerification />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/forget_password" element={<ForgetPass />} />
        <Route path="/payment_success/:tranId" element={<PaymentSuccess />} />
        <Route path="/payment_failed" element={<PaymentFailed />} />
        <Route path="/payment_cancelled" element={<PaymentCancelled />} />
        <Route path="/view_notice" element={<Notice />} />
        <Route path="/view_notice_details/:noticeId" element={<NoticeDetails />} />
        <Route path="/view_expense" element={<Expense />} />
        <Route path="/view_expense_details/:expenseId" element={<ExpenseDetails />} />
        <Route path="/view_survey" element={<SurveyList />} />
        <Route element={<PrivateRouteStudent />}>
          <Route path="/update_mealstatus" element={<UpdataMeal />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/give_feedback" element={<GiveFeedback />} />
          <Route path="/payment_history/:studentId" element={<PaymentHistory />} />
          <Route path="/meal_history/:studentId" element={<MealHistory />} />
          <Route path="/survey_response/:surveyId" element={<SurveyResponse />} />
        </Route>
        <Route element={<PrivateRouteTeacher />}>
          <Route path="/add_manager" element={<AddManager />} />
        </Route>
        <Route element={<PrivateRouteManager />}>
          <Route path="/update_mealschedule" element={<MealSchedule />} />
          <Route path="/upload_notice" element={<UploadNotice />} />
          <Route path="/upload_expense" element={<UploadExpense />} />
          <Route path="/create_survey" element={<SurveyTool />} />
          <Route path="/student_feedback" element={<FeedbackList />} />
          <Route path="/view_meal_list" element={<MealList />} />
          <Route path="/view_survey_result/:surveyId" element={<SurveyResults />} />
          <Route path="/view_refund_list" element={<RefundList />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}