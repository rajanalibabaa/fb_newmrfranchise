import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import illustration from "../../assets/Images/LoginImage.png";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUUIDandTOKEN, logout } from "../../Redux/Slices/AuthSlice/authSlice";
import CloseIcon from "@mui/icons-material/Close";
import { showLoading, hideLoading } from "../../Redux/Slices/loadingSlice";
import { useMediaQuery, useTheme } from "@mui/system";

function LoginPage({ open, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const token = useSelector((state) => state.auth.token);

  const [formData, setFormData] = useState({ username: "", otp: "" });
  const [errors, setErrors] = useState({});
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isEmail = useMemo(() => formData.username.includes("@"), [formData.username]);

  const otpRequestPayload = useMemo(() => {
    const trimmed = formData.username.trim();
    return isEmail ? { email: trimmed } : { mobileNumber: `+91${trimmed}` };
  }, [formData.username, isEmail]);

  const otpVerifyPayload = useMemo(() => {
    const trimmed = formData.username.trim();
    return {
      verifyOtp: formData.otp,
      [isEmail ? "email" : "phone"]: isEmail ? trimmed : `+91${trimmed}`,
    };
  }, [formData.otp, formData.username, isEmail]);

  // Countdown for resend OTP
  useEffect(() => {
    if (resendDisabled && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setResendDisabled(false);
      setTimer(30);
    }
  }, [resendDisabled, timer]);

  // 🔥 Auto logout checker
  useEffect(() => {
    const logoutTimestamp = localStorage.getItem("logoutTimestamp");
    if (!logoutTimestamp) return;

    const parsed = parseInt(logoutTimestamp, 10);
    const now = Date.now();

    if (parsed <= now) {
      dispatch(logout());
      navigate("/");
      return;
    }

    const timeout = parsed - now;
    const timer = setTimeout(() => {
      dispatch(logout());
      navigate("/");
    }, timeout);

    return () => clearTimeout(timer);
  }, [dispatch, navigate, token]);

  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.username) &&
      !/^\d{10}$/.test(formData.username)
    ) {
      newErrors.username = "Invalid email or phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.username]);

  const handleOtpRequest = useCallback(async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/login/generateOTPforLogin`,
        otpRequestPayload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "OTP sent successfully!",
          severity: "success",
        });
        setIsOtpSent(true);
        setResendDisabled(true);
      } else {
        throw new Error(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [otpRequestPayload, validateForm]);

  const handleVerifyOtp = useCallback(async () => {
    if (!formData.otp) {
      setErrors((prev) => ({ ...prev, otp: "OTP is required" }));
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/login/`,
        otpVerifyPayload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        const logoutTime = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem("logoutTimestamp", logoutTime.toString());

        dispatch(
          setUUIDandTOKEN({
            investorUUID: response.data.data.investorUUID,
            brandUUID: response.data.data.brandUserUUID,
            token: response.data.data.AccessToken,
          })
        );

        setSnackbar({
          open: true,
          message: "Login successful! Redirecting...",
          severity: "success",
        });

        setTimeout(() => {
          onClose();
          setFormData({ username: "", otp: "" });
          setIsOtpSent(false);
          setResendDisabled(false);
          setTimer(30);
          setErrors({});
          navigate("/");
          window.location.reload(); // Full refresh
        }, 1000);
      } else {
        throw new Error(response.data.message || "Invalid OTP");
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [otpVerifyPayload, formData.otp, dispatch, navigate, onClose]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      isOtpSent ? handleVerifyOtp() : handleOtpRequest();
    },
    [isOtpSent, handleOtpRequest, handleVerifyOtp]
  );

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#ffba00",
            px: 3,
            py: 2,
          }}
        >
          <Typography variant="h5" component={"span"}>
            Login
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: "red", fontSize: 30 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Grid display={"flex"} sx={{ minHeight: "65vh" }}>
            {!isMobile && (
              <Box ml={4} sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 4 }}>
                <img
                  src={illustration}
                  alt="Login"
                  loading="lazy"
                  style={{ maxWidth: "100%", height: "65vh" }}
                />
              </Box>
            )}

            <Grid ml={2} xs={12} md={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 4 }}>
              <Box sx={{ width: "100%", maxWidth: 400 }}>
                <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
                  Welcome Back!
                </Typography>
                <Typography variant="body1" textAlign="center" color="text.secondary" mb={3}>
                  Please log in to your account to continue.
                </Typography>

                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Enter your registered Email / Phone"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!errors.username}
                    helperText={errors.username}
                    disabled={isOtpSent || isLoading}
                    sx={{ mb: 2 }}
                  />

                  {isOtpSent && (
                    <TextField
                      fullWidth
                      label="OTP"
                      id="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      error={!!errors.otp}
                      helperText={errors.otp}
                      disabled={isLoading}
                      sx={{ mb: 2 }}
                    />
                  )}

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{ height: 48, mb: 2, bgcolor: "#007BFF", "&:hover": { bgcolor: "#0056b3" } }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : isOtpSent ? (
                      "Verify OTP"
                    ) : (
                      "Request OTP"
                    )}
                  </Button>
                </form>

                {isOtpSent && (
                  <Typography variant="body2" textAlign="center" mb={2}>
                    Didn’t receive OTP?{" "}
                    <Link component="button" onClick={handleOtpRequest} disabled={resendDisabled}>
                      {resendDisabled ? `Resend in ${timer}s` : "Resend OTP"}
                    </Link>
                  </Typography>
                )}

                <Typography variant="body2" textAlign="center" mt={2}>
                  New Registration{" "}
                  <Link
                    component="button"
                    onClick={() => {
                      dispatch(showLoading());
                      onClose();
                      navigate("/registerhandleuser");
                      setTimeout(() => {
                        dispatch(hideLoading());
                      }, 1000);
                    }}
                    sx={{ fontWeight: 500 }}
                  >
                    Click here
                  </Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default LoginPage;
