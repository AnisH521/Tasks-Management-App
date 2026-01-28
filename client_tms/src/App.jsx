import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import Login from "./controller/Auth/Login/Login.jsx";
import Dashboard from "./controller/Dashboard/Dashboard.jsx";
import Register from "./controller/Register/Register.jsx";
import ProtectedRoute from "./controller/Auth/Login/ProtectedRoute.jsx";
import MainLayout from "./controller/layout/MainLayout/MainLayout.jsx";
import IssueList from "./controller/Issuelist/Issuelist.jsx";
import RaisedIssueList from "./controller/RaisedIssueList/RaisedIssueList.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/register-issue"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Register />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/issue-list"
          element={
            <ProtectedRoute>
              <MainLayout>
                <IssueList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/raised-issue-list"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RaisedIssueList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

      {/*Toast container only once */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </>
  );
}

export default App;
