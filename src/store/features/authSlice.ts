import { createSlice } from "@reduxjs/toolkit";

type OrganizationData = {
  name: string;
  address: string;
};

export type LoginData = {
  accessToken: string;
  refreshToken: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF" | "MEMBER";
  permissions: string[];
  organization: OrganizationData;
  exp?: number;
};

export type AuthState = {
  loginData: LoginData | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  loginData: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.loginData = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.loginData = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
