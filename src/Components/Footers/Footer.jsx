import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  Button,
} from "@mui/material";
import brandlogo from "../../assets/Images/brandLogo.jpg";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  ArrowUpward,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [email, setEmail] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");
  const [response, setresponse] = React.useState("");
  const navigate = useNavigate();
  
  const handleSubscribe = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/subcribe/getsubscribe",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setresponse(res.data.success);

      if (res.data.success) {
        setSuccessMsg(res.data.message);
      } else {
        setSuccessMsg(res.data.message);
      }
    } catch (error) {
      console.error("Error subscribing:", error);
    } finally {
      setEmail("");
      setTimeout(() => {
        setSuccessMsg("");
      }, 2000);
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#000",
        color: "#fff",
        pt: 2.5,
        pb: 3,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #ffba00 0%, #ff6d00 100%)",
        },
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Brand Column */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <Box
                component="img"
                src={brandlogo}
                loading="lazy"
                alt="MR FRANCHISE Logo"
                sx={{
                  width: "auto",
                  height: { xs: 50, sm: 60, md: 70 },
                  mb: 2,
                  cursor: "pointer",
                  alignSelf: { xs: "center", md: "flex-start" },
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  color: "#ffba00",
                  fontWeight: 700,
                  mb: 1.5,
                  fontSize: "1.1rem",
                  alignSelf: { xs: "center", md: "flex-start" },
                }}
              >
                BUSINESS INVESTORS: BEST CHOICE
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: "#b0bec5",
                  lineHeight: 1.6,
                  fontSize: "0.95rem",
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Empowering franchise growth by connecting brands with serious investors through innovative digital solutions.
              </Typography>
            </Box>
          </Grid>

          {/* Quick Links Column */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                color: "#ffba00",
                fontWeight: 700,
                mb: 2.5,
                fontSize: "1.1rem",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: "50px",
                  height: "3px",
                  backgroundColor: "#ff6d00",
                },
              }}
            >
              Quick Links
            </Typography>
            <Box
              component="nav"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.2,
              }}
            >
              {[
                { text: "Expand Your Brand", href: "/expandyourbrand" },
                { text: "Invest in a Franchise", href: "/investfranchise" },
                { text: "Advertise With Us", href: "/advertisewithus" },
                { text: "Lead Distribution", href: "/franchisepromotion" },
                { text: "Other Industries", href: "/otherindustries" },
                { text: "Blogs", href: "/blogs" },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  color="#b0bec5"
                  underline="none"
                  sx={{
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#ffba00",
                      transform: "translateX(5px)",
                    },
                    fontSize: "0.95rem",
                  }}
                >
                  {item.text}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Support Column */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                color: "#ffba00",
                fontWeight: 700,
                mb: 2.5,
                fontSize: "1.1rem",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: "50px",
                  height: "3px",
                  backgroundColor: "#ff6d00",
                },
              }}
            >
              Support
            </Typography>
            <Box
              component="nav"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.2,
              }}
            >
              {[
                { text: "About Us", href: "/aboutus" },
                { text: "FAQs", href: "/faq" },
                { text: "Help Center", href: "/help" },
                { text: "Terms & Conditions", href: "/termsandconditions" },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  color="#b0bec5"
                  underline="none"
                  sx={{
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#ffba00",
                      transform: "translateX(5px)",
                    },
                    fontSize: "0.95rem",
                  }}
                >
                  {item.text}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Newsletter Column */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="h6"
              sx={{
                color: "#ffba00",
                fontWeight: 700,
                mb: 2.5,
                fontSize: "1.1rem",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: "50px",
                  height: "3px",
                  backgroundColor: "#ff6d00",
                },
              }}
            >
              Newsletter
            </Typography>
            <Typography variant="body2" color="#b0bec5" mb={2}>
              Subscribe to our newsletter for the latest franchise opportunities and industry insights.
            </Typography>

            {successMsg && (
              <Box
                sx={{
                  position: "fixed",
                  top: "40px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: response ? "green" : "red",
                  color: "white",
                  border: "1px solid #c3e6cb",
                  borderRadius: "8px",
                  padding: "8px 40px",
                  fontSize: "0.95rem",
                  zIndex: 1300,
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                  transition: "opacity 0.3s ease-in-out",
                }}
              >
                {successMsg}
              </Box>
            )}

            <Box component="form" sx={{ display: "flex", mb: 3 }}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                style={{
                  flex: 1,
                  padding: "12px 15px",
                  border: "none",
                  borderRadius: "4px 0 0 4px",
                  fontSize: "0.95rem",
                  backgroundColor: "#1e3a5c",
                  color: "#fff",
                  outline: "none",
                }}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                variant="contained"
                aria-label="Subscribe"
                sx={{
                  borderRadius: "0 4px 4px 0",
                  backgroundColor: "#ff6d00",
                  "&:hover": {
                    backgroundColor: "#ff8500",
                  },
                  px: 3,
                  textTransform: "none",
                }}
                onClick={handleSubscribe}
              >
                Subscribe
              </Button>
            </Box>

            {/* Social Media */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="#b0bec5" mb={1.5}>
                Connect with us:
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                {[
                  { icon: <Facebook />, color: "#4267B2", url: 'https://www.facebook.com/profile.php?id=61575143466373' },
                  { icon: <Twitter />, color: "#1DA1F2", url: 'https://twitter.com/' },
                  { icon: <LinkedIn />, color: "#0077B5", url: 'https://www.linkedin.com/company/mr-franchise-www-mrfranchise-in/posts/?feedView=all&viewAsMember=true' },
                  { icon: <Instagram />, color: "#E1306C", url: 'https://www.instagram.com/mrfranchise.in/' },
                ].map((social, index) => (
                  <IconButton
                    key={index}
                    component="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: `${social.color}20`,
                      color: social.color,
                      "&:hover": {
                        backgroundColor: `${social.color}30`,
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Contact Details Column */}
          <Grid item xs={12} md={2}>
            <Typography
              variant="h6"
              sx={{
                color: "#ffba00",
                fontWeight: 700,
                mb: 2.5,
                fontSize: "1.1rem",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: "50px",
                  height: "3px",
                  backgroundColor: "#ff6d00",
                },
              }}
            >
              Contact Details
            </Typography>
            
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Phone sx={{ color: "#ffba00", mr: 1.5, fontSize: "1.2rem" }} />
              <Link
                href="tel:+917449213799"
                color="#b0bec5"
                underline="hover"
                variant="body2"
              >
                +91 7449213799
              </Link>
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <LocationOn sx={{ color: "#ffba00", mr: 1.5, fontSize: "1.2rem" }} />
              <Typography variant="body2" color="#b0bec5">
                India
              </Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="body2" sx={{ color: "#ffba00", mb: 1 }}>
                Want to "ADVERTISE YOUR BRAND" on www.MrFranchise.in?
              </Typography>
              <Typography variant="body2" color="#b0bec5">
                Mail to{" "}
                <Link
                  href="mailto:sales@mrfranchise.in"
                  color="#ffba00"
                  underline="hover"
                >
                  sales@mrfranchise.in
                </Link>
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="body2" sx={{ color: "#ffba00", mb: 1 }}>
                Want to "START A FOOD AND BEVERAGE BUSINESS" and need support?
              </Typography>
              <Typography variant="body2" color="#b0bec5">
                Mail to{" "}
                <Link
                  href="mailto:investor@mrfranchise.in"
                  color="#ffba00"
                  underline="hover"
                >
                  investor@mrfranchise.in
                </Link>
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="body2" sx={{ color: "#ffba00", mb: 1 }}>
                Want to "CHANGE YOUR LISTING INFORMATION" on www.MrFranchise.in?
              </Typography>
              <Typography variant="body2" color="#b0bec5">
                Mail to{" "}
                <Link
                  href="mailto:support.team@mrfranchise.in"
                  color="#ffba00"
                  underline="hover"
                >
                  support.team@mrfranchise.in
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            pt: 2,
            borderTop: "1px solid #1e3a5c",
          }}
        >
          <Typography
            variant="body2"
            color="#b0bec5"
            sx={{ fontSize: "0.85rem", mb: { xs: 2, sm: 0 } }}
          >
            © 2025 MrFranchise.in. All Rights Reserved.
          </Typography>

          <IconButton
            onClick={scrollToTop}
            sx={{
              backgroundColor: "#ff6d00",
              color: "white",
              "&:hover": {
                backgroundColor: "#ff8500",
              },
            }}
          >
            <ArrowUpward />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;