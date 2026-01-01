// // PageWrapper.jsx
// import React, { useEffect, useState } from "react";
// import DashboardSidebar from "./DashboardSidebar";
// import DashboardHeader from "./DashboardHeader";
// import { useLocation, useNavigate } from "react-router-dom";
// import { getAcademyCodeFromPath } from "../utils/tenant";
// import axios from "../api/axios";
// import "../styles/dashboard.css";

// export default function PageWrapper({ children }) {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const academyCode = getAcademyCodeFromPath(location.pathname);
//   const [academy, setAcademy] = useState(null);

//   // console.log(academyCode, "academy code");
//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await axios.get(`/${academyCode}`);
//         setAcademy(res.data);
//       } catch (err) {
//         console.error("Academy load error:", err);
//       }
//     }
//     load();
//   }, [academyCode]);

//   const logout = () => {
//     localStorage.clear();
//     navigate(`/${academyCode}/login`);
//   };

//   return (
//     <>
//       {/* Hamburger */}
//       <div className="hamburger" onClick={() => setSidebarOpen(true)}>
//         ☰
//       </div>

//       <div className="dashboard-container">
//         <DashboardSidebar
//           academyCode={academyCode}
//           open={sidebarOpen}
//           close={() => setSidebarOpen(false)}
//         />

//         <div className="main-section">
//           <DashboardHeader academy={academy} onLogout={logout} />

//           <div className="dashboard-content">{children}</div>
//         </div>
//       </div>
//     </>
//   );
// }



// frontend/src/components/PageWrapper.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import api from "../api/axios";
import "../styles/dashboard.css";

export default function PageWrapper({ children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [academy, setAcademy] = useState(null);

  /* =====================================================
     🌐 LOAD ACADEMY (FROM SUBDOMAIN)
  ===================================================== */
  useEffect(() => {
    async function loadAcademy() {
      try {
        const res = await api.get("/academy");
        setAcademy(res.data);
      } catch (err) {
        console.error("Academy load error:", err);
        navigate("/login");
      }
    }

    loadAcademy();
  }, [navigate]);

  /* =====================================================
     🔓 LOGOUT
  ===================================================== */
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* Hamburger */}
      <div className="hamburger" onClick={() => setSidebarOpen(true)}>
        ☰
      </div>

      <div className="dashboard-container">
        <DashboardSidebar
          open={sidebarOpen}
          close={() => setSidebarOpen(false)}
        />

        <div className="main-section">
          <DashboardHeader academy={academy} onLogout={logout} />

          <div className="dashboard-content">{children}</div>
        </div>
      </div>
    </>
  );
}
