import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Row(props) {
  const { row, isParent } = props;  // Add isParent flag to distinguish parent rows from child rows
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow >
        <TableCell>
          {isParent && (
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.email}
        </TableCell>
        <TableCell align="right">{row.points}</TableCell>
        <TableCell align="right">{row.role}</TableCell>
        <TableCell align="right">{row.referred ? 'Yes' : 'No'}</TableCell>
      </TableRow>
      {isParent && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Referred Users
                </Typography>
                <Table size="small" aria-label="referred users">
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell align="right">Points</TableCell>
                      <TableCell align="right">Role</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.referredUsers?.map((referredUser) => (
                      <TableRow key={referredUser.uid}>
                        <TableCell>{referredUser.email}</TableCell>
                        <TableCell align="right">{referredUser.points}</TableCell>
                        <TableCell align="right">{referredUser.role}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    email: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
    role: PropTypes.string.isRequired,
    referred: PropTypes.bool.isRequired,
    referredUsers: PropTypes.array,  // List of referred users
  }).isRequired,
  isParent: PropTypes.bool.isRequired,  // Flag to distinguish parent rows from child rows
};

export default function CollapsibleTable() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [referredUsers, setReferredUsers] = useState([]); // Default as an empty array
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found.');
      navigate('/');  // Redirect to login if no token exists
      return;
    }

    axios.get('https://hindicomicsbackend.onrender.comusers/referred', {
      headers: {
        Authorization: `Bearer ${token}`, // Only token in the Authorization header
      },
    }).then((response) => {
      const { loggedInUser: user } = response.data;
      const users = user?.referredUsers || []; // Access referredUsers inside loggedInUser
      setLoggedInUser(user);  // Set logged-in user's details
      setReferredUsers(users); // Set referredUsers array
    }).catch((error) => console.error('Error fetching referred user data:', error));
  }, [navigate]);

  if (!loggedInUser) {
    return <div>Loading...</div>;  // Show loading if loggedInUser is not set yet
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        padding: 2,  // Added padding around the content for better spacing
      }}
    >
      <TableContainer component={Paper} sx={{ width: "100%",margin:"20vw",maxWidth: 1600 }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Email</TableCell>
              <TableCell align="right">Points</TableCell>
              <TableCell align="right">Role</TableCell>
              <TableCell align="right">Referred</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Render logged-in user as the parent row */}
            <Row key={loggedInUser.uid} row={loggedInUser} isParent={true} />
        
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
