import React, { useState } from "react";
import { Link as RouterLink, Outlet } from "react-router-dom";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import img from "../../assets/Images/brandLogo.jpg";
import Footer from "../../Components/Footers/Footer";
import Navbar from "../../Components/Navbar/NavBar";

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinkStyle = {
    display: "block",
    textDecoration: "none",
    color: "#333",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#e9e9e9",
      transform: "translateX(5px)",
    },
  };

  const sidebarContent = (
    <Box
      sx={{
        width: 240,
        backgroundColor: "#fff",
        boxShadow: 3,
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      {/* Header with close button for mobile */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ textAlign: "center", flexGrow: 1 }}>
          <RouterLink to="/" style={{ textDecoration: "none" }} onClick={() => isMobile && setMobileOpen(false)}>
            <Box
              sx={{
                maxWidth: 220,
                mx: "auto",
                p: 1,
                textAlign: "center",
                backgroundColor: "#ffffff",
                borderRadius: "5px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "transform 0.4s ease, box-shadow 0.4s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
                },
              }}
            >
              <img
                src={img}
                alt="Brand Logo"
                loading="lazy"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "12px",
                }}
              />
            </Box>
          </RouterLink>
        </Box>
        {isMobile && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              ml: 1,
              color: "#333",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* Navigation Links */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <RouterLink 
          to="/brandDashboard/brandDashboard" 
          style={navLinkStyle}
          onClick={() => isMobile && setMobileOpen(false)}
        >
          Dashboard
        </RouterLink>
        
        <RouterLink 
          to="/brandDashboard/brandlistingcontrol" 
          style={navLinkStyle}
          onClick={() => isMobile && setMobileOpen(false)}
        >
          Brand Listing Controller
        </RouterLink>
        {/* <RouterLink to="/brandDashboard/branddetailcontrol" style={navLinkStyle}>
        Brand Details
        </RouterLink>
         <RouterLink to="/brandDashboard/franchisedetailcontrol" style={navLinkStyle}>
        Franchise Details
        </RouterLink>
          <RouterLink to="/brandDashboard/expansionlocationcontrol" style={navLinkStyle}>
        Expansion Location
        </RouterLink>
          <RouterLink to="/brandDashboard/uploadcontrol" style={navLinkStyle}>
        Uploads
        </RouterLink> */}
        <RouterLink 
          to="/brandDashboard/brandsearchus" 
          style={navLinkStyle}
          onClick={() => isMobile && setMobileOpen(false)}
        >
          Reach Us
        </RouterLink>
      </Box>

      {/* Optional: Feedback & Complaint buttons */}
      {/* <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button
          component={RouterLink}
          to="/brandDashboard/brandfeedback"
          fullWidth
          variant="contained"
          sx={{
            bgcolor: "#ffab00",
            color: "#fff",
            fontWeight: 600,
            mb: 1,
            borderRadius: 1,
            "&:hover": { bgcolor: "#ffa000" },
          }}
          onClick={() => isMobile && setMobileOpen(false)}
        >
          Feedback
        </Button>
        <Button
          component={RouterLink}
          to="/brandDashboard/brandcomplaint"
          fullWidth
          variant="contained"
          sx={{
            bgcolor: "#ffab00",
            color: "#fff",
            fontWeight: 600,
            borderRadius: 1,
            "&:hover": { bgcolor: "#ffa000" },
          }}
          onClick={() => isMobile && setMobileOpen(false)}
        >
          Complaint
        </Button>
      </Box> */}
    </Box>
  );

  return (
    <>
      {/* <Navbar/> */}
      
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "#fff",
            color: "#333",
            boxShadow: 2,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2,
                position: 'absolute',
                left: 16
              }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Centered Logo */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexGrow: 1,
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            >
              <RouterLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
                <Box
                  sx={{
                    maxWidth: 120,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={img}
                    alt="Brand Logo"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </RouterLink>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* Desktop Sidebar */}
        {!isMobile && sidebarContent}

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
              borderRight: "none",
            },
          }}
        >
          {sidebarContent}
        </Drawer>

        {/* Main Content Area */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            overflowY: "auto", 
            p: { xs: 2, sm: 3 },
            mt: isMobile ? '64px' : 0, // Account for mobile app bar height
            height: isMobile ? 'calc(100vh - 64px)' : '100vh'
          }}
        >
          <Outlet />
        </Box>
      </Box>
      
      <Footer />
    </>
  );
};

export default Sidebar;