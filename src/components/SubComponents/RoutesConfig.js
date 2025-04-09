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


const RoutesConfig = ({  setIsLoggedIn, isLoggedIn, history,token, settoken,setRole,role,setUserId,userId, element, ...rest}) => {

  const isAuthenticated = () => {

    return !! localStorage.getItem('token') // Check if token exists
  };
  // setRole(localStorage.getItem('role'))

  return (
    <Routes>
                <Route component={NotFound} /> {/* Catch-all route for 404 */}

            {/* <Route path="/" element={<Navigate to="/" />} /> */}
            <Route path="/login" element={!isAuthenticated() ? <Login settoken={settoken} setIsLoggedIn={setIsLoggedIn} setRole={setRole} setUserId={setUserId} /> : <Navigate to="/" />}  />
            <Route path="*" element={<Navigate to="/" />} />

          <Route
              path="/profile"
              element={isAuthenticated() ? <CompanyHierarchy  />
              : <Navigate to="/" />}
            />

        <Route
              path="/attendance"
              element={isAuthenticated() ? <Attendance  />
              : <Navigate to="/" />}
            />
          <Route
              path="/referal"
              element={isAuthenticated() ? <Referal  />
              : <Navigate to="/" />}
            />
            <Route
              path="/"
              element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />}
            />
              <Route path="/category/:category" element={isAuthenticated() ? <CategoryDetail  />: <Navigate to="/" />} />

              <Route
              path="/createuser"
              element={isAuthenticated() ? <Signup /> : <Navigate to="/" />}
            />
                <Route
              path="/permission"
              element={isAuthenticated() ? <PermissionManagement /> : <Navigate to="/" />}
            />
                 <Route
              path="/passwordchange"
              element={isAuthenticated() ? <ChangePassword /> : <Navigate to="/" />}
            />
        
            <Route
  path="/userlogs"
  element={isAuthenticated() ? <UserLogs /> : <Navigate to="/" />}
/>
            <Route
              path="/coupons"
              element={isAuthenticated() ? <CouponPage /> : <Navigate to="/" />}
            />
              <Route
              path="/activitytrack"
              element={isAuthenticated() ? <ActivityTracker /> : <Navigate to="/" />}
            />
            <Route
              path="/jokes"
              element={isAuthenticated() ? <JokeList /> : <Navigate to="/" />}
            />
              <Route
              path="/comic"
              element={isAuthenticated() ? <Comics role={role} userId={userId} /> : <Navigate to="/" />}
            />
                <Route
              path="/admob"
              element={isAuthenticated() ? <AdmobPage role={role} userId={userId} /> : <Navigate to="/" />}
            />
                   <Route
              path="/help"
              element={isAuthenticated() ? <Help role={role} userId={userId} /> : <Navigate to="/" />}
            />
            <Route
            path="/suggestions"
            element={isAuthenticated() ? <SuggestionsPage /> : <Navigate to="/" />}
          />
             <Route
              path="/user"
              element={isAuthenticated() ? <Users role={role} userId={userId} /> : <Navigate to="/" />}
            />
   {/* Add Course Selection Route */}
   <Route path="/course-selection" element={isAuthenticated() ? <CourseSelectionPage /> : <Navigate to="/" />} />
   <Route path="/course/:courseId" element={isAuthenticated() ? <SelectedCourse /> : <Navigate to="/" />} />
   <Route path="/addcourse" element={isAuthenticated() ? <AddCourse /> : <Navigate to="/" />} />

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
              element={isAuthenticated()? <CreateUser /> : <Navigate to="/" />}
            /> */}

       
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
  );
};

export default RoutesConfig;