import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useEffect, useState } from 'react';


export default  function Row(props) {
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