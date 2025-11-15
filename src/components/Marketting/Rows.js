import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

export default function Row({ row, isParent }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🔹 Parent Row */}
      <TableRow hover>
        <TableCell sx={{ width: 50 }}>
          {isParent && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen((prev) => !prev)}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          )}
        </TableCell>

        <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
          {row.email}
        </TableCell>
        <TableCell align="right">{row.points ?? 0}</TableCell>
        <TableCell align="right" sx={{ textTransform: 'capitalize' }}>
          {row.role || '—'}
        </TableCell>
        <TableCell align="right">
          {row.referred ? 'Yes' : 'No'}
        </TableCell>
      </TableRow>

      {/* 🔹 Child Rows (Collapsible Section) */}
      {isParent && (
        <TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={5}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  component="div"
                  sx={{ fontWeight: 600 }}
                >
                  Referred Users
                </Typography>

                {row.referredUsers?.length ? (
                  <Table size="small" aria-label="referred users">
                    <TableHead>
                      <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell align="right">Points</TableCell>
                        <TableCell align="right">Role</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.referredUsers.map((referredUser) => (
                        <TableRow hover key={referredUser.uid}>
                          <TableCell>{referredUser.email}</TableCell>
                          <TableCell align="right">
                            {referredUser.points ?? 0}
                          </TableCell>
                          <TableCell align="right" sx={{ textTransform: 'capitalize' }}>
                            {referredUser.role || '—'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ p: 1 }}
                  >
                    No referred users found.
                  </Typography>
                )}
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
    points: PropTypes.number,
    role: PropTypes.string,
    referred: PropTypes.bool,
    referredUsers: PropTypes.arrayOf(
      PropTypes.shape({
        uid: PropTypes.string,
        email: PropTypes.string,
        points: PropTypes.number,
        role: PropTypes.string,
      })
    ),
  }).isRequired,
  isParent: PropTypes.bool.isRequired,
};
