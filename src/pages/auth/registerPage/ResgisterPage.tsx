import { Box, Button, CircularProgress, Divider, Link, Stack, Step, StepButton, Stepper } from "@mui/material";
import AuthLayout from "../AuthLayout";
import { useState } from "react";
import { Formik } from "formik";
import FormInput from "../../common/FormInput";
import { Typography } from "@mui/material";
import { Link as L } from "react-router-dom";
import axios from "axios";
import { showNotification } from "../../../utils/notification";

const AUTH_URL = import.meta.env.VITE_API_URL;

const RegisterPage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [otpId, setOTPId] = useState<string | null>(null);
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState("");
    const steps = ["Verify Email", "Owner Info", "Organization Info"];
    const handleEmailVerfication = async (values: any) => {
        if (!otpId) {
            try {
                const responce = await axios.post(`${AUTH_URL}/auth/admin/verify-email`, { email: values.email });
                if (responce.status === 200) {
                    const otpId = (responce.data as any)?.otpId;
                    setOTPId(otpId);
                    showNotification('OTP sent to your email!', 'success');
                } else {
                    showNotification('Failed to send OTP. Please try again.', 'error');
                }
            } catch (e) {
                console.error(e);
                showNotification('Failed to send OTP. Please try again.', 'error');
            }

        } else {
            try {
                const responce = await axios.post(`${AUTH_URL}/auth/admin/verify-otp`, { otpId, otp: values.otp });
                if (responce.status === 200) {
                    const data = (responce.data as any);
                    setToken(data?.token);
                    setEmail(data?.email);
                    setOTPId(null);
                    setActiveStep(1);
                    showNotification('OTP verified successfully', 'success');
                } else {
                    showNotification('OTP verification failed', 'error');
                }
            } catch (e) {
                console.error(e);
                showNotification('OTP verification failed', 'error');
            }
        }
    }
    const handleAdminRegister = async (values: any) => {
        // console.log(values)
        if (values.password !== values.confirmPassword) {
            alert("Password and Confirm Password must be same")
            return;
        }
        try {
            const responce = await axios.post(`${AUTH_URL}/auth/admin/register`, { token, email, ...values });
            if (responce.status === 201) {
                setToken(null);
                setActiveStep(3);
                showNotification("Succesfully Registered.")
            } else {
                // console.log(responce);
                showNotification("Failed To Register", "error");
            }
        } catch (e) {
            console.error(e);
            showNotification("Failed To Register", "error");
        }

    }
    return (
        <AuthLayout coverImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" >
            <Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 800 }}>
                    Library Management System
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 2 }}>
                    Sign Up
                </Typography>
                {activeStep !== 3 && (
                    <Stepper nonLinear activeStep={activeStep} >
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepButton color="inherit" >
                                    <Typography variant="caption">
                                        {label}
                                    </Typography>
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                )}

                <Box mt={4}>
                    {/* Email,Verification */}
                    {activeStep === 0 && (
                        <Box>
                            <Formik initialValues={{ email: "", otp: "" }} onSubmit={handleEmailVerfication}>
                                {({ handleSubmit, isSubmitting }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                                            <FormInput disabled={!!otpId} name="email" type="email" label="Email" placeholder="Your Email" required />
                                            <Button disabled={!!otpId} size="small" type="submit" variant="contained" sx={{ width: "150px" }} startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}>Send OTP</Button>
                                        </Stack>
                                        <FormInput disabled={!otpId} name="otp" label="OTP" placeholder="OTP..." required />
                                        <Button disabled={!otpId} size="small" type="submit" variant="contained" sx={{ my: 2 }} fullWidth startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}>Continue</Button>
                                    </form>
                                )}
                            </Formik>
                        </Box>
                    )}

                    {/* Account Creation */}
                    <Formik initialValues={{ name: "", password: "", confirmPassword: "", orgName: "", orgAddress: "" }} onSubmit={handleAdminRegister}>
                        {({ handleSubmit, isSubmitting }) => (
                            <form onSubmit={handleSubmit}>
                                {activeStep === 1 && (
                                    <>
                                        <FormInput name="name" label="Owner Name" placeholder="Please Enter Your Name..." required />
                                        <FormInput name="password" label="Password" type="password" placeholder="Please Enter Your Password..." required />
                                        <FormInput name="confirmPassword" label="Confirm Password" type="password" placeholder="Please Enter Your Password..." required />
                                        <Button size="small" type="button" variant="contained" sx={{ my: 2 }} fullWidth onClick={() => setActiveStep(2)}>Continue</Button>
                                    </>
                                )}
                                {activeStep === 2 && (<>
                                    <FormInput name="orgName" label="Organization Name" placeholder="Please Enter Your Organization Name..." required />
                                    <FormInput name="orgAddress" label="Organization Address" placeholder="Please Enter Your Organization Address..." required />
                                    <Button size="small" type="submit" variant="contained" sx={{ my: 2 }} fullWidth startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}>Register</Button>
                                </>)}

                            </form>
                        )}
                    </Formik>



                    {activeStep === 3 && (
                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" fill="#4caf50" />
                                <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" fill="none" />
                            </svg>
                            <Box mt={2} color="#4caf50" fontSize="1.5rem" fontWeight="bold">
                                Account Created Successfully!
                            </Box>
                            <Typography sx={{ textAlign: 'center', my: 2 }}>
                                Go to login Page
                            </Typography>
                            <Button
                                component={L}
                                to="/login"
                                fullWidth
                                variant="contained"
                                size="small"
                                sx={{ my: 1 }}
                            >
                                Login
                            </Button>
                        </Box>
                    )}
                </Box>

                {activeStep !== 3 && (
                    <>
                        <Divider sx={{ my: 2.5 }} />
                        <Typography sx={{ textAlign: 'center', my: 2 }}>
                            Go to login Page
                            <Link
                                component={L}
                                to="/login"
                                variant="body2"
                                sx={{ alignSelf: 'center', mx: 1 }}
                            >
                                Login
                            </Link>
                        </Typography></>
                )}



            </Box>
        </AuthLayout>
    )
}
export default RegisterPage;