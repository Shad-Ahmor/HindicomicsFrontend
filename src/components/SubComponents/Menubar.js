import React, { useState,useEffect } from 'react';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import QuizIcon from '@mui/icons-material/Quiz';
import ShareIcon from '@mui/icons-material/Share';
import FeedbackIcon from '@mui/icons-material/Feedback';
import RedeemIcon from '@mui/icons-material/Redeem';
import TimelineIcon from '@mui/icons-material/Timeline';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FunctionsIcon from '@mui/icons-material/Functions';          // Method
import ExtensionIcon from '@mui/icons-material/Extension';          // Module
import ApartmentIcon from '@mui/icons-material/Apartment';          // Entity/Project
import SecurityIcon from '@mui/icons-material/Security';            // RBAC Permission
import PolicyIcon from '@mui/icons-material/Policy';  
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'; 
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import Person2Icon from '@mui/icons-material/Person2';
import { Add, Assignment, AssignmentInd,AssignmentReturn, Work as WorkIcon ,AccountCircle as AccountCircleIcon ,AssignmentTurnedIn, ExpandLess, ExpandMore, LocalLibrary, WorkspacePremium } from '@mui/icons-material';
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
import TableViewIcon from '@mui/icons-material/TableView';
export default function Menubar({
  coursesdec,
  decryptroles,
  decryptsubrole,
  open,
  handleNavigate,
  hasPermission, // unified permission checker
  isLoggedIn,
  handleLoginButtonClick,
  handleLogoutButtonClick,
  
  permissions, // unified permissions array
}) {



  const [openAssignment, setOpenAssignment] = useState(false); // State to control dropdown
    const [openEntity, setOpenEntity] = useState(false); // State to control dropdown

  const [openCourses, setOpenCourses] = useState(false); // State to control dropdown
  const [openPermission,setOpenPermission]= useState(false); 
// Universal permission checker (RBAC + UBAC + ABAC)


// ✅ Normalize role and subrole into arrays to avoid .includes() errors
const rolesArray = Array.isArray(decryptroles)
  ? decryptroles
  : typeof decryptroles === "string"
  ? decryptroles.split(",").map(r => r.trim().toLowerCase())
  : [];

const subrolesArray = Array.isArray(decryptsubrole)
  ? decryptsubrole
  : typeof decryptsubrole === "string"
  ? decryptsubrole.split(",").map(r => r.trim().toLowerCase())
  : [];
const checkSuperAccess = (base, url, method) => {
  const safeBase = typeof base === "string" ? base : "";
  const safeUrl = typeof url === "string" ? url : "";
  const safeMethod = typeof method === "string" ? method : "GET";

  const key = `${safeBase}${safeUrl}:${safeMethod.toUpperCase()}`;

  // ✅ Use unified hasPermission or fallback to direct check
  if (typeof hasPermission === "function") {
    return hasPermission(safeBase, safeUrl, safeMethod);
  }

  return Array.isArray(permissions) && permissions.includes(key);
};

  useEffect(() => {
    if (!open) {
      setOpenAssignment(false);
      setOpenEntity(false);
      setOpenCourses(false) // Close assignment dropdown when the parent menu opens
      setOpenPermission(false)
    }

  }, [open]); 

    const handleAssignmentClick = () => setOpenAssignment(!openAssignment);
  const handlEntityClick = () => setOpenEntity(!openEntity);
  const handleCourcesClick = () => setOpenCourses(!openCourses);
  const handlePermissionClick = () => setOpenPermission(!openPermission);



  const showWebops = subrolesArray.includes("webops") || rolesArray.includes("admin");


  const showOnlyIntern = rolesArray.includes("intern");


  const hasAnyPermissionAccess = () => {
  const endpoints = [
    { base: "/rolemethod", url: "/get-modules" },
    { base: "/rolemethod", url: "/get-roles" },
    { base: "/rolemethod", url: "/get-methods" },
    { base: "/rolemethod", url: "/get-positions" },
  ];

  return endpoints.some(ep => checkSuperAccess(ep.base, ep.url, "GET"));
};
const iconColors = [
    "#FF6B6B",
    "#6BCB77",
    "#4D96FF",
    "#F7B32B",
    "#9D4EDD",
    "#FF914D",
    "#3CCF4E",
  ];

  const randomColor = () =>
    iconColors[Math.floor(Math.random() * iconColors.length)];
  const iconBox = (IconComponent) => (
    <IconComponent sx={{ color: randomColor(), fontSize: 24 }} />
  );



  return (
    <div>
      <List>

   
      {checkSuperAccess("/auth", "/attendance-summary", "GET",   ) && (



    <ListItem>
      <ListItemButton onClick={() => handleNavigate('/interndashboard')}>
        <ListItemIcon>{iconBox(DashboardIcon )}</ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
    </ListItem>
      )}

    {checkSuperAccess("/dashboard", "/role-counts", "GET",   ) && (


      <ListItem>
        <ListItemButton onClick={() => handleNavigate('/dashboard')}>
          <ListItemIcon>{iconBox(DashboardIcon )}</ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </ListItem>
    )}


      {checkSuperAccess("/auth", "/attendance", "GET",   ) && (
          <ListItem>
            <ListItemButton onClick={() => handleNavigate('/attendance')}>
              <ListItemIcon>{iconBox(CalendarMonthIcon  )}</ListItemIcon>
              <ListItemText
                      
                        primary="Attendance" />
            </ListItemButton>
          </ListItem>
      )}

      {checkSuperAccess("/auth", "/profile/password", "PUT",   ) && (
          <ListItem>
            <ListItemButton onClick={() => handleNavigate('/passwordchange')}>
              <ListItemIcon>{iconBox(LockOpenIcon )}</ListItemIcon>
              <ListItemText
                      
                        primary="Change Password" />
            </ListItemButton>
          </ListItem>
      )}

      {checkSuperAccess("/rolemethod", "/organisation", "GET",   ) && (
        <ListItem>
              <ListItemButton onClick={handlEntityClick}>
              <ListItemIcon>{iconBox(BusinessCenterIcon)}
              </ListItemIcon>
              <ListItemText primary="Organisation" />
              {openEntity ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
      )}


    <Collapse in={openEntity} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {/* Hierarchy Menu Item */}
        {checkSuperAccess("/hierarchy", "/", "GET",   ) && (
  
            <ListItemButton sx={{ pl: 6, pt: 2 }} onClick={() => handleNavigate('/entity/hierarchy')}>
              <ListItemIcon>
                <AccountTreeIcon />
              </ListItemIcon>
              <ListItemText primary="Hierarchy" />
            </ListItemButton>
            )}
            {checkSuperAccess("/rolemethod", "/organisation", "GET",   ) && (

           <ListItemButton sx={{ pl: 6, pt: 2 }} onClick={() => handleNavigate('/profile')}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
            )}

     
  
      </List>
    </Collapse>


   {/* Assignment  */}
{checkSuperAccess(
              "/assignments",
              "/assignedtasks",
              "GET",
              ) && (
   <ListItem>
        <ListItemButton onClick={handleAssignmentClick}>
        <ListItemIcon>{iconBox(Assignment)}
        </ListItemIcon>
        <ListItemText primary="Assignment" />
        {openAssignment ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      </ListItem>
            )}
      
      <Collapse in={openAssignment} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* Upgrade Plan - Intern Only */}
            {checkSuperAccess(
              "/assignments",
              "/results",
              "GET",
              
              
              
            ) && (
              <>
                {showOnlyIntern && (
                  <ListItemButton sx={{ pt: 2 }} onClick={() => handleNavigate("/plans")}>
                    <ListItemIcon>{iconBox(TableViewIcon)}</ListItemIcon>
                    <ListItemText primary="Upgrade/Choose Plan" />
                  </ListItemButton>
                )}
              </>
            )}

            {/* Create Assignment */}
            {checkSuperAccess(
              "/assignments",
              "/createdassignments",
              "GET",
              
              
              
            ) && (
              <ListItemButton
                sx={{ pl: 6, pt: 2 }}
                onClick={() => handleNavigate("/assign-task")}
              >
                <ListItemIcon>{iconBox(AssignmentInd)}</ListItemIcon>
                <ListItemText primary="Create Assignment" />
              </ListItemButton>
            )}

            {/* Submit Assignment */}
            {checkSuperAccess(
              "/assignments",
              "/assignedtasks",
              "GET",
              
              
              
            ) && (
              <ListItemButton
                sx={{ pl: 6, pt: 2 }}
                onClick={() => handleNavigate("/submit-task")}
              >
                <ListItemIcon>{iconBox(LocalLibrary)}</ListItemIcon>
                <ListItemText primary="Submit Assignment" />
              </ListItemButton>
            )}

            {/* Manager Review */}
            {checkSuperAccess(
              "/assignments",
              "/assignmentapproval",
              "GET",
              
              
              
            ) && (
              <ListItemButton
                sx={{ pl: 6, pt: 2 }}
                onClick={() => handleNavigate("/review-submission")}
              >
                <ListItemIcon>{iconBox(AssignmentReturn)}</ListItemIcon>
                <ListItemText primary="Manager Review" />
              </ListItemButton>
            )}

            {/* Admin Review */}
            {checkSuperAccess(
              "/assignments",
              "/finalsubmission",
              "GET",
              
              
              
            ) && (
              <ListItemButton
                sx={{ pl: 6, pt: 2 }}
                onClick={() => handleNavigate("/final-review")}
              >
                <ListItemIcon>{iconBox(AssignmentTurnedIn)}</ListItemIcon>
                <ListItemText primary="Admin Review" />
              </ListItemButton>
            )}

            {/* Assignment Results */}
            {checkSuperAccess(
              "/assignments",
              "/results",
              "GET",
              
              
              
            ) && (
              <ListItemButton
                sx={{ pl: 6, pt: 2 }}
                onClick={() => handleNavigate("/assignmentresult")}
              >
                <ListItemIcon>{iconBox(WorkspacePremium)}</ListItemIcon>
                <ListItemText primary="Assignment Results" />
              </ListItemButton>
            )}
      {checkSuperAccess("/users", "/me", "GET",   ) && (
               <>
              <ListItemButton sx={{ pl: 6, pt: 2 }} onClick={() => handleNavigate('/certificate')}>
                <ListItemIcon>{iconBox(CardMembershipIcon )}</ListItemIcon>
                <ListItemText primary="Certificate" />
              </ListItemButton>

              <ListItemButton sx={{ pl: 6, pt: 2 }} onClick={() => handleNavigate('/resume')}>
                <ListItemIcon>{iconBox(DocumentScannerIcon )}</ListItemIcon>
                <ListItemText primary="Resume" />
              </ListItemButton>
              </>
      )}
   
          </List>
    </Collapse>

     

              {checkSuperAccess("/users", "/referred", "GET") && (
        <ListItem>
          <ListItemButton onClick={() => handleNavigate('/referal')}>
            <ListItemIcon>
              <ListItemIcon>{iconBox(ShareIcon )}</ListItemIcon>
            </ListItemIcon>
            <ListItemText primary="Referred" />
          </ListItemButton>
        </ListItem>
      )}

   {/* Course  */}
            {hasAnyPermissionAccess()  && (
          <ListItem>
                  <ListItemButton onClick={handlePermissionClick}>
                    <ListItemIcon>{iconBox( AccountBalanceIcon )}</ListItemIcon>
                    <ListItemText
                        
                      primary="Permissions" />
                      {openPermission ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          </ListItem>
            )}
       <Collapse in={openPermission} timeout="auto" unmountOnExit>
    
          <List component="div" disablePadding>
              {checkSuperAccess("/rolemethod", "/get-methods", "GET") && (
                <ListItemButton sx={{ pl: 6, pt: 2 }} onClick={() => handleNavigate('/method')}>
                  <ListItemIcon>{iconBox(FunctionsIcon)}</ListItemIcon>
                  <ListItemText primary="Method" />
                </ListItemButton>
              )}

              {checkSuperAccess("/rolemethod", "/get-modules", "GET") && (
                    <ListItemButton sx={{ pl: 6, pt: 2 }} onClick={() => handleNavigate('/module')}>
                      <ListItemIcon>{iconBox(ExtensionIcon)}</ListItemIcon>
                      <ListItemText primary="Module" />
                    </ListItemButton>
                  )}
              {checkSuperAccess("/rolemethod", "/get-positions", "GET") && (
                    <ListItemButton sx={{ pl: 6, pt: 2 }} onClick={() => handleNavigate('/position')}>
                      <ListItemIcon>{iconBox(WorkIcon)}</ListItemIcon>
                      <ListItemText primary="Position" />
                    </ListItemButton>
                  )}
                    <ListItemButton sx={{ pl: 6, pt: 2 }} onClick={() => handleNavigate('/entity')}>
                      <ListItemIcon>{iconBox(ApartmentIcon)}</ListItemIcon>
                      <ListItemText primary="Entity / Project" />
                    </ListItemButton>

                    <ListItemButton sx={{ pl: 6, pt: 2 }} onClick={() => handleNavigate('/permission')}>
                      <ListItemIcon>{iconBox(SecurityIcon )} </ListItemIcon>
                      <ListItemText primary="RBAC Permission" />
                    </ListItemButton>

                    <ListItemButton sx={{ pl: 6, pt: 2 }} onClick={() => handleNavigate('/abacpermission')}>
                      <ListItemIcon>{iconBox(PolicyIcon )} </ListItemIcon>
                      <ListItemText  primary="ABAC Permission" />
                    </ListItemButton>

                    <ListItemButton sx={{ pl: 6, pt: 2 }} onClick={() => handleNavigate('/ubacpermission')}>
                      <ListItemIcon>{iconBox(Person2Icon )} </ListItemIcon>
                      <ListItemText  primary="UBAC Permission" />
                    </ListItemButton>
            {checkSuperAccess("/auth", "/createuser", "POST") && (
                <ListItemButton sx={{ pl: 6, pt: 2 }} onClick={() => handleNavigate('/createuser')}>
                  <ListItemIcon>{iconBox(SignpostOutlined )}</ListItemIcon>
                  <ListItemText primary="Create User" />
                </ListItemButton>
            )}

        </List>
      </Collapse>


                {checkSuperAccess("/courses", "/", "GET") && (
                    <ListItem>
                      <ListItemButton  onClick={handleCourcesClick}>
                        <ListItemIcon>{iconBox( AccountBalanceIcon )}</ListItemIcon>
                        <ListItemText
                            
                          primary="Courses" />
                          {openCourses ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                    </ListItem>
                  )}
              <Collapse in={openCourses} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>

                            {checkSuperAccess("/courses", "/select", "POST") && (
                              <ListItemButton sx={{ pl: 6, pt: 2 }}  button onClick={() => handleNavigate('/addcourse')}>
                              <ListItemIcon>{iconBox(Add )}</ListItemIcon>
                                <ListItemText  primary="Add Course" />
                              </ListItemButton>
                            )}
                            {checkSuperAccess("/courses", "/", "GET") && (
                              <ListItemButton sx={{ pl: 6, pt: 2 }}  button onClick={() => handleNavigate('/course-selection')}>
                              <ListItemIcon>{iconBox(LocalLibrary )}</ListItemIcon>
                                    <ListItemText   primary="Select Course" />
                                  </ListItemButton>
                                )}

                    </List>
              </Collapse>



        {/* ✅ Coupons */}
        {checkSuperAccess(
          "/coupons",
          "/",
          "GET",
          
          
          
        ) && (
          <ListItem>
            <ListItemButton onClick={() => handleNavigate("/coupons")}>
              <ListItemIcon>{iconBox(RedeemIcon)}</ListItemIcon>
              <ListItemText primary="Coupons" />
            </ListItemButton>
          </ListItem>
        )}





        {checkSuperAccess(
  "/jokes",
  "?database=jokes",
  "GET",
  
  
  
) && (
  <ListItem>
    <ListItemButton onClick={() => handleNavigate("/jokes")}>
      <ListItemIcon>{iconBox(TheaterComedyIcon)}</ListItemIcon>
      <ListItemText primary="Jokes" />
    </ListItemButton>
  </ListItem>
)}



        {/* ✅ Help */}
        {checkSuperAccess(
          "/help",
          "/",
          "POST",
          
          
          
        ) && (
          <ListItem>
            <ListItemButton onClick={() => handleNavigate("/help")}>
              <ListItemIcon>{iconBox(QuizIcon)}</ListItemIcon>
              <ListItemText primary="Help" />
            </ListItemButton>
          </ListItem>
        )}

        {/* ✅ Suggestions */}
        {checkSuperAccess(
          "/suggestions",
          "/",
          "GET",
          
          
          
        ) && (
          <ListItem>
            <ListItemButton onClick={() => handleNavigate("/suggestions")}>
              <ListItemIcon>{iconBox(FeedbackIcon)}</ListItemIcon>
              <ListItemText primary="Suggestions" />
            </ListItemButton>
          </ListItem>
        )}

        {/* ✅ Admob */}
        {checkSuperAccess(
          "/admob",
          "/",
          "POST",
          
          
          
        ) && (
          <ListItem>
            <ListItemButton onClick={() => handleNavigate("/admob")}>
              <ListItemIcon>{iconBox(AdsClickIcon)}</ListItemIcon>
              <ListItemText primary="Admob" />
            </ListItemButton>
          </ListItem>
        )}

          {/* ✅ User Logs */}
      {checkSuperAccess(
        "/userlogs",
        "/",
        "GET",
        
        
        
      ) && (
        <ListItem>
          <ListItemButton onClick={() => handleNavigate("/userlogs")}>
            <ListItemIcon>{iconBox(TimelineIcon)}</ListItemIcon>
            <ListItemText primary="User Logs" />
          </ListItemButton>
        </ListItem>
      )}

      {/* ✅ Comics / Books */}
      {checkSuperAccess(
        "/comics",
        "/",
        "POST",
        
        
        
      ) && (
        <>
          {showWebops && (
            <ListItem>
              <ListItemButton onClick={() => handleNavigate("/comic")}>
                <ListItemIcon>{iconBox(LibraryBooks)}</ListItemIcon>
                <ListItemText primary="Comics/Books" />
              </ListItemButton>
            </ListItem>
          )}
        </>
      )}

      {/* ✅ Users */}
      {checkSuperAccess(
        "/users",
        "/",
        "GET",
        
        
        
      ) && (
        <ListItem>
          <ListItemButton onClick={() => handleNavigate("/user")}>
            <ListItemIcon>{iconBox(VerifiedUserSharp)}</ListItemIcon>
            <ListItemText primary="Users" />
          </ListItemButton>
        </ListItem>
      )}

      {/* ✅ Attendance / User Activity */}
      {checkSuperAccess(
        "/useractivity",
        "/",
        "POST",
        
        
        
      ) && (
        <ListItem>
          <ListItemButton onClick={() => handleNavigate("/activitytrack")}>
            <ListItemIcon>{iconBox(History)}</ListItemIcon>
            <ListItemText primary="Attendance" />
          </ListItemButton>
        </ListItem>
      )}


  {isLoggedIn ? (
    <ListItem>
      <ListItemButton onClick={handleLogoutButtonClick}>
         <ListItemIcon>{iconBox(LogoutIcon )}</ListItemIcon>
         <ListItemText
                  
                 primary="Logout" />
      </ListItemButton>
    </ListItem>
  ) : (
    <ListItem>
    <ListItemButton onClick={() => handleLoginButtonClick}>
     <ListItemIcon>{iconBox(LoginIcon )}</ListItemIcon>
         <ListItemText
                  
                 primary="Login" />
      </ListItemButton>
    </ListItem>
  )}
</List>

    </div>
  )
}
