import { Box, CircularProgress, Typography, keyframes, useTheme } from "@mui/material";

// 1. Define a subtle breathing/pulse animation for the logo
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.85;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const FullPageLoader = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100vw',
                // Use theme background to support Dark/Light mode automatically
                backgroundColor: 'background.default',
                position: 'fixed',
                top: 0,
                left: 0,
                // Ensure it sits above everything (AppBars usually have zIndex 1100)
                zIndex: theme.zIndex.modal + 1,
            }}
        >
            {/* Logo with Animation */}
            <Box
                component="img"
                src="/NexusCore.png"
                alt="Nexus Core Logo"
                sx={{
                    width: 80,
                    height: 'auto', // Maintain aspect ratio
                    mb: 4, // More breathing room between logo and spinner
                    animation: `${pulse} 2s infinite ease-in-out`,
                }}
            />

            {/* Modernized Circular Progress */}
            <CircularProgress
                size={48}
                thickness={4}
                sx={{
                    mb: 3,
                    color: 'primary.main',
                    // Makes the spinner ends round instead of flat
                    '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                    },
                }}
            />

            <Typography
                variant="h6"
                color="text.primary"
                sx={{
                    fontWeight: 600,
                    letterSpacing: '0.5px'
                }}
            >
                Loading Resources...
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
            >
                Please wait a moment
            </Typography>
        </Box>
    );
};

export default FullPageLoader;