import React from "react";
import { Grid, Box, Typography, LinearProgress, Pagination, CircularProgress } from "@mui/material";
import { Bookmark } from "@mui/icons-material";
import BrandCard from "../DashBoardFunctions/BrandCard";

const ShortlistedTab = ({ 
  items = [], 
  isLoading, 
  errorMessage, 
  currentPage = 1, 
  totalPages = 1,
  handlePageChange,
  likedStates = {},
  shortlistedStates = {},
  onViewDetails,
  onToggleLike,
  onToggleShortlist,
  isPaginating
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Typography color="error">{errorMessage}</Typography>
      </Box>
    );
  }

  return (
    <>
      {isPaginating && <LinearProgress sx={{ width: '100%', mb: 2 }} />}
      {items.length > 0 ? (
        <>
          <Grid container spacing={3} justifyContent="center">
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={2.5} key={item?.uuid || item?.brandID || Math.random()}>
                <BrandCard 
                  item={item} 
                  type="shortlisted"
                  likedStates={likedStates}
                  shortlistedStates={shortlistedStates}
                  onViewDetails={onViewDetails}
                  onToggleLike={onToggleLike}
                  onToggleShortlist={onToggleShortlist}
                />
              </Grid>
            ))}
          </Grid>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
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
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Bookmark color="disabled" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6">No shortlisted brands yet</Typography>
          <Typography>Shortlist brands to save them for later</Typography>
        </Box>
      )}
    </>
  );
};

export default ShortlistedTab;