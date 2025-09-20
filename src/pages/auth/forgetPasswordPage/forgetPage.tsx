import { Box, Button, Divider, Link, Step, StepButton, Stepper } from "@mui/material";
import AuthLayout from "../AuthLayout";

import { useState } from "react";
import { Formik } from "formik";
import FormInput from "../../common/FormInput";
import { Typography } from "@mui/material";
import { Link as L } from "react-router-dom";
import axios from "axios";

const AUTH_URL = import.meta.env.VITE_API_URL;

const ForgetPassword = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [otpId, setOTPId] = useState(null);
    const [resetToken, setResetToken] = useState(null);

    const steps = ["Send OTP", "Verify OTP", "Change Password"];
    const handleOTPSend = async (values: any) => {
        // console.log(values)
        const responce = await axios.post(`${AUTH_URL}/auth/send-otp`, { email: values.email });
        if (responce.status === 200) {
            const otpId = (responce.data as any)?.otpId;
            setOTPId(otpId);
            // console.log(otpId);
            setActiveStep(1);
        } else {
            alert("Somthing Error")
        }

    }
    const handleVerfiyOTP = async (values: any) => {
        // console.log(values)
        const responce = await axios.post(`${AUTH_URL}/auth/verify-otp`, { otpId, otp: values?.otp });
        if (responce.status === 200) {
            const refreshToken = (responce.data as any)?.resetToken;
            setResetToken(refreshToken);
            // console.log(refreshToken);
            setOTPId(null);
            setActiveStep(2);
        } else {
            alert("Somthing Error")
        }
    }

    const handleResetPassword = async (values: any) => {
        // console.log(values)
        if (values?.password !== values?.confirmPassword) {
            alert("Password and Confirm Password not match");
            return;
        } else if (values?.password.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }
        const responce = await axios.post(`${AUTH_URL}/auth/reset-password`, { resetToken, new_password: values?.password });
        if (responce.status === 200) {
            // console.log(responce.data);
            setResetToken(null);
            setActiveStep(3);
        } else {
            alert("Somthing Error")
        }
    }
    return (
        <AuthLayout coverImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" >
            <Box>
                <Typography variant="h5" fontWeight="bold" mb={1} textAlign="center">
                    Account Recovery
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" mb={2} textAlign="center">
                    Enter your email to receive a password reset OTP.
                </Typography>
                {activeStep !== 3 && (
                    <Stepper nonLinear activeStep={activeStep}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepButton color="inherit">
                                    <Typography variant="caption" display="block" gutterBottom>
                                        {label}
                                    </Typography>
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                )}

                <Box mt={4}>
                    {activeStep === 0 && (
                        <Box>
                            <Formik initialValues={{ email: "" }} onSubmit={handleOTPSend}>
                                {({ handleSubmit }) => (
                                    <form onSubmit={handleSubmit}>
                                        <FormInput name="email" label="Email" placeholder="Your Email" />
                                        <Button size="small" type="submit" variant="contained" sx={{ my: 2 }} fullWidth>Send OTP</Button>
                                    </form>
                                )}
                            </Formik>
                        </Box>
                    )}
                    {activeStep === 1 && (
                        <Box>
                            <Formik initialValues={{ otp: "" }} onSubmit={handleVerfiyOTP}>
                                {({ handleSubmit }) => (
                                    <form onSubmit={handleSubmit}>
                                        <FormInput name="otp" label="OTP" placeholder="OTP..." />
                                        <Button size="small" type="submit" variant="contained" sx={{ my: 2 }} fullWidth>Verify OTP</Button>
                                    </form>
                                )}
                            </Formik>
                        </Box>
                    )}

                    {activeStep === 2 && (
                        <Box>
                            <Formik initialValues={{ password: "", confirmPassword: "" }} onSubmit={handleResetPassword}>
                                {({ handleSubmit }) => (
                                    <form onSubmit={handleSubmit}>
                                        <FormInput name="password" label="Password" type="password" placeholder="password..." />
                                        <FormInput name="confirmPassword" label="Confirm Password" type="password" placeholder="Confirm Password..." />
                                        <Button size="small" type="submit" variant="contained" sx={{ my: 2 }} fullWidth>Change Password</Button>
                                    </form>
                                )}
                            </Formik>
                        </Box>
                    )}



                    {activeStep === 3 && (
                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" fill="#4caf50" />
                                <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" fill="none" />
                            </svg>
                            <Box mt={2} color="#4caf50" fontSize="1.5rem" fontWeight="bold">
                                Password Reset Successful!
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
export default ForgetPassword;