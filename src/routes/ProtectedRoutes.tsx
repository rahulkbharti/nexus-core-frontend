import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { type ReactNode } from "react";
import type { AuthState } from "../store/features/authSlice";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const isAuthenticated = useSelector((state: { auth: AuthState }) => state.auth.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}