import axios from "axios";

// 🔗 Base API URL
const BASE_URL = "https://strike-defender-v1.runasp.net/";

const api = axios.create({
  baseURL: BASE_URL,
});

// ✅ Request Interceptor
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

// 🔥 Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // تشيك لو الـ error هو 401 (Unauthorized) والطلب ده مكررناش محاولته قبل كدة
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const currentRefreshToken = localStorage.getItem("refreshToken");

        // ⚠️ ملاحظة: استخدمنا axios العادي هنا مش api عشان ميبعتش الهيدر القديم "Bearer"
        const res = await axios.post(`${BASE_URL}api/Authentication/refresh-token`, {
          refreshToken: currentRefreshToken,
        });

        // استخراج التوكنز الجديدة (تأكد من مطابقة الأسماء للي راجع من الـ API عندك)
        const { token, refreshToken } = res.data;

        // ✅ تحديث الـ LocalStorage
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);

        // ✅ تحديث الهيدر للطلب الحالي اللي فشل
        originalRequest.headers.Authorization = `Bearer ${token}`;

        // ✅ إعادة تنفيذ الطلب الأصلي بالتوكن الجديد
        return api(originalRequest);
      } catch (err) {
        console.error("Critical: Refresh Token Expired or Invalid", err);

        // 🚨 لو الـ Refresh Token نفسه باظ.. Logout فوراً
        localStorage.clear(); // أضمن بكتير من مسح عنصر عنصر
        window.location.href = "/"; 
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;