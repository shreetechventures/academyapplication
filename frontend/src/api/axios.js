// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api", // no trailing slash
// });

// // 🔐 Auto-attach token to every request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;










// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api", // no trailing slash
// });

// // 🔐 Auto-attach token to every request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // ⚠️ Subscription warning interceptor (ADD THIS)
// api.interceptors.response.use(
//   (response) => {
//     const warn = response.headers["x-subscription-warning"];

//     if (warn === "true") {
//       localStorage.setItem("subscriptionWarning", "true");
//     } else {
//       localStorage.removeItem("subscriptionWarning");
//     }

//     return response;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;






// import axios from "axios";

// const api = axios.create({
//   // baseURL: "http://localhost:5000/api", // no trailing slash
//     baseURL: "http://192.168.1.14:5000/api", // no trailing slash

// });

// /* =====================================================
//    🔐 REQUEST INTERCEPTOR → Attach JWT token
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
//    ⚠️ RESPONSE INTERCEPTOR → Subscription + Disable handling
// ===================================================== */
// api.interceptors.response.use(
//   (response) => {
//     // ⚠️ Subscription warning (5 days before expiry)
//     const warn = response.headers["x-subscription-warning"];

//     if (warn === "true") {
//       localStorage.setItem("subscriptionWarning", "true");
//     } else {
//       localStorage.removeItem("subscriptionWarning");
//     }

//     return response;
//   },
//   (error) => {
//     const status = error.response?.status;
//     const message = error.response?.data?.message;

//     // 🚫 Academy disabled / subscription expired
//     if (status === 403 || status === 401) {
//             localStorage.clear();

//       alert(message || "Access blocked");

//             window.location.href = `${window.location.origin}/shreenath/login`;

//       // window.location.href = "shreenath/login";
//             return;

//     }


//     return Promise.reject(error);
//   }
// );

// export default api;



import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // no trailing slash
    // baseURL: "http://10.125.212.171:50000/api",

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
   ⚠️ RESPONSE → Handle auth properly
===================================================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // ❌ Logout ONLY when token is invalid
    if (status === 401) {
      localStorage.clear();
      alert("Session expired. Please login again.");
      window.location.href = "/shreenath/login";
    }

    // ❌ DO NOT auto logout on 403
    return Promise.reject(error);
  }
);




export default api;
