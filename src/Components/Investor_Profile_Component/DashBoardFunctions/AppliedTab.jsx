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
import {
  Visibility,
  AssignmentTurnedIn,
} from "@mui/icons-material";
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


  const dispatch = useDispatch();

  const handleViewDetails = (brandId) => {
    if (brandId) dispatch(openBrandDialog(brandId));
  };

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
                {items.map((item, index) => {
                  const app = item.apply ; // handle flexible data shapes
                  
                  const uniqueKey = `${app.applyId || "unknown"}-${index}`; // ensure uniqueness

                  return (
                    <TableRow key={uniqueKey}>
                      <TableCell>
                        <Avatar
                          src={item.brandLogo || ""}
                          alt={item.brandName || "Brand"}
                          variant="square"
                          sx={{ width: 50, height: 50 }}
                        />
                      </TableCell>

                      <TableCell>{item.brandName || "N/A"}</TableCell>
                      <TableCell>{item.investmentRange || "N/A"}</TableCell>
                      <TableCell>{item.planToInvest || "N/A"}</TableCell>
                      <TableCell>
                        {item.district || "—"}, {item.state || "—"}
                      </TableCell>

                      <TableCell align="center">
                        <IconButton
                          color="warning"
                          onClick={() => handleViewDetails(item.brandId)}
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
