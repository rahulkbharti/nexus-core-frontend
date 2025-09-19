import { Box, Button, Divider, Link, Typography } from "@mui/material";
import AuthLayout from "../AuthLayout";
import { Formik } from "formik";
import FormInput from "../../common/FormInput";
import { Google } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { login, type LoginData } from "../../../store/features/authSlice";
import { useDispatch } from "react-redux";
import { Link as L } from "react-router-dom";
import { useGoogleLogin, type TokenResponse } from "@react-oauth/google";

interface LoginResponse {
    tokenObj: {
        accessToken: string;
        refreshToken: string;
        user: {
            name: string;
            email: string;
            role: "ADMIN" | "STAFF" | "MEMBER";
            permissions: string[];
            organization: {
                name: string;
                address: string;
            };
        };
    };
}

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogin = async (values: any) => {
        // console.log(values)
        const response = await axios.post<LoginResponse>("http://localhost:3000/api/auth/login", values);
        if (response.status === 200) {
            const data = response.data.tokenObj
            const loginData: LoginData = {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
                permissions: data.user.permissions,
                organization: {
                    name: data.user.organization.name,
                    address: data.user.organization.address
                },
                exp: Date.now() + 15 * 60 * 1000, // Token expiration time (15 minutes from now)
            }
            dispatch(login(loginData));
            // console.log("Login successful", loginData);
            navigate("/users")
        }
    }
    const googleAuth = useGoogleLogin({
        onSuccess: async (tokenResponse: Omit<TokenResponse, "error" | "error_description" | "error_uri">) => {
            // console.log('Google Token Response:', tokenResponse);
            try {
                const response = await axios.post<LoginResponse>(`http://localhost:3000/api/auth/google-login`, {
                    access_token: tokenResponse.access_token,
                });

                if (response.status === 200) {
                    const data = response.data.tokenObj
                    const loginData: LoginData = {
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        name: data.user.name,
                        email: data.user.email,
                        role: data.user.role,
                        permissions: data.user.permissions,
                        organization: {
                            name: data.user.organization.name,
                            address: data.user.organization.address
                        },
                        exp: Date.now() + 15 * 60 * 1000, // Token expiration time (15 minutes from now)
                    }
                    dispatch(login(loginData));
                    // console.log("Login successful", loginData);
                    navigate("/users")
                }
            } catch (error) {
                console.error('Error sending token to backend:', error);
            }
        },
        onError: () => {
            console.error('Google Login Failed');
        },
        scope: 'openid email profile',
    });

    return (
        <AuthLayout coverImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" >
            <Box>
                <Formik initialValues={{ email: "", password: "" }} onSubmit={handleLogin}>
                    {({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 800 }}>
                                Library Management System
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 2 }}>
                                Sign in to your account
                            </Typography>


                            <FormInput name="email" label="Email" placeholder="your@email.com" />
                            <FormInput name="password" label="Password" placeholder="Password" />

                            <Button
                                type="submit"
                                size="small"
                                fullWidth
                                variant="contained"
                                sx={{ my: 1 }}
                            >
                                Sign in
                            </Button>
                            <Link
                                component={L}
                                to="/forget-password"
                                type="button"
                                variant="body2"
                                sx={{ alignSelf: 'center' }}
                            >
                                Forgot your password?
                            </Link>
                            <Divider>or</Divider>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => googleAuth()}
                                startIcon={<Google />}
                                size="small"
                                sx={{ my: 1 }}
                            >
                                Sign in with Google
                            </Button>
                            <Typography sx={{ textAlign: 'center' }}>
                                Don&apos;t have an account?{' '}
                                <Link
                                    component={L}
                                    to="/register"
                                    variant="body2"
                                    sx={{ alignSelf: 'center' }}
                                >
                                    Sign up
                                </Link>
                            </Typography>
                        </form>)}
                </Formik>
            </Box>
        </AuthLayout>
    );
}
export default LoginPage;