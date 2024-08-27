import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/updateProfile";
import UpdatePassword from "./pages/UpdatePassword";
import NotFound from "./components/layout/NotFound";
import { useEffect } from "react";
import { useAuth } from "./context/userContext";
import ProtectedRoute from "./route/ProtectedRoute";
import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import Dashboard from "./pages/adminDashboard/Dashboard";
import CreateUser from "./pages/adminDashboard/CreateUser";
import GetAllUsers from "./pages/adminDashboard/GetAllUsers";
import UpdateUser from "./pages/adminDashboard/UpdateUser";
import GetUserDetails from "./pages/adminDashboard/GetUserDetails";
import ManagerDashboard from "./pages/managerDashboard/managerDashboard";
import CreateLead from "./pages/managerDashboard/CreateLead";
import GetUnArchivedLeads from "./pages/managerDashboard/GetUnArchivedLeads";
import GetArchivedLeads from "./pages/managerDashboard/GetArchivedLeads";
import GetLeadDetails from "./pages/managerDashboard/GetLeadDetails";
import GetPendingLeads from "./pages/managerDashboard/GetPendingLeads";
import UpdateLead from "./pages/managerDashboard/UpdateLead";
import CreateCustomer from "./pages/managerDashboard/CreateCustomer";
import GetUnArchivedCustomers from "./pages/managerDashboard/GetUnArchivedCustomers";
import GetArchivedCustomers from "./pages/managerDashboard/GetArchivedCustomers";
import GetPendingCustomers from "./pages/managerDashboard/GetPendingCustomers";
import GetCustomerDetails from "./pages/managerDashboard/GetCustomerDetails";
import UpdateCustomer from "./pages/managerDashboard/UpdateCustomer";
import GetSalesTeam from "./pages/managerDashboard/GetSalesTeam";
import GetSalesRepDetails from "./pages/managerDashboard/GetSalesRepDetails";
import GetCustomersOfSalesRep from "./pages/managerDashboard/GetCustomersOfSaleRep";
import GetLeadsOfSalesRep from "./pages/managerDashboard/GetLeadsOfSalesRep";
import GetArchivedCustomersAdmin from "./pages/adminDashboard/GetArchivedCustomersAdmin";
import GetUnArchivedCustomersAdmin from "./pages/adminDashboard/GetUnArchivedCustomersAdmin";
import GetCustomerDetailsAdmin from "./pages/adminDashboard/GetCustomerDetailsAdmin";
import SalesRepDashboard from "./pages/salesRepDashboard/SalesRepDashboard";
import CreateLeadRep from "./pages/salesRepDashboard/CreateLeadRep";
import UnArchivedLeadsSales from "./pages/salesRepDashboard/UnArchivedLeadsSales";
import ArchivedLeadsSales from "./pages/salesRepDashboard/ArchivedLeadsSales";
import LeadDetailsSales from "./pages/salesRepDashboard/LeadDetailsSales";
import UpdateLeadSales from "./pages/salesRepDashboard/UpdateLeadSales";
import CreateCustomerSales from "./pages/salesRepDashboard/CreateCustomerSales";
import UnArchivedCustomers from './pages/salesRepDashboard/UnArchivedCustomers';
import ArchivedCustomers from "./pages/salesRepDashboard/ArchivedCustomers";
import CustomerDetails from "./pages/salesRepDashboard/CustomerDetails";
import UpdateCustomerSales from "./pages/salesRepDashboard/UpdateCustomerSales";
import GetAllSales from "./pages/salesRepDashboard/GetAllSales";
import GetManagerDetails from "./pages/salesRepDashboard/GetManagerDetails";
import CreateOpportunity from "./pages/salesRepDashboard/CreateOpportunity";
import NonArchivedOpportunities from "./pages/salesRepDashboard/NonArchivedOpportunities";
import ArchivedOpportunities from "./pages/salesRepDashboard/ArchivedOpportunities";
import GetOpportunityDetails from "./pages/salesRepDashboard/GetOpportunityDetails";
import UpdateOpportunity from "./pages/salesRepDashboard/UpdateOpportunity";
import OpportunitiesOfSingleLead from "./pages/salesRepDashboard/OpportunitiesOfSingleLead";
import CreateSale from "./pages/salesRepDashboard/CreateSale";
import GetSaleDetails from "./pages/salesRepDashboard/GetSaleDetails";
import UpdateSale from "./pages/salesRepDashboard/UpdateSale";
import SalesOfSingleCustomer from "./pages/salesRepDashboard/SalesOfSingleCustomer";
import AllSales from "./pages/managerDashboard/AllSales";
import AllSalesAdmin from "./pages/adminDashboard/AllSalesAdmin";
import GetSalesOfSalesRep from "./pages/managerDashboard/GetSalesOfSalesRep";
import CreateTask from "./pages/CreateTask";
import GetAllTasks from "./pages/GetAllTasks";
import UpdateTask from "./pages/UpdateTask";
import GetTaskDetails from './pages/GetTaskDetails';
import CreateCustomerLog from "./pages/salesRepDashboard/CreateCustomerLog";
import GetAllLogs from "./pages/salesRepDashboard/GetAllLogs";
import GetCustomerLogDetails from "./pages/salesRepDashboard/GetCustomerLogDetails";
import UpdateLog from "./pages/salesRepDashboard/UpdateLog";
import GetLogsOfCustomer from "./pages/salesRepDashboard/GetLogsOfCustomer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function App() {
  const { setAuth, setIsAuthenticated, setLoading } = useAuth();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      const user = storedUser ? JSON.parse(storedUser) : null;
      const token = storedToken || null;

      if (user && token) {
        setAuth({ user, token });
        setIsAuthenticated(true);
      } else {
        setAuth({ user: null, token: null });
        setIsAuthenticated(false);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      setAuth({ user: null, token: null });
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, [setAuth, setIsAuthenticated, setLoading]);

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/update" element={<UpdateProfile />} />
          <Route path="/password/update" element={<UpdatePassword />} />
          <Route path="/dashboard/create-task" element={<CreateTask />} />
          <Route path="/dashboard/all-tasks" element={<GetAllTasks />} />
          <Route path="/dashboard/update-task/:id" element={<UpdateTask />} />
          <Route path="/dashboard/task-details/:id" element={<GetTaskDetails />} />
          <Route path="/dashboard/sale-details/:id" element={<GetSaleDetails />} />

          {/* Admin-specific routes */}
          <Route
            path="/admin/dashboard/"
            element={<ProtectedRoute isAdmin={true} />}
          >
            <Route path="" element={<AdminDashboard />} />
            <Route path="create-user" element={<CreateUser />} />
            <Route path="all-users" element={<GetAllUsers />} />
            <Route path="all-sales" element={<AllSalesAdmin />} />
            <Route path="update-user/:id" element={<UpdateUser />} />
            <Route path="user-details/:id" element={<GetUserDetails />} />
            <Route path="customers/un-archived" element={<GetUnArchivedCustomersAdmin />} />
            <Route path="customers/archived" element={<GetArchivedCustomersAdmin />} />
            <Route path="customer-details/:id" element={<GetCustomerDetailsAdmin />} />
          </Route>

           {/* Manager-specific routes */}
           <Route
            path="/manager/dashboard/"
            element={<ProtectedRoute isManager={true} isAdmin={true} />}
          >
            <Route path="" element={<ManagerDashboard />} />
            <Route path="create-lead" element={<CreateLead />} />
            <Route path="create-customer" element={<CreateCustomer />} />
            <Route path="all-unarchived-leads" element={<GetUnArchivedLeads />} />
            <Route path="all-unarchived-customers" element={<GetUnArchivedCustomers />} />
            <Route path="all-sales" element={<AllSales />} />
            <Route path="all-archived-leads" element={<GetArchivedLeads />} />
            <Route path="all-archived-customers" element={<GetArchivedCustomers />} />
            <Route path="all-pending-leads" element={<GetPendingLeads />} />
            <Route path="all-pending-customers" element={<GetPendingCustomers />} />
            <Route path="lead-details/:id" element={<GetLeadDetails />} />
            <Route path="customer-details/:id" element={<GetCustomerDetails />} />
            <Route path="update-lead/:id" element={<UpdateLead />} />
            <Route path="update-customer/:id" element={<UpdateCustomer />} />
            <Route path="sales-team" element={<GetSalesTeam />} />
            <Route path="sales-rep-details/:id" element={<GetSalesRepDetails />} />
            <Route path="customers/sales-rep" element={<GetCustomersOfSalesRep />} />
            <Route path="leads/sales-rep" element={<GetLeadsOfSalesRep />} />
            <Route path="sales/sales-rep" element={<GetSalesOfSalesRep />} />
          </Route>

        {/* SalesRep-specific routes */}
        <Route
            path="/sales/dashboard/"
            element={<ProtectedRoute isSalesRepresentative={true} isAdmin={true} />}
          >
            <Route path="" element={<SalesRepDashboard />} />
            <Route path="create-lead" element={<CreateLeadRep />} />
            <Route path="create-customer" element={<CreateCustomerSales />} />
            <Route path="create-opportunity" element={<CreateOpportunity />} />
            <Route path="create-sale" element={<CreateSale />} />
            <Route path="create-logs" element={<CreateCustomerLog />} />
            <Route path="all-unarchived-leads" element={<UnArchivedLeadsSales />} />
            <Route path="all-unarchived-customers" element={<UnArchivedCustomers />} />
            <Route path="all-unarchived-opportunities" element={<NonArchivedOpportunities />} />
            <Route path="all-sales" element={<GetAllSales />} />
            <Route path="all-logs" element={<GetAllLogs />} />
            <Route path="all-archived-leads" element={<ArchivedLeadsSales />} />
            <Route path="all-archived-customers" element={<ArchivedCustomers />} />
            <Route path="all-archived-opportunities" element={<ArchivedOpportunities />} />
            <Route path="lead-details/:id" element={<LeadDetailsSales />} />
            <Route path="customer-details/:id" element={<CustomerDetails />} />
            <Route path="opportunity-details/:id" element={<GetOpportunityDetails />} />
            <Route path="log-details/:id" element={<GetCustomerLogDetails />} />
            <Route path="update-lead/:id" element={<UpdateLeadSales />} />
            <Route path="update-customer/:id" element={<UpdateCustomerSales />} />
            <Route path="update-opportunity/:id" element={<UpdateOpportunity />} />
            <Route path="update-sale/:id" element={<UpdateSale />} />
            <Route path="update-log/:id" element={<UpdateLog />} />
            <Route path="opportunities/lead" element={<OpportunitiesOfSingleLead />} />
            <Route path="sales/customer" element={<SalesOfSingleCustomer />} />
            <Route path="logs/customer" element={<GetLogsOfCustomer />} />
            <Route path="manager-details" element={<GetManagerDetails />} />
          </Route>
        </Route>
      </Routes>

      
    </div>
  );
}

export default App;
