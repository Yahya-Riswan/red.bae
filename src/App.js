import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import RoleAdmin from "./Role/Admin";
import RoleUser from "./Role/User";
import AdminContext from "./Context/AdminContext"

function App() {


  const [admin, setAdmin] = useState({});

  return (
    <>
      <AdminContext.Provider value={{admin,setAdmin}}>
        {
          admin.role === "admin" &&
          <RoleAdmin />
        }
        {
          admin.role !== "admin" &&
          <RoleUser />
        }
      </AdminContext.Provider>
    </>
  );
}

export default App;
