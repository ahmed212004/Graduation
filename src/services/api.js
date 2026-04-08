import axios from "axios";

// 🔗 Base API
const api = axios.create({
  baseURL: "http://strike-defender-v1.runasp.net/",
});

// ✅ Request Interceptor (يبعت التوكن مع كل request)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 Response Interceptor (handle refresh token)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // لو Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // اطلب refresh token جديد
        const res = await axios.post(
          "http://strike-defender-v1.runasp.net/api/Authentication/refresh-token",
          {
            refreshToken: refreshToken,
          }
        );

        const newToken = res.data.token;
        const newRefreshToken = res.data.refreshToken;

        // خزّن الجديد
        localStorage.setItem("token", newToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // عدّل الهيدر
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // أعد تنفيذ الطلب
        return api(originalRequest);
      } catch (err) {
        console.log("Refresh Token Failed:", err);

        // logout
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
