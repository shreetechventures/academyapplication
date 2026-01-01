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

/* =====================================================
   🌐 API INSTANCE (SUBDOMAIN-BASED)
   - No academyCode in URL
   - Nginx proxies /api → backend
===================================================== */
const api = axios.create({
  baseURL: "/api",        // ✅ IMPORTANT
  withCredentials: true,  // safe for future cookies
});

/* =====================================================
   🔐 REQUEST → Attach JWT
===================================================== */
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

/* =====================================================
   ⚠️ RESPONSE → Handle auth correctly (SUBDOMAIN SAFE)
===================================================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // ❌ Logout ONLY on invalid/expired token
    if (status === 401) {
      localStorage.clear();

      alert("Session expired. Please login again.");

      // ✅ SUBDOMAIN SAFE REDIRECT
      window.location.href = "/login";
    }

    // ❌ DO NOT auto logout on 403
    return Promise.reject(error);
  }
);

export default api;
