import { Box, Drawer, IconButton } from "@mui/material";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { Link } from "react-router-dom";
import MetaData from "../../components/layout/MetaData";
import { useState } from "react";
import Dashboard from "./Dashboard";
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import SvgIcon from '@mui/material/SvgIcon';
import AppsIcon from '@mui/icons-material/Apps';
import SaleReportsAdmin from "./SaleReportsAdmin";
import CustomerReportsAdmin from "./CustomerReportsAdmin";

function CloseSquare(props) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

const AdminDashboard = () => {
  const [selectedComponent, setSelectedComponent] = useState('Dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const DrawerList = (
      <Box
        sx={{
          height: "90vh",
          width: {md: 0, sm: "80%", xs: "80%"},
          display: { md: "none", sm: "flex", xs: "flex" },
          flexDirection: "column",
          backgroundColor: "white",
          borderLeft: "2px solid #878787",
          color: "black",
        }}
      >
      
        <Box sx={{ mt: 2 }}>
          <h1
            className="heading"
            style={{ color: "#2C3E50", fontSize: "30px", textAlign: "center" }}
          >
            CRM ADMIN ROUTES
          </h1>
        </Box>
        <Box sx={{ height: "73vh", minWidth: 250, mt: 3, overflowY: "auto" }}>
          <SimpleTreeView
            defaultExpandedItems={['tree-view']}
            slots={{
              expandIcon: AddBoxIcon,
              collapseIcon: IndeterminateCheckBoxIcon,
              endIcon: CloseSquare,
            }}
          >
          <h1 className="heading"
            style={{ color: "#2C3E50", fontSize: "25px", textAlign: "start", marginLeft: "4px" }}>Admin Dashboard</h1>
            <TreeItem itemId="tree-view" label="Dashboard" sx={{ fontFamily: "Roboto", color: "#2C3E50", fontWeight: "500" }} onClick={() => setSelectedComponent('Dashboard')} />
            <TreeItem itemId="tree-nice" label="Sale Reports" sx={{ fontFamily: "Roboto", color: "#2C3E50", fontWeight: "500" }} onClick={() => setSelectedComponent('Sales')} />
            <TreeItem itemId="tree-better" label="Customer Reports" sx={{ fontFamily: "Roboto", color: "#2C3E50", fontWeight: "500", mb: 2 }} onClick={() => setSelectedComponent('Customers')} />
            <h1 className="heading"
            style={{ color: "#2C3E50", fontSize: "25px", textAlign: "start", marginLeft: "4px" }}>Users Management</h1>
            <TreeItem itemId="grid" label="Users" sx={{ color: "#000", mb: 2 }}>
              <Link style={{ textDecoration: "none", color: "inherit" }} to="/admin/dashboard/create-user" ><TreeItem itemId="grid-community" label="Create New User" /></Link>
              <Link style={{ textDecoration: "none", color: "inherit" }} to="/admin/dashboard/all-users" >
                <TreeItem itemId="grid-pro" label="All Users" />
              </Link>
            </TreeItem>
            <h1 className="heading"
            style={{ color: "#2C3E50", fontSize: "25px", textAlign: "start", marginLeft: "4px" }}>Customers Management</h1>
            <TreeItem itemId="pickers" label="Customers" sx={{ fontFamily: "Roboto", color: "#2C3E50", fontWeight: "500", mb: 2 }}>
              <Link to="/admin/dashboard/customers/un-archived" style={{ textDecoration: "none", color: "inherit" }}>
                <TreeItem
                itemId="pickers-community"
                label="UnArchived Customers"
                />
              </Link>
              <Link to="/admin/dashboard/customers/archived" style={{ textDecoration: "none", color: "inherit" }} ><TreeItem itemId="pickers-pro" label="Archived Customers" /></Link>
            </TreeItem>
            <h1 className="heading"
            style={{ color: "#2C3E50", fontSize: "25px", textAlign: "start", marginLeft: "4px" }}>Sales Details</h1>
            <TreeItem itemId="europe" label="Sales" sx={{ fontFamily: "Roboto", color: "#2C3E50", fontWeight: "500", mb: 2 }}>

              <Link to="/admin/dashboard/all-sales" style={{ textDecoration: "none", color: "inherit" }}>
                <TreeItem
                itemId="europe-community"
                label="All Sales"
                />
              </Link>
            </TreeItem>
            <h1 className="heading"
            style={{ color: "#2C3E50", fontSize: "25px", textAlign: "start", marginLeft: "4px" }}>Tasks Management</h1>
            <TreeItem itemId="flex" label="Tasks" sx={{ color: "#000", mb: 2 }}>
              <Link style={{ textDecoration: "none", color: "inherit" }} to="/dashboard/create-task" ><TreeItem itemId="flex-community" label="Create New Task" /></Link>
              <Link style={{ textDecoration: "none", color: "inherit" }} to="/dashboard/all-tasks" >
                <TreeItem itemId="flex-pro" label="All Tasks" />
              </Link>
            </TreeItem>
          </SimpleTreeView>
        </Box>
      </Box>
  );

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Sales':
        return <SaleReportsAdmin />;
      case 'Customers':
        return <CustomerReportsAdmin />;
      default:
        return <Dashboard />;
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        gap: "2px",
        height: "100%",
        width: "100%",
        marginTop: "66px",
      }}
    >
      <MetaData title={"CRM - ADMIN DASHBOARD"} />
      <Box
        sx={{
          height: {xl: "90vh", lg: "87vh", md: "87vh"},
          width: {md: "28%", sm: 0, xs: 0},
          display: { md: "flex", sm: "none", xs: "none" },
          flexDirection: "column",
          backgroundColor: "white",
          borderLeft: "2px solid #878787",
          color: "black",
        }}
      >
        <Box sx={{ mt: 2 }}>
          <h1
            className="heading"
            style={{ color: "#2C3E50", fontSize: "30px" }}
          >
            CRM ADMIN ROUTES
          </h1>
        </Box>
        <Box sx={{ height: "100%", minWidth: 250, mt: 3, overflowY: "auto" }}>
          <SimpleTreeView
            defaultExpandedItems={['tree-view']}
            slots={{
              expandIcon: AddBoxIcon,
              collapseIcon: IndeterminateCheckBoxIcon,
              endIcon: CloseSquare,
            }}
          >
          <h1 className="heading"
            style={{ color: "#2C3E50", fontSize: "25px", textAlign: "start", marginLeft: "4px" }}>Admin Dashboard</h1>
            <TreeItem itemId="tree-view" label="Dashboard" sx={{ fontFamily: "Roboto", color: "#2C3E50", fontWeight: "500" }} onClick={() => setSelectedComponent('Dashboard')} />
            <TreeItem itemId="tree-nice" label="Sale Reports" sx={{ fontFamily: "Roboto", color: "#2C3E50", fontWeight: "500" }} onClick={() => setSelectedComponent('Sales')} />
            <TreeItem itemId="tree-better" label="Customer Reports" sx={{ fontFamily: "Roboto", color: "#2C3E50", fontWeight: "500", mb: 2 }} onClick={() => setSelectedComponent('Customers')} />
            <h1 className="heading"
            style={{ color: "#2C3E50", fontSize: "25px", textAlign: "start", marginLeft: "4px" }}>Users Management</h1>
            <TreeItem itemId="grid" label="Users" sx={{ color: "#000", mb: 2 }}>
              <Link style={{ textDecoration: "none", color: "inherit" }} to="/admin/dashboard/create-user" ><TreeItem itemId="grid-community" label="Create New User" /></Link>
              <Link style={{ textDecoration: "none", color: "inherit" }} to="/admin/dashboard/all-users" >
                <TreeItem itemId="grid-pro" label="Get All Users" />
              </Link>
            </TreeItem>
            <h1 className="heading"
            style={{ color: "#2C3E50", fontSize: "25px", textAlign: "start", marginLeft: "4px" }}>Customers Management</h1>
            <TreeItem itemId="pickers" label="Customers" sx={{ fontFamily: "Roboto", color: "#2C3E50", fontWeight: "500", mb: 2 }}>
              <Link to="/admin/dashboard/customers/un-archived" style={{ textDecoration: "none", color: "inherit" }}>
                <TreeItem
                itemId="pickers-community"
                label="UnArchived Customers"
                />
              </Link>
              <Link to="/admin/dashboard/customers/archived" style={{ textDecoration: "none", color: "inherit" }} ><TreeItem itemId="pickers-pro" label="Archived Customers" /></Link>
            </TreeItem>
            <h1 className="heading"
            style={{ color: "#2C3E50", fontSize: "25px", textAlign: "start", marginLeft: "4px" }}>Sales Details</h1>
            <TreeItem itemId="europe" label="Sales" sx={{ fontFamily: "Roboto", color: "#2C3E50", fontWeight: "500", mb: 2 }}>

              <Link to="/admin/dashboard/all-sales" style={{ textDecoration: "none", color: "inherit" }}>
                <TreeItem
                itemId="europe-community"
                label="All Sales"
                />
              </Link>
            </TreeItem>
            <h1 className="heading"
            style={{ color: "#2C3E50", fontSize: "25px", textAlign: "start", marginLeft: "4px" }}>Tasks Management</h1>
            <TreeItem itemId="flex" label="Tasks" sx={{ color: "#000", mb: 2 }}>
              <Link style={{ textDecoration: "none", color: "inherit" }} to="/dashboard/create-task" ><TreeItem itemId="flex-community" label="Create New Task" /></Link>
              <Link style={{ textDecoration: "none", color: "inherit" }} to="/dashboard/all-tasks" >
                <TreeItem itemId="flex-pro" label="All Tasks" />
              </Link>
            </TreeItem>
          </SimpleTreeView>
        </Box>
      </Box>

      <Box sx={{ position: 'absolute', top: '67px', left: '6px', zIndex: 1000, display: {md: "none", sm: "block", xs: "block"} }}>
      <IconButton onClick={toggleDrawer(true)}>
        <AppsIcon sx={{ cursor: 'pointer', backgroundColor: "black", color: "white" }} />
      </IconButton>
      </Box>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
      <Box sx={{ height: { xl: "90vh", md: "87vh", sm: "96vh", xs: "96vh"}, overflowX: "auto", width: { md: "72%", sm: "100%", xs: "100%" } }}>
        {renderComponent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
