import { Box, Button, Divider, Link, Stack, Step, StepButton, Stepper, Typography } from "@mui/material";
import AuthLayout from "../AuthLayout";
import React from "react";
import { Formik } from "formik";
import FormInput from "../../common/FormInput";
import { Link as L } from "react-router-dom"
import axios from "axios";

const RegisterPage = () => {
    const steps = ['Admin Information', 'Orgnization Information'];
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, _setCompleted] = React.useState<{ [k: number]: boolean }>({});
    const handleStep = (step: number) => () => {
        setActiveStep(step);
    }
    const handleSubmit = async (values: any, r: any) => {
        if (values.email && values.password && values.name) {
            await axios.post("http://localhost:3000/api/auth/admin/register", values);
            alert("Registration Successful! Please Login.")
            setActiveStep(0);
            r.resetForm();
        } else {
            alert("Please fill all required fields")
        }
    }
    return (
        <AuthLayout coverImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80">
            <Box>
                <Formik initialValues={{ email: "", name: "", password: "", orgName: "", orgAddress: "" }} onSubmit={handleSubmit}>
                    {({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 800 }}>
                                Library Management System
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 2 }}>
                                Sign Up
                            </Typography>
                            <Stepper nonLinear activeStep={activeStep}>
                                {steps.map((label, index) => (
                                    <Step key={label} completed={completed[index]}>
                                        <StepButton color="inherit" onClick={handleStep(index)}>
                                            {label}
                                        </StepButton>
                                    </Step>
                                ))}
                            </Stepper>
                            {activeStep === 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <FormInput name="email" label="Email" type="email" placeholder="your@email.com" required />
                                    <FormInput name="name" label="Name" placeholder="Your Name" required />
                                    <FormInput name="password" label="Password" type="password" placeholder="Password" required />
                                    {/* <FormInput name="confirmPassword" label="Confirm Password" placeholder="Confirm Password" /> */}
                                    <Button sx={{ mt: 2 }} size="small" variant="contained" fullWidth onClick={() => setActiveStep(1)}>Next</Button>
                                </Box>
                            )}
                            {activeStep === 1 && (
                                <Box sx={{ mt: 2 }}>
                                    <FormInput name="orgName" label="Organization Name" placeholder="Your Organization" />
                                    <FormInput name="orgAddress" label="Organization Address" placeholder="ex: 123 Main St, City, Country" />
                                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                        <Button size="small" variant="outlined" onClick={handleStep(0)} fullWidth>Back</Button>
                                        <Button type="submit" size="small" variant="contained" fullWidth>Register</Button>
                                    </Stack>
                                </Box>
                            )}
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
                        </form>
                    )}
                </Formik>
            </Box>
        </AuthLayout>
    );
}
export default RegisterPage;
