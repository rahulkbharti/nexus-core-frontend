// import { Paper } from "@mui/material";
// import styled from "styled-components";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Box
        sx={{
            width: "100vw",
            height: "100vh",
            bgcolor: "background.paper",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
    >
        {children}
    </Box>
);

const Container = ({ children }: { children: React.ReactNode }) => (
    <Paper
        sx={{
            display: "flex",
            width: 900,
            minHeight: 500,
            boxShadow: "0 4px 20px background.default" as string,
        }}
    >
        {children}
    </Paper>
);

const ImageSection = ({ imageUrl }: { imageUrl: string }) => (
    <Box
        sx={{
            flex: 1,
            background: `url(${imageUrl}) no-repeat center center`,
            backgroundSize: "cover",
            borderTopLeftRadius: 1,
            borderBottomLeftRadius: 1,
        }}
    />
);

const FormSection = ({ children }: { children: React.ReactNode }) => (
    <Box
        sx={{
            width: "50%",
            flex: 1,
            p: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
        }}
    >
        {children}
    </Box>
);

const AuthLayout = ({ children, coverImage = "" }: { children?: React.ReactNode, coverImage?: string }) => {
    return (
        <Wrapper>
            <Container>
                <ImageSection imageUrl={coverImage} />
                <FormSection>
                    {children}
                </FormSection>
            </Container>
        </Wrapper>)
};

export default AuthLayout;