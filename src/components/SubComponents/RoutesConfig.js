import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../Main/Dashboard';
import Signup from '../Main/Signup';
import CategoryDetail from '../CategoryDetail';
import Referal from '../Marketting/Referal'
import Cookies from 'universal-cookie';
import Login from '../Main/Login';
import Comics from '../Comics';
import Users from '../users';
import JokeList from '../Jokes/JokeList';
import AdmobPage from '../AdmobPage';
import Help from '../Help';
import SuggestionsPage from '../SuggestionsPage';
import CouponPage from '../CouponPage';
import UserLogs from '../UserLogs';
import ActivityTracker from '../userLogs/ActivityTracker'
import CourseSelectionPage from '../Course/CourseSelectionPage';  
import AdminAssignmentPage from '../Assignment/AdminAssignmentPage';
import SubmitTaskPage from '../Assignment/SubmitTaskPage';
import FinalReviewPage from '../Assignment/AdminReviewPage';
import ReviewSubmissionPage from '../Assignment/ReviewSubmissionPage';
import CompanyHierarchy from '../Profile/CompanyHierarchy';
import NotFound from './NotFound'; // Your 404 component
import AssignmentResults from '../Assignment/AssignmentResults';
import SelectedCourse from '../Course/SelectedCourse';
import AddCourse from '../Course/AddCourse';
import ChangePassword from '../Main/ChangePassword';
import Attendance from '../Main/Attendance';
import PermissionManagement from '../Main/PermissionManagement';
import PricingTable from '../Assignment/PricingTable'

const RoutesConfig = ({  setIsLoggedIn, isLoggedIn, history,token, settoken,setRole,role,setUserId,userId, element, ...rest}) => {

  const isAuthenticated = () => {

    return !! localStorage.getItem('token') // Check if token exists
  };
  // setRole(localStorage.getItem('role'))

  return (
    <Routes>
                <Route component={NotFound} /> {/* Catch-all route for 404 */}

            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={!isAuthenticated() ? <Login settoken={settoken} setIsLoggedIn={setIsLoggedIn} setRole={setRole} setUserId={setUserId} /> : <Navigate to="/login" />}  />
            <Route path="*" element={<Navigate to="/login" />} />

          <Route
              path="/profile"
              element={isAuthenticated() ? <CompanyHierarchy  />
              : <Navigate to="/login" />}
            />
  <Route
              path="/plans"
              element={isAuthenticated() ? <PricingTable userId={userId}  />
              : <Navigate to="/login" />}
            />
        <Route
              path="/attendance"
              element={isAuthenticated() ? <Attendance  />
              : <Navigate to="/login" />}
            />
          <Route
              path="/referal"
              element={isAuthenticated() ? <Referal  />
              : <Navigate to="/login" />}
            />
            <Route
              path="/"
              element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
            />
              <Route path="/category/:category" element={isAuthenticated() ? <CategoryDetail  />: <Navigate to="/login" />} />

              <Route
              path="/createuser"
              element={isAuthenticated() ? <Signup /> : <Navigate to="/login" />}
            />
                <Route
              path="/permission"
              element={isAuthenticated() ? <PermissionManagement /> : <Navigate to="/login" />}
            />
                 <Route
              path="/passwordchange"
              element={isAuthenticated() ? <ChangePassword /> : <Navigate to="/login" />}
            />
        
            <Route
  path="/userlogs"
  element={isAuthenticated() ? <UserLogs /> : <Navigate to="/login" />}
/>
            <Route
              path="/coupons"
              element={isAuthenticated() ? <CouponPage /> : <Navigate to="/login" />}
            />
              <Route
              path="/activitytrack"
              element={isAuthenticated() ? <ActivityTracker /> : <Navigate to="/login" />}
            />
            <Route
              path="/jokes"
              element={isAuthenticated() ? <JokeList /> : <Navigate to="/login" />}
            />
              <Route
              path="/comic"
              element={isAuthenticated() ? <Comics role={role} userId={userId} /> : <Navigate to="/login" />}
            />
                <Route
              path="/admob"
              element={isAuthenticated() ? <AdmobPage role={role} userId={userId} /> : <Navigate to="/login" />}
            />
                   <Route
              path="/help"
              element={isAuthenticated() ? <Help role={role} userId={userId} /> : <Navigate to="/login" />}
            />
            <Route
            path="/suggestions"
            element={isAuthenticated() ? <SuggestionsPage /> : <Navigate to="/login" />}
          />
             <Route
              path="/user"
              element={isAuthenticated() ? <Users role={role} userId={userId} /> : <Navigate to="/login" />}
            />
   {/* Add Course Selection Route */}
   <Route path="/course-selection" element={isAuthenticated() ? <CourseSelectionPage /> : <Navigate to="/login" />} />
   <Route path="/course/:courseId" element={isAuthenticated() ? <SelectedCourse /> : <Navigate to="/login" />} />
   <Route path="/addcourse" element={isAuthenticated() ? <AddCourse /> : <Navigate to="/login" />} />

   <Route
          path="/assign-task"
          element={isAuthenticated() ?  <AdminAssignmentPage /> : <Navigate to="/not-authorized" />}
        />
        <Route
          path="/submit-task"
          element={isAuthenticated() ?  <SubmitTaskPage /> : <Navigate to="/not-authorized" />}
        />
        <Route
          path="/review-submission"
          element={isAuthenticated() ?  <ReviewSubmissionPage /> : <Navigate to="/not-authorized" />}
        />
        <Route
          path="/final-review"
          element={isAuthenticated() ?  <FinalReviewPage /> : <Navigate to="/not-authorized" />}
        />
         <Route
          path="/assignmentresult"
          element={isAuthenticated() ?  <AssignmentResults /> : <Navigate to="/not-authorized" />}
        />
        
        <Route
          path="/not-authorized"
          element={<div>You are not authorized to view this page</div>}
        />
            {/* <Route
              path="/create-user"
              element={isAuthenticated()? <CreateUser /> : <Navigate to="/login" />}
            /> */}

       
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
  );
};

export default RoutesConfig;