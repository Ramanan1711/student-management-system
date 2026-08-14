import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";

import Dashboard from "../pages/dashboard/Dashboard";
import Walkins from "../pages/walkins/Walkins";
import Registration from "../pages/students/Registration";
import StudentsList from "../pages/students/StudentsList";
import StudentProfile from "../pages/students/StudentProfile";
import Admissions from "../pages/admissions/Admissions";
import Batches from "../pages/batches/Batches";
import Employees from "../pages/employees/Employees";
import Attendance from "../pages/attendance/Attendance";
import ClassReports from "../pages/class-reports/ClassReports";
import Tasks from "../pages/tasks/Tasks";
import Performance from "../pages/performance/Performance";
import Reports from "../pages/reports/Reports";
import Login from "../pages/auth/Login";

export default function AppRoutes() {
  return (
    <Routes>

        {/* Public Route */}
      <Route path="/login" element={<Login />} />
      
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/walkins"
          element={<Walkins />}
        />

        <Route
          path="/registration"
          element={<Registration />}
        />

        <Route
          path="/students"
          element={<StudentsList />}
        />

        <Route
          path="/students/:studentId"
          element={<StudentProfile />}
        />

        <Route
          path="/admissions"
          element={<Admissions />}
        />

        <Route
          path="/batches"
          element={<Batches />}
        />

        <Route
          path="/employees"
          element={<Employees />}
        />

        <Route
          path="/attendance"
          element={<Attendance />}
        />

        <Route
          path="/class-reports"
          element={<ClassReports />}
        />

        <Route
          path="/tasks"
          element={<Tasks />}
        />

        <Route
          path="/performance"
          element={<Performance />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />
      </Route>

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}