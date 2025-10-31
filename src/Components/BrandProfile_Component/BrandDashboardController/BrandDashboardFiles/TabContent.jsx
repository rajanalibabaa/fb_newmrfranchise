// components/TabContent.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LeadsTab from "./LeadsTab";

const colors = {
  primary: "#2c3e50",
  secondary: "#34495e",
  accent: "#3498db",
  background: "#f8f9fa",
  cardBackground: "#ffffff",
  textPrimary: "#2c3e50",
  textSecondary: "#7f8c8d",
  divider: "#ecf0f1",
};

const TabContent = ({ tabValue, Leads, loading, error, onRetry, onViewDetails }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
        <CircularProgress size={60} sx={{ color: colors.accent }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", flexDirection: "column" }}>
        <Typography color="error" variant="h6" gutterBottom>
          Error Loading Data
        </Typography>
        <Typography color={colors.textSecondary}>{error}</Typography>
        <Button
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: colors.accent,
            "&:hover": { backgroundColor: colors.secondary },
          }}
          onClick={onRetry}
        >
          Retry
        </Button>
      </Box>
    );
  }
  switch (tabValue) {
    case 0:
      return <LeadsTab Leads={Leads} onViewDetails={onViewDetails} />;
    default:
      return null;
  }
};

export default TabContent;