import { Box, Button, Stack, Step, StepButton, Stepper, Typography } from "@mui/material";
import AuthLayout from "../AuthLayout";
import React from "react";
import { Formik } from "formik";
import FormInput from "../../common/FormInput";

const RegisterPage = () => {
    const steps = ['Admin Information', 'Orgnization Information'];
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState<{ [k: number]: boolean }>({});
    const handleStep = (step: number) => () => {
        setActiveStep(step);
    }

    return (
        <AuthLayout coverImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80">
            <Box >
                <Formik initialValues={{ email: "admin@gmail.com", password: "123457" }} onSubmit={() => { }}>
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
                                    <FormInput name="email" label="Email" placeholder="your@email.com" />
                                    <FormInput name="name" label="Name" placeholder="Your Name" />
                                    <FormInput name="password" label="Password" placeholder="Password" />
                                    <FormInput name="confirmPassword" label="Confirm Password" placeholder="Confirm Password" />
                                    <Button sx={{ mt: 2 }} size="small" variant="contained" fullWidth>Next</Button>
                                </Box>
                            )}
                            {activeStep === 1 && (
                                <Box sx={{ mt: 2 }}>
                                    <FormInput name="organizationName" label="Organization Name" placeholder="Your Organization" />
                                    <FormInput name="organizationAddress" label="Organization Address" placeholder="ex: 123 Main St, City, Country" />
                                </Box>
                            )}
                        </form>
                    )}
                </Formik>
            </Box>
        </AuthLayout>
    );
}
export default RegisterPage;
