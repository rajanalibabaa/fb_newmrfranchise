// components/BrandHeader.js
import React from "react";
import {
  Card,
  Box,
  Typography,
  Avatar,
  Grid,
  CardContent,
} from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";

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

const StatCard = ({ icon: Icon, title, value, borderColor, gradientColor, isMobile, isTablet }) => (
  <Card
    sx={{
      minWidth: isMobile ? "100%" : 120,
      textAlign: "center",
      boxShadow: "0 4px 20px 0 rgba(0,0,0,0.08)",
      borderRadius: "12px",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: isMobile ? "none" : "translateY(-5px)",
        boxShadow: "0 8px 25px 0 rgba(0,0,0,0.12)",
      },
      borderLeft: `4px solid ${borderColor}`,
      position: "relative",
      overflow: "visible",
      height: isMobile ? 80 : "auto",
    }}
  >
    <CardContent sx={{ 
      py: isMobile ? 1 : 0, 
      px: isMobile ? 1 : 2,
      display: "flex",
      flexDirection: isMobile ? "row" : "column",
      alignItems: isMobile ? "center" : "flex-start",
      justifyContent: isMobile ? "space-between" : "center",
      height: "100%",
    }}>
      <Box
        sx={{
          position: isMobile ? "relative" : "absolute",
          top: isMobile ? 0 : -20,
          left: isMobile ? 0 : "50%",
          transform: isMobile ? "none" : "translateX(-50%)",
          bgcolor: borderColor,
          color: "white",
          borderRadius: "50%",
          width: isMobile ? 40 : 40,
          height: isMobile ? 40 : 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: 3,
          flexShrink: 0,
        }}
      >
        <Icon fontSize={isMobile ? "small" : "medium"} />
      </Box>
      
      <Box sx={{ 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-end" : "center",
        gap: isMobile ? 0 : 5,
        flexGrow: 1,
        ml: isMobile ? 2 : 0,
        textAlign: isMobile ? "right" : "left",
      }}>
        <Typography
          variant={isMobile ? "caption" : "subtitle1"}
          fontWeight="medium"
          sx={{
            color: "text.secondary",
            mt: isMobile ? 0 : 3,
            mb: isMobile ? 0.5 : 0,
            ml: isMobile ? 0 : 3,
            lineHeight: isMobile ? 1.2 : "normal",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          component="div"
          fontWeight="bold"
          color="error.main"
          sx={{ 
            mt: isMobile ? 0 : 3, 
            mb: isMobile ? 0 : 0.5, 
            mr: isMobile ? 0 : 3,
            lineHeight: isMobile ? 1.2 : "normal",
          }}
        >
          {value}
        </Typography>
      </Box>
      
      <Box
        sx={{
          height: 4,
          background: `linear-gradient(90deg, ${borderColor} 0%, ${gradientColor} 100%)`,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          borderBottomLeftRadius: "12px",
          borderBottomRightRadius: "12px",
        }}
      />
    </CardContent>
  </Card>
);

const BrandHeader = ({ brandData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <Card
      sx={{
        mb: 3,
        p: isMobile ? 2 : 3,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        gap: isMobile ? 2 : 3,
        flexWrap: "wrap",
        backgroundColor: colors.cardBackground,
        border: `1px solid ${colors.divider}`,
        boxShadow: "none",
      }}
    >
      {/* Brand Info Section */}
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 2,
        width: isMobile ? "100%" : "auto",
        flexDirection: isMobile ? "row" : "row",
      }}>
        <Avatar
          src={brandData?.uploads?.logo || "/default-brand.png"}
          sx={{
            width: isMobile ? 60 : 80,
            height: isMobile ? 60 : 80,
            border: `3px solid ${colors.accent}`,
            bgcolor: colors.secondary,
            flexShrink: 0,
          }}
        />
        <Box sx={{ 
          flexGrow: 1,
          minWidth: isMobile ? 0 : 200,
          overflow: "hidden",
        }}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight={600}
            gutterBottom
            sx={{ 
              color: colors.textPrimary,
              fontSize: isMobile ? "1.1rem" : "1.5rem",
              lineHeight: 1.2,
            }}
            noWrap
          >
            {brandData?.brandDetails?.brandName || "Your Brand"}
          </Typography>
          <Typography
            variant="caption"
            sx={{ 
              color: colors.textSecondary,
              fontSize: isMobile ? "0.7rem" : "0.75rem",
            }}
            gutterBottom
          >
            Member Id : {brandData?.brandID || "Business type not specified"}
          </Typography>
        </Box>
      </Box>

      {/* Stats Section */}
      <Box sx={{ 
        width: isMobile ? "100%" : "auto",
        flexGrow: isMobile ? 1 : 0,
      }}>
        <Grid 
          container 
          spacing={isMobile ? 1 : 3} 
          justifyContent="center" 
          sx={{ 
            py: isMobile ? 1 : 2,
            width: "100%",
          }}
        >
          <Grid item xs={12} sm={6} md={4} sx={{ width: isMobile ? "100%" : "auto" }}>
            <StatCard
              icon={VisibilityIcon}
              title="Views"
              value={brandData.totalViewCount || 0}
              borderColor="#1976d2"
              gradientColor="rgba(25,118,210,0.3)"
              isMobile={isMobile}
              isTablet={isTablet}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} sx={{ width: isMobile ? "100%" : "auto" }}>
            <StatCard
              icon={FavoriteIcon}
              title="Liked"
              value={brandData.totalLikedCount || 0}
              borderColor="#f44336"
              gradientColor="rgba(244,67,54,0.3)"
              isMobile={isMobile}
              isTablet={isTablet}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} sx={{ width: isMobile ? "100%" : "auto" }}>
            <StatCard
              icon={BookmarkIcon}
              title="SortList"
              value={brandData.totalSortlistCount || 0}
              borderColor="#4caf50"
              gradientColor="rgba(76,175,80,0.3)"
              isMobile={isMobile}
              isTablet={isTablet}
            />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default BrandHeader;