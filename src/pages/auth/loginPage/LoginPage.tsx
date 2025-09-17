import { Box, Button, Divider, Link, Typography } from "@mui/material";
import AuthLayout from "../AuthLayout";
import { Formik } from "formik";
import FormInput from "../../common/FormInput";
import { Google } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { login, type LoginData } from "../../../store/features/authSlice";
import { useDispatch } from "react-redux";


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
        const response = await axios.post<LoginResponse>("http://localhost:5000/api/auth/login", values);
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

    return (
        <AuthLayout coverImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" >
            <Box>
                <Formik initialValues={{ email: "admin@gmail.com", password: "123457" }} onSubmit={handleLogin}>
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
                                component="button"
                                type="button"
                                //   onClick={handleClickOpen}
                                variant="body2"
                                sx={{ alignSelf: 'center' }}
                            >
                                Forgot your password?
                            </Link>
                            <Divider>or</Divider>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => alert('Sign in with Google')}
                                startIcon={<Google />}
                                size="small"
                                sx={{ my: 1 }}
                            >
                                Sign in with Google
                            </Button>
                            <Typography sx={{ textAlign: 'center' }}>
                                Don&apos;t have an account?{' '}
                                <Link
                                    href="/material-ui/getting-started/templates/sign-in/"
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