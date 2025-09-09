import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  LinearProgress,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
import { Favorite, Bookmark, Visibility, AssignmentTurnedIn } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { openBrandDialog } from "../../../Redux/Slices/OpenBrandNewPageSlice";

const AppliedTab = ({
  items = [],
  isLoading,
  errorMessage,
  currentPage,
  totalPages,
  handlePageChange,
  isPaginating,
}) => {

  const dispatch = useDispatch()
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography color="error">{errorMessage}</Typography>
      </Box>
    );
  }

  const handleViewDetails = (brandID)=> {
    
    dispatch(openBrandDialog(brandID));
  }

  return (
    <>
      {isPaginating && <LinearProgress sx={{ width: "100%", mb: 2 }} />}
      {items.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Logo</TableCell>
                  <TableCell>Brand Name</TableCell>
                  <TableCell>Investment Range</TableCell>
                  <TableCell>Plan To Invest</TableCell>
                  <TableCell>City / State</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => {
                  const app = item.application;
                  return (
                    <TableRow key={app.applyId}>
                      <TableCell>
                        <Avatar
                          src={app.brandLogo}
                          alt={app.brandName}
                          variant="square"
                          sx={{ width: 50, height: 50 }}
                        />
                      </TableCell>
                      <TableCell>{app.brandName}</TableCell>
                      <TableCell>{app.investmentRange}</TableCell>
                      <TableCell>{app.planToInvest}</TableCell>
                      <TableCell>
                        {app.city}, {app.state}
                      </TableCell>
                      <TableCell align="center">
                        
                        <IconButton
                          color="secondary"
                          onClick={() => handleViewDetails(app.brandId)}
                        >
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ py: 10, textAlign: "center" }}>
          <AssignmentTurnedIn color="disabled" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6">No applications yet</Typography>
          <Typography>Your applications will appear here</Typography>
        </Box>
      )}
    </>
  );
};

export default AppliedTab;
