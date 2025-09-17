import { Box, Button, Divider, Link, Step, StepButton, Stepper } from "@mui/material";
import AuthLayout from "../AuthLayout";

import { useState } from "react";
import { Formik } from "formik";
import FormInput from "../../common/FormInput";
import { Typography } from "@mui/material";
import { Link as L } from "react-router-dom";

const ForgetPassword = () => {
    const [activeStep, setActiveStep] = useState(0);
    const steps = ["Send OTP", "Verify OTP"]
    const handleOTPSend = async (_values: any) => {
        setActiveStep(1);
    }
    const handleVerfiyOTP = async (_valys: any) => {
        setActiveStep(2);
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
                {activeStep !== 2 && (
                    <Stepper nonLinear activeStep={activeStep}>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepButton color="inherit" onClick={() => setActiveStep(index)}>
                                    {label}
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                )}

                <Box mt={4}>
                    {activeStep === 0 && (
                        <Box>
                            <Formik initialValues={{ email: "admin1@gmail.com", }} onSubmit={handleOTPSend}>
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
                            <Formik initialValues={{ opt: "", }} onSubmit={handleVerfiyOTP}>
                                {({ handleSubmit }) => (
                                    <form onSubmit={handleSubmit}>
                                        <FormInput name="opt" label="OTP" placeholder="OPT..." />
                                        <Button size="small" type="submit" variant="contained" sx={{ my: 2 }} fullWidth>Verify OTP</Button>
                                    </form>
                                )}
                            </Formik>
                        </Box>
                    )}
                    {activeStep === 2 && (
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
                {activeStep !== 2 && (
                    <>
                        <Divider sx={{ my: 2.5 }} />
                        <Typography sx={{ textAlign: 'center', my: 2 }}>
                            Already have an account?{' '}
                            <Link
                                component={L}
                                to="/login"
                                variant="body2"
                                sx={{ alignSelf: 'center' }}
                            >
                                Login
                            </Link>
                        </Typography>
                    </>
                )}

            </Box>
        </AuthLayout>
    )
}
export default ForgetPassword;