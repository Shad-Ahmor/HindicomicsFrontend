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
import InternDashboard from '../Intern/InternDashboard'
import ManagerReview from '../Assignment/ManagerReview';
const RoutesConfig = ({  setIsLoggedIn, isLoggedIn, history,token, settoken,setRole,role,setUserId,userId, element, ...rest}) => {

  const isAuthenticated = () => {

    return !! localStorage.getItem('token') // Check if token exists
  };
  // setRole(localStorage.getItem('role'))

  return (
    <Routes>
                <Route component={NotFound} /> {/* Catch-all route for 404 */}

            <Route path="/" element={<Navigate to="/attendance" />} />
            <Route path="/login" element={!isAuthenticated() ? <Login settoken={settoken} setIsLoggedIn={setIsLoggedIn} setRole={setRole} setUserId={setUserId} /> : <Navigate to="/attendance" />}  />
            <Route path="*" element={<Navigate to="/attendance" />} />

          <Route
              path="/profile"
              element={isAuthenticated() ? <CompanyHierarchy  />
              : <Navigate to="/attendance" />}
            />
  <Route
              path="/plans"
              element={isAuthenticated() ? <PricingTable userId={userId}  />
              : <Navigate to="/attendance" />}
            />
        <Route
              path="/attendance"
              element={isAuthenticated() ? <Attendance  />
              : <Navigate to="/attendance" />}
            />
          <Route
              path="/referal"
              element={isAuthenticated() ? <Referal  />
              : <Navigate to="/attendance" />}
            />
            <Route
              path="/dashboard"
              element={isAuthenticated() ? <Dashboard /> : <Navigate to="/attendance" />}
            />

            <Route
            path='/interndashboard'
            element={isAuthenticated() ? <InternDashboard /> : <Navigate to="/attendance" />}
            />
              <Route path="/category/:category" element={isAuthenticated() ? <CategoryDetail  />: <Navigate to="/attendance" />} />

              <Route
              path="/createuser"
              element={isAuthenticated() ? <Signup /> : <Navigate to="/attendance" />}
            />
                <Route
              path="/permission"
              element={isAuthenticated() ? <PermissionManagement /> : <Navigate to="/attendance" />}
            />
                 <Route
              path="/passwordchange"
              element={isAuthenticated() ? <ChangePassword /> : <Navigate to="/attendance" />}
            />
        
            <Route
  path="/userlogs"
  element={isAuthenticated() ? <UserLogs /> : <Navigate to="/attendance" />}
/>
            <Route
              path="/coupons"
              element={isAuthenticated() ? <CouponPage /> : <Navigate to="/attendance" />}
            />
              <Route
              path="/activitytrack"
              element={isAuthenticated() ? <ActivityTracker /> : <Navigate to="/attendance" />}
            />
            <Route
              path="/jokes"
              element={isAuthenticated() ? <JokeList /> : <Navigate to="/attendance" />}
            />
              <Route
              path="/comic"
              element={isAuthenticated() ? <Comics role={role} userId={userId} /> : <Navigate to="/attendance" />}
            />
                <Route
              path="/admob"
              element={isAuthenticated() ? <AdmobPage role={role} userId={userId} /> : <Navigate to="/attendance" />}
            />
                   <Route
              path="/help"
              element={isAuthenticated() ? <Help role={role} userId={userId} /> : <Navigate to="/attendance" />}
            />
            <Route
            path="/suggestions"
            element={isAuthenticated() ? <SuggestionsPage /> : <Navigate to="/attendance" />}
          />
             <Route
              path="/user"
              element={isAuthenticated() ? <Users role={role} userId={userId} /> : <Navigate to="/attendance" />}
            />
   {/* Add Course Selection Route */}
   <Route path="/course-selection" element={isAuthenticated() ? <CourseSelectionPage /> : <Navigate to="/attendance" />} />
   <Route path="/course/:courseId" element={isAuthenticated() ? <SelectedCourse /> : <Navigate to="/attendance" />} />
   <Route path="/addcourse" element={isAuthenticated() ? <AddCourse /> : <Navigate to="/attendance" />} />

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
          element={isAuthenticated() ?  <ManagerReview /> : <Navigate to="/not-authorized" />}
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
              element={isAuthenticated()? <CreateUser /> : <Navigate to="/attendance" />}
            /> */}

       
            <Route path="*" element={<Navigate to="/attendance" />} />
          </Routes>
  );
};

export default RoutesConfig;