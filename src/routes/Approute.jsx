import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loading from "../components/Modal/Loading";
import Staff_nav from "../components/staff/Staff_nav";
import Staff_dashboard from "../pages/staff/dashboard/Staff_dashboard";
import View_intern from "../pages/staff/viewintern/View_intern";
import Room from "../pages/staff/room/Room";
import Forgotten from "../pages/auth/Forgotten";


// Lazy loading components
const Login = lazy(() => import("../pages/auth/Login"));
const Admin_nav = lazy(() => import("../components/admin/Admin_nav"));
const Admin_dashboard = lazy(() => import("../pages/admin/dashboard/Admin_dashboard"));
const Managestaff = lazy(() => import("../components/admin/Manage_staff"));
const Listall_staff = lazy(() => import("../pages/admin/managestaff/Listall_staff"));
const Manage_interns = lazy(() => import("../components/admin/Manage_interns"));
const Manage_rooms = lazy(() => import("../pages/admin/manageroom/Manage_rooms"));
const Manage_fees = lazy(() => import("../pages/admin/managefees/Manage_fees"));
const Manage_seat = lazy(() => import("../pages/admin/manageseat/Manage_seat"));
const Listall_intern = lazy(() => import("../pages/admin/manageintern/Listall_intern"));

const Approute = () => {
  return (
    <Router>
      <Suspense fallback={<div><Loading/></div>}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgotten" element={<Forgotten/>}/>
          <Route path="/admin/:url" element={<Admin_nav />} />
          <Route path="/dashboard" element={<Admin_dashboard />} />
          <Route path="/managestaff" element={<Listall_staff />} />
          <Route path="/addstaff" element={<Managestaff />} />
          <Route path="/manageintern" element={<Listall_intern />} />
          <Route path="/addintern" element={<Manage_interns />} />
          <Route path="/managerooms" element={<Manage_rooms />} />
          <Route path="/managefees" element={<Manage_fees />} />
          <Route path="/manageseats" element={<Manage_seat />} />
          <Route path="/staff/:url" element={<Staff_nav/>}/>
          <Route path="/dashboard" element={<Staff_dashboard/>}/>
          <Route path="/viewintern" element={<View_intern/>}/>
          <Route path="/rooms" element={<Room/>}/>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default Approute;
