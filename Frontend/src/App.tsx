import React,{Suspense, lazy} from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Box} from "@mui/material";
import SideBar from "./components/SideBar";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import InvoiceGenerator from "./components/InvoiceGenerator";
import AddEmployee from "./components/AddEmployee";
import CollegeList from "./components/CollegeList";
import EmployeeList from "./components/EmployeeList";
import AddCollege from "./components/AddCollege";
import AddVendors from "./components/AddVendors";
import VendorList from "./components/VendorList";
import AddTds from "./components/AddTds";
import TdsList from "./components/TdsList";
import AddLedger from "./components/AddLedger";
import LedgerList from "./components/LedgerList";
const InvoiceList = lazy(() => import("./components/InvoiceList"));
const InvoiceUpdate = lazy(() => import("./components/InvoiceUpdate"));

import { useAuth } from "./AuthContext"; // Import useAuth
import "./App.css";
import Footer from "./components/Footer";
import InvoiceEdit from "./components/InvoiceEdit";
import InvoiceSummary from "./components/InvoiceSummary";

const App: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
 
 

  const isLoginPage: boolean = location.pathname === "/login";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Show Sidebar if user is logged in */}
      {isLoggedIn && !isLoginPage  && <SideBar children={undefined} />}

      <Box sx={{ flexGrow: 1, overflowX: "hidden", padding: 3 }}>
        
        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn ? <Navigate to="/" /> : <LoginPage />
            }
          />
          <Route
            path="/"
            element={
              isLoggedIn ? <HomePage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/add-invoice"
            element={
              isLoggedIn ? <InvoiceGenerator /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/invoice-list"
              element={
                isLoggedIn ? (
                  <Suspense fallback={<div>Loading invoices...</div>}>
                    <InvoiceList />
                  </Suspense>
                ) : (
                  <Navigate to="/login" />
                )
                }
            />
          <Route
            path="/invoice-update"
            element={
              isLoggedIn ?
              (
                <Suspense fallback={<div>Loading invoices...</div>}>
               <InvoiceUpdate /> 
               </Suspense>
                ) : ( <Navigate to="/login" />)
            }
          />
          <Route
            path="/invoice-edit/:id"
            element={
              isLoggedIn ? <InvoiceEdit /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/add-employee"
            element={
              isLoggedIn ? <AddEmployee /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/employee-list"
            element={
              isLoggedIn ? <EmployeeList /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/add-College"
            element={
              isLoggedIn ? <AddCollege /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/college-list"
            element={
              isLoggedIn ? <CollegeList /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/add-vendor"
            element={
              isLoggedIn ? <AddVendors /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/vendor-list"
            element={
              isLoggedIn ? <VendorList /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/add-tds"
            element={
              isLoggedIn ? <AddTds /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/tds-list"
            element={
              isLoggedIn ? <TdsList /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/add-ledger"
            element={
              isLoggedIn ? <AddLedger /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/ledger-list"
            element={
              isLoggedIn ? <LedgerList /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/invoice-summary"
            element={
              isLoggedIn ? <InvoiceSummary /> : <Navigate to="/login" />
            }
          />
        </Routes>
        {isLoggedIn && !isLoginPage && <Footer />}
        </Box>
       
        </Box>
        
    
  );
};

export default App;
