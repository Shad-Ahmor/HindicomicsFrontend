import React, { useState,useEffect } from 'react';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import QuizIcon from '@mui/icons-material/Quiz';
import ShareIcon from '@mui/icons-material/Share';
import FeedbackIcon from '@mui/icons-material/Feedback';
import RedeemIcon from '@mui/icons-material/Redeem';
import TimelineIcon from '@mui/icons-material/Timeline';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Assignment, AssignmentInd, AssignmentReturn, AssignmentTurnedIn, Create, ExpandLess, ExpandMore, LocalLibrary, StarBorder } from '@mui/icons-material';
import {
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  LibraryBooks,
  VerifiedUserSharp,
  SignpostOutlined
} from '@mui/icons-material';
import { List, ListItem, ListItemText, ListItemIcon, Collapse,ListItemButton  } from '@mui/material'; // Import Drawer components

import {  History } from '@mui/icons-material'; // Import History icon

export default function Menubar( {decryptsubrole,open,handleNavigate, hasPermission, isLoggedIn,handleLoginButtonClick, handleLogoutButtonClick}) {

  const [openAssignment, setOpenAssignment] = useState(false); // State to control dropdown
  useEffect(() => {
    if (!open) {
      setOpenAssignment(false); // Close assignment dropdown when the parent menu opens
    }
  }, [open]); 
  const handleAssignmentClick = () => {
    setOpenAssignment(!openAssignment); // Toggle dropdown on click
  };
  const showReferred = Array.isArray(decryptsubrole)
  ? decryptsubrole.includes('smm')  // Case when it's already an array
  : (typeof decryptsubrole === 'string' && decryptsubrole.split(',').includes('smm'));  // Case when it's a string

  return (
    <div>
      <List>

   

  <ListItem>
    <ListItemButton onClick={() => handleNavigate('/')}>
       <ListItemIcon
                  ><DashboardIcon sx={{ color: 'gray' }} /></ListItemIcon>
       <ListItemText
               
                 primary="Dashboard" />
    </ListItemButton>
  </ListItem>




   {/* Assignment  */}

   <ListItem>
        <ListItemButton onClick={handleAssignmentClick}>
        <ListItemIcon>
          <Assignment />
        </ListItemIcon>
        <ListItemText primary="Assignment" />
        {openAssignment ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      </ListItem>
      
      <Collapse in={openAssignment} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
        {hasPermission('/assignments', '/createdassignments', 'GET') && (

        <ListItemButton sx={{ pl: 4, pt:2 }} button onClick={() => handleNavigate('/assign-task')}>
        <AssignmentInd sx={{ color: 'gray' }}  />
                <ListItemText  sx={{ pl: 2 }} primary="Create Assignment" />
              </ListItemButton>
            )}

              {hasPermission('/assignments', '/assignedtasks', 'GET') && (

              <ListItemButton sx={{ pl: 4, pt:2 }} button onClick={() => handleNavigate('/submit-task')}>
              <LocalLibrary sx={{ color: 'gray' }} />
                <ListItemText sx={{ pl: 2 }} primary="Submit Assignment" />
              </ListItemButton>
            )}

              {hasPermission('/assignments', '/assignmentapproval', 'GET') && (
              <ListItemButton sx={{ pl: 4, pt:2 }} button onClick={() => handleNavigate('/review-submission')}>
              <AssignmentReturn sx={{ color: 'gray' }} />
                <ListItemText sx={{ pl: 2 }} primary="Manager Review" />
              </ListItemButton>
            )}

              {hasPermission('/assignments', '/finalsubmission', 'GET') && (
              <ListItemButton sx={{ pl: 4, pt:2 }} button onClick={() => handleNavigate('/final-review')}>
              <AssignmentTurnedIn sx={{ color: 'gray' }} />
                <ListItemText sx={{ pl: 2 }} primary="Admin Review" />
              </ListItemButton>
            )}

        </List>
      </Collapse>
      <>
      {showReferred && (
        <ListItem>
          <ListItemButton onClick={() => handleNavigate('/referal')}>
            <ListItemIcon>
              <ShareIcon sx={{ color: 'gray' }} />
            </ListItemIcon>
            <ListItemText primary="Referred" />
          </ListItemButton>
        </ListItem>
      )}
    </>

{hasPermission('/course-selection', '/', 'GET') && (
          <ListItem>
            <ListItemButton onClick={() => handleNavigate('/course-selection')}>
               <ListItemIcon
                  >    <AccountBalanceIcon sx={{ color: 'gray' }} />
              </ListItemIcon>
               <ListItemText
                  
                 primary="Course Selection" />
            </ListItemButton>
          </ListItem>
        )}

{hasPermission('/coupons', '/', 'GET') && (
  <ListItem>
  <ListItemButton onClick={() => handleNavigate('/coupons')}>
     <ListItemIcon
                  ><RedeemIcon sx={{ color: 'gray' }} /></ListItemIcon>
     <ListItemText
                  
                 primary="Coupons" />
  </ListItemButton>
</ListItem>
    )}

{hasPermission('/jokes', '/', 'POST') && (
  <ListItem>
    <ListItemButton onClick={() => handleNavigate('/jokes')}>
       <ListItemIcon
                  ><TheaterComedyIcon sx={{ color: 'gray' }} /></ListItemIcon>
       <ListItemText
                  
                 primary="Jokes" />
    </ListItemButton>
  </ListItem> 
)}

{hasPermission('/help', '/', 'POST') && (
  <ListItem>
    <ListItemButton onClick={() => handleNavigate('/help')}>
       <ListItemIcon
                  ><QuizIcon  sx={{ color: 'gray' }} /></ListItemIcon>
       <ListItemText
                  
                 primary="Help" />
    </ListItemButton>
  </ListItem> 

)}
{hasPermission('/suggestions', '/', 'GET') && (

  <ListItem>
  <ListItemButton onClick={() => handleNavigate('/suggestions')}>
     <ListItemIcon
                  ><FeedbackIcon sx={{ color: 'gray' }} /></ListItemIcon>
     <ListItemText
                  
                 primary="Suggestions" />
  </ListItemButton>
</ListItem>
)}
{hasPermission('/admob', '/', 'POST') && (
  <ListItem>
    <ListItemButton onClick={() => handleNavigate('/admob')}>
       <ListItemIcon
                  ><AdsClickIcon  sx={{ color: 'gray' }} /></ListItemIcon>
       <ListItemText
                  
                 primary="Admob" />
    </ListItemButton>
  </ListItem> 
)}
  <ListItem>
    <ListItemButton onClick={() => handleNavigate('/createuser')}>
       <ListItemIcon
                  ><SignpostOutlined sx={{ color: 'gray' }} /></ListItemIcon>
       <ListItemText
                  
                 primary="Create User" />
    </ListItemButton>
  </ListItem>
  {hasPermission('/userlogs', '/', 'GET') && (

  <ListItem>
  <ListItemButton onClick={() => handleNavigate('/userlogs')}>
     <ListItemIcon
                  ><TimelineIcon sx={{ color: 'gray' }} /></ListItemIcon>
     <ListItemText
                  
                 primary="User Logs" />
  </ListItemButton>
</ListItem>
  )}
  {hasPermission('/comics', '/', 'POST') && (

  <ListItem>
    <ListItemButton onClick={() => handleNavigate('/comic')}>
       <ListItemIcon
                  ><LibraryBooks sx={{ color: 'gray' }} /></ListItemIcon>
       <ListItemText
                  
                 primary="Comics/Books" />
    </ListItemButton>
  </ListItem>
)}
{hasPermission('/users', '/', 'GET') && (
  <ListItem>
    <ListItemButton onClick={() => handleNavigate('/user')}>
       <ListItemIcon
                  ><VerifiedUserSharp sx={{ color: 'gray' }} /></ListItemIcon>
       <ListItemText
                  
                 primary="Users" />
    </ListItemButton>
  </ListItem>
)}
{hasPermission('/useractivity', '/', 'POST') && (
  <ListItem>
  <ListItemButton onClick={() => handleNavigate('/activitytrack')}>
       <ListItemIcon
                  ><History sx={{ color: 'gray' }} /></ListItemIcon>
       <ListItemText
                  
                 primary="Attendance" />
    </ListItemButton>
  </ListItem>

  )}
    
  {isLoggedIn ? (
    <ListItem>
      <ListItemButton onClick={handleLogoutButtonClick}>
         <ListItemIcon
                  ><LogoutIcon sx={{ color: 'gray' }} /></ListItemIcon>
         <ListItemText
                  
                 primary="Logout" />
      </ListItemButton>
    </ListItem>
  ) : (
    <ListItem>
    <ListItemButton onClick={() => handleLoginButtonClick}>
     <ListItemIcon
                  ><LoginIcon sx={{ color: 'gray' }} /></ListItemIcon>
         <ListItemText
                  
                 primary="Login" />
      </ListItemButton>
    </ListItem>
  )}
</List>

    </div>
  )
}
