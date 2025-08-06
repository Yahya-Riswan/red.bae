import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import RoleAdmin from "./Role/Admin";
import RoleUser from "./Role/User";

function App() {
  const location = useLocation();
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes("admin")) {
      let admin = JSON.parse(localStorage.getItem("currentUser"));
      if (admin.role === "admin") {
        setIsAdminRoute(true);
      } else {
        setIsAdminRoute(false);
      }
    }
  }, [location])

  return (
    <>
      {
        isAdminRoute &&
        <RoleAdmin />
      }
      {
        !isAdminRoute &&
        <RoleUser />
      }
    </>
  );
}

export default App;
