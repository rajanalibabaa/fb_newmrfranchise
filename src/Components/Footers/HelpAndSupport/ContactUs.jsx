import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
  Stack,
  Grid,
  Chip,
} from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  Send,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Person,
} from "@mui/icons-material";
import Navbar from "../../Navbar/NavBar";
import Footer from "../Footer";

const ORANGE = "#ff9800";
const GREEN = "#72ff05";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    alternativePhone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const err = {};
    if (!formData.firstName) err.firstName = "Required";
    if (!formData.email) err.email = "Required";
    if (!formData.phone) err.phone = "Required";
    if (!formData.message || formData.message.length < 20)
      err.message = "Minimum 20 characters required";

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      err.email = "Invalid email";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSnackbar(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        alternativePhone: "",
        message: "",
      });
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <Typography variant="h4" align="center" fontWeight="bold" mt={4} mb={2}>
        Contact Mr.Franchise.in
      </Typography>
      
      <Box sx={{ height: "calc(100vh - 140px)", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", gap: 3, height: "100%", mb: 5 }}>
            {/* LEFT PANEL */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Paper
                sx={{
                  height: "100%",
                  p: 3,
                  borderRadius: 3,
                  bgcolor: ORANGE,
                  color: "#fff",
                }}
              >
                <Typography variant="h5" fontWeight={700} mb={2} sx={{color:"black", textAlign:"center", fontWeight:"bold"}}>
                  Contact Our Team
                </Typography>

                <Typography sx={{ opacity: 0.9, mb: 3, fontSize: 14, textAlign:"center" }}>
                  Let's discuss your project and how we can help.
                </Typography>

                <Stack spacing={2}>
                  <InfoRow icon={<Phone sx={{color:"black"}} />} label="Phone" value="+91 74492 13799" />
                  <InfoRow
                    icon={<Email  sx={{color:"black"}}/>}
                    label="Email"
                    value="info@company.com"
                  />
                  <InfoRow
                    icon={<LocationOn sx={{color:"black"}}/>}
                    label="Locations"
                    value={
                     <Stack direction="row" spacing={1.5} alignItems="flex-start">

    <Box>
      
      <Typography fontWeight={600} fontSize={14} lineHeight={1.6}>
        Mr Franchise <br />
        New No 76/18, Old No 22, B-8, TRB Complex <br />
        Near Ashok Pillar Signal, 100 Feet Road <br />
        Ashok Nagar, Chennai – 600083 <br />
        Tamil Nadu, India
      </Typography>
    </Box>
  </Stack>
                    }
                  />
                </Stack>

                <Stack direction="row" spacing={1.5} mt={3}>
                  <SocialIcon icon={<Facebook />} />
                  <SocialIcon icon={<Twitter />} />
                  <SocialIcon icon={<LinkedIn />} />
                  <SocialIcon icon={<Instagram />} />
                </Stack>
              </Paper>
            </Box>

            {/* RIGHT PANEL */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Paper
                sx={{
                  height: "100%",
                  p: 3,
                  borderRadius: 3,
                  overflow: "auto",
                }}
              >
                <Typography variant="h5" fontWeight={700} mb={1} sx={{ textAlign: "center" }}>
                  Get in Touch
                </Typography>

                <Typography color="text.secondary" mb={3} fontSize={14} textAlign="center">
                  We usually respond within 24 hours.
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid  spacing={2}>
                    <Grid display={'flex'} flexDirection={'row'} justifyContent={'space-around'} gap={5} mb={5}>  {/* Row 1: First Name & Last Name (side by side) */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="First Name *"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person sx={{ color: "#000" }} fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                         InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person sx={{ color: "#000" }} fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
</Grid>
                                      <Grid display={'flex'} flexDirection={'row'} justifyContent={'space-around'}gap={5} mb={5}>  {/* Row 1: First Name & Last Name (side by side) */}

                    {/* Row 2: Email & Phone (side by side) */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Email *"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email sx={{ color: "#000" }} fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Phone *"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone sx={{ color: "#000" }} fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
</Grid>
                    {/* Row 3: Message (Full Width) */}
                    <Grid item xs={12} sm={12} >
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        size="small"
                        label="Your Message *"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        error={!!errors.message}
                        helperText={errors.message}
                        sx={{mb:5}}
                      />
                    </Grid>

                    {/* Row 4: Submit Button (Full Width) */}
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        endIcon={<Send />}
                        sx={{
                          bgcolor: "#7CFC00",
                          color: "#000",
                          fontWeight: 600,
                          "&:hover": { bgcolor: "#64e004" },
                        }}
                      >
                        {loading ? "Sending..." : "Send Message"}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />

      <Snackbar
        open={snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(false)}
      >
        <Alert severity="success" variant="filled">
          Message sent successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

/* HELPERS */
const InfoRow = ({ icon, label, value, labelColor = "black", labelWeight = 600 }) => (
  <Stack direction="row" spacing={1.5} alignItems="flex-start">
    {icon}
    <Box>
      {/* HEADING */}
      <Typography
        fontSize={19}
        sx={{
          opacity: 0.9,
          fontWeight: labelWeight,
          color: labelColor,
        }}
      >
        {label}
      </Typography>

      {/* VALUE */}
      <Typography fontWeight={600} fontSize={14}>
        {value}
      </Typography>
    </Box>
  </Stack>
);


const SocialIcon = ({ icon }) => (
  <IconButton
    size="small"
    sx={{
      color: "#fff",
      bgcolor: "rgba(255,255,255,0.25)",
      "&:hover": { bgcolor: "rgba(255,255,255,0.4)" },
    }}
  >
    {icon}
  </IconButton>
);

export default ContactUs;
