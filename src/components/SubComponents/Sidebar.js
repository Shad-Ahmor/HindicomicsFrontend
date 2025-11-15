import React, { useMemo, useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Divider,
  Avatar,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import MuiDrawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { handleLogout } from "../AuthHandler.js";
import MenuBar from "./Menubar.js";
import { decryptData } from "../Security/cryptoUtils.js";

const drawerWidth = 250;

// Drawer styles
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  background: "linear-gradient(145deg, #f7f7f7, #ffffff)",
  color: "#333",
  boxShadow:
    "4px 4px 10px rgba(0,0,0,0.1), -4px -4px 10px rgba(255,255,255,0.7)",
  borderRight: "1px solid #eee",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  background: "linear-gradient(145deg, #f8f8f8, #ffffff)",
  color: "#333",
  boxShadow:
    "inset 3px 3px 6px rgba(0,0,0,0.05), inset -3px -3px 6px rgba(255,255,255,0.8)",
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1.5, 2),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

// --------------------------------------------------
// 🧠 SIDEBAR COMPONENT
// --------------------------------------------------
const Sidebar = ({
  Setuserimg,
  open,
  handleDrawerClose,
  isLoggedIn,
  setIsLoggedIn,
  setRole,
  setError,
  setSuccess,
  setLoading,
  history,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [permissions, setPermissions] = useState([]); // unified permission keys
  const [userProfile, setUserProfile] = useState({ name: "", role: "" });

  // ---------------- Token & Decryption ----------------
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  const decryptedUser = useMemo(() => {
    const uid = decryptData(localStorage.getItem("uid"));
    const name = decryptData(localStorage.getItem("name"));
    const role = decryptData(localStorage.getItem("role"));
    const subrole = decryptData(localStorage.getItem("subrole"));
    const course = decryptData(localStorage.getItem("course"));
    const department = decryptData(localStorage.getItem("department"));
    const team = decryptData(localStorage.getItem("team"));
    const profileImg = decryptData(localStorage.getItem("profileabc"));
    return { uid, name, role, subrole, course, department, team, profileImg };
  }, []);

  useEffect(() => {
    if (Setuserimg && decryptedUser.profileImg) {
      Setuserimg(decryptedUser.profileImg);
    }
  }, [Setuserimg, decryptedUser.profileImg]);

  // ---------------- User Info ----------------
  useEffect(() => {
    if (token && decryptedUser.role) {
      setIsLoggedIn(true);
      setRole(decryptedUser.role);
      setUserProfile({
        name: decryptedUser.name?.toUpperCase() || "USER",
        role: decryptedUser.role?.toUpperCase() || "ROLE",
      });
    }
  }, [token, decryptedUser, setIsLoggedIn, setRole]);

  // ---------------- Fetch Combined Permissions ----------------
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        if (!token || !decryptedUser.uid || !decryptedUser.role) return;

        const res = await axios.post(
          "http://localhost:5000/api/permission-summary",
          {
            uid: decryptedUser.uid,
            role: decryptedUser.role,
            department: decryptedUser.department,
            team: decryptedUser.team,
          },
          { headers }
        );

        setPermissions(res.data.permissions || []);
      } catch (error) {
        console.error("❌ Error fetching combined permissions:", error);
      }
    };
    fetchPermissions();
  }, [headers, token, decryptedUser]);

  // ---------------- Permission Check ----------------
  const hasPermission = useCallback(
    (baseurl, url, method) => {
      if (!Array.isArray(permissions)) return false;
      const key = `${baseurl || ""}${url || ""}:${(method || "GET").toUpperCase()}`;
      return permissions.includes(key);
    },
    [permissions]
  );

  // ---------------- Navigation ----------------
  const handleNavigate = useCallback(
    (route) => {
      navigate(route);
      handleDrawerClose?.();
    },
    [navigate, handleDrawerClose]
  );

  const handleLoginButtonClick = useCallback(
    () => navigate("/login"),
    [navigate]
  );

  const handleLogoutButtonClick = useCallback(() => {
    handleLogout(setIsLoggedIn, navigate, setError, setSuccess, setLoading, history);
  }, [setIsLoggedIn, navigate, setError, setSuccess, setLoading, history]);

  const currentUser = {
    id: decryptedUser.uid,
    name: decryptedUser.name,
    role: decryptedUser.role,
    subrole: decryptedUser.subrole,
    course: decryptedUser.course,
    department: decryptedUser.department,
    team: decryptedUser.team,
  };

  // --------------------------------------------------
  // ✅ RENDER SIDEBAR (PERMANENT)
  // --------------------------------------------------
  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        {open && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              src={decryptedUser.profileImg}
              alt="User"
              sx={{
                width: 46,
                height: 46,
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                border: "2px solid #fff",
              }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#222", letterSpacing: 0.5 }}
              >
                {userProfile.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "#777" }}>
                {userProfile.role}
              </Typography>
            </Box>
          </Box>
        )}

        <Tooltip title="Close Sidebar">
          <IconButton
            onClick={handleDrawerClose}
            sx={{
              color: "#666",
              backgroundColor: "#fff",
              boxShadow:
                "2px 2px 6px rgba(0,0,0,0.1), -2px -2px 6px rgba(255,255,255,0.6)",
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </Tooltip>
      </DrawerHeader>

      <Divider sx={{ borderColor: "#eee" }} />

      <MenuBar
        open={open}
        handleNavigate={handleNavigate}
        hasPermission={hasPermission} // single unified check
        isLoggedIn={isLoggedIn}
        handleLoginButtonClick={handleLoginButtonClick}
        handleLogoutButtonClick={handleLogoutButtonClick}
        currentUser={currentUser}
        permissions={permissions}
      />
    </Drawer>
  );
};

export default Sidebar;
