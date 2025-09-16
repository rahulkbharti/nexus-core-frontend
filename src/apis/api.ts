import axios from "axios";
// import { AxiosRequestConfig } from "axios";

// --- Configuration ---
const AUTH_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
    const login_data = JSON.parse(localStorage.getItem("login_data") || "{}");
    // console.log(login_data)
    // console.log("Intercepting request to:", login_data);
    try {
      if (!login_data?.accessToken) return req;

      const currentTime = Date.now();
      const isExpired = login_data?.exp && currentTime > login_data.exp;

      // ✅ Refresh if expired
      if (isExpired && !req._retry) {
        // console.log("Token expired, refreshing...");
        req._retry = true;

        const response = await axios.post(`${AUTH_URL}/auth/refresh`, {
          refreshToken: login_data.refreshToken,
        });
        // console.log(response);
        const refreshed = { ...login_data };
        const data = (response.data as any).tokenObj as {
          accessToken: string;
          exp: number;
        };
        refreshed.accessToken = data.accessToken;
        refreshed.exp = Date.now() + 15 * 60 * 1000;

        // Store In local Storage
        localStorage.setItem("login_data", JSON.stringify(refreshed));

        req.headers["Authorization"] = `Bearer ${refreshed.accessToken}`;
        // console.log("Token refreshed:", refreshed.accessToken);
        return req;
      }

      // ✅ accessToken is still valid
      // console.log("Using existing token:", login_data.accessToken);

      req.headers["Authorization"] = `Bearer ${login_data.accessToken}`;
      // console.log(req.headers["Authorization"]);

      return req;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return req; // optionally reject to prevent request
    }
  },
  (error) => Promise.reject(error)
);

export default api;

const login = async () => {
  console.log("Making login request...");

  const response = await axios.post<{
    accessToken: string;
    refreshToken: string;
  }>("http://localhost:5000/api/auth/login", {
    email: "admin@gmail.com",
    password: "123457",
  });
  console.log("Login response:", response.data);
  const { accessToken, refreshToken } = (response.data as any).tokenObj;
  // console.log(accessToken);
  localStorage.setItem(
    "login_data",
    JSON.stringify({
      accessToken,
      refreshToken,
      exp: Date.now() + 15 * 60 * 1000,
    })
  );
};

(window as any).login = login;
