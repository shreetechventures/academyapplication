// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api", // no trailing slash
//     // baseURL: "http://10.125.212.171:50000/api",

// });

// /* =====================================================
//    🔐 REQUEST → Attach JWT
// ===================================================== */
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// /* =====================================================
//    ⚠️ RESPONSE → Handle auth properly
// ===================================================== */
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;
//     const message = error.response?.data?.message;

//     // ❌ Logout ONLY when token is invalid
//     if (status === 401) {
//       localStorage.clear();
//       alert("Session expired. Please login again.");
//       window.location.href = "/shreenath/login";
//     }

//     // ❌ DO NOT auto logout on 403
//     return Promise.reject(error);
//   }
// );




// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // 🔥 relative, works in prod + dev
});

/* =====================================================
   🔐 REQUEST → Attach JWT + academyCode
===================================================== */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🌱 AUTO-ADD academyCode FROM URL
    // example URL: /shreenath/fees
    const academyCode = window.location.pathname.split("/")[1];

    if (
      academyCode &&
      academyCode !== "login" &&
      !config.url.startsWith(`/${academyCode}`)
    ) {
      config.url = `/${academyCode}${config.url}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =====================================================
   ⚠️ RESPONSE → Handle auth safely
===================================================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.clear();
      window.location.href = "/login"; // academy auto-resolved
    }

    return Promise.reject(error);
  }
);

export default api;
