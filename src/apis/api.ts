import axios from "axios";
import store from "../store/store";
import { logout, login, type LoginData } from "../store/features/authSlice";
import { showNotification } from "../utils/notification";
// import { AxiosRequestConfig } from "axios";

// --- Configuration ---
const AUTH_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: AUTH_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔁 Axios Request Interceptor
api.interceptors.request.use(
  async (req: any & { _retry?: boolean }) => {
    const userData: LoginData | null = store.getState().auth.loginData ?? null;
    if (userData === null) return req;

    try {
      const currentTime = Date.now();
      const isExpired = userData.exp && currentTime > userData.exp;

      if (isExpired && !req._retry) {
        req._retry = true;

        const response = await axios.post(`${AUTH_URL}/auth/refresh`, {
          refreshToken: userData.refreshToken,
        });
        if (response.status !== 200) {
          store.dispatch(logout());
          return Promise.reject("Unable to refresh token, logging out.");
        }
        const refreshData = response.data as { refreshed_access_token: string };
        console.log(
          "Response from refresh endpoint:",
          refreshData.refreshed_access_token
        );
        const refreshed = { ...userData };
        refreshed.accessToken = refreshData.refreshed_access_token;
        refreshed.exp = Date.now() + 15 * 60 * 1000;
        console.log("Storing refreshed token:", refreshed);
        store.dispatch(login(refreshed));

        req.headers["Authorization"] = `Bearer ${refreshed.accessToken}`;
        return req;
      }
      req.headers["Authorization"] = `Bearer ${userData.accessToken}`;
      return req;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return req;
    }
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    showNotification("Something went wrong!", "error");
    console.error("API Error:", error);
    if (error.response && error.response.status === 401) {
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;

// Remove or rename this function to avoid conflict with the imported login action creator
// const loginRequest = async () => {
//   console.log("Making login request...");

//   const response = await axios.post<{
//     accessToken: string;
//     refreshToken: string;
//   }>("http://localhost:5000/api/auth/login", {
//     email: "admin@gmail.com",
//     password: "123457",
//   });
//   console.log("Login response:", response.data);
//   const { accessToken, refreshToken } = (response.data as any).tokenObj;
//   // console.log(accessToken);
//   localStorage.setItem(
//     "login_data",
//     JSON.stringify({
//       accessToken,
//       refreshToken,
//       exp: Date.now() + 15 * 60 * 1000,
//     })
//   );
// };

// (window as any).loginRequest = loginRequest;
