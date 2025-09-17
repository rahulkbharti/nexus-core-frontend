import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from "@react-oauth/google"
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
})



ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <StyledEngineProvider injectFirst>
        <GoogleOAuthProvider clientId="268965502257-7p7sntm10gneuhano1dkbqq3pdaha6pu.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </StyledEngineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);