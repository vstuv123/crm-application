import { Box, AppBar, Toolbar, styled, Menu, MenuItem } from '@mui/material';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useLogoutUserMutation } from '../store/slices/userSlice';
import toast from 'react-hot-toast';
import { useAuth } from '../context/userContext';

const Nav = styled(AppBar)`
  background-color: #2C3E50;
  color: #ffffff;
`

const Header = () => {
  const navigate = useNavigate();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  const [anchorE1, setAnchorE1] = useState(null);
  const open = Boolean(anchorE1);
  const { isAuthenticated, setIsAuthenticated, setAuth, auth } = useAuth();

  const handleClick = (event) => {
    setAnchorE1(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorE1(null);
  };
  const handleLogout = async () => {
    try {
      if (isLoading) {
        toast.loading("Logging out...", { id: "Logout" });
      }
      await logoutUser().unwrap();
      setAuth({ user: null, token: null });
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      toast.success("Logout successful", { id: "Logout" });
      navigate('/login', { replace: true });

    } catch (error) {
      toast.error(error.data.message || "Logout Failed", { id: "Logout" });
    }
  }

  return (
    <Box sx={{width: "100%", height: "100%"}}>
      <Box>
        <Nav>
          <Toolbar sx={{ display: "flex", justifyContent: {md: "space-between", sm: "space-between", xs: "center"} }}>
            <Box sx={{ display: {xs: "block", sm: 'none', md: "none"}, mr: {xs: "auto"}}}>
              <MenuIcon onClick={handleClick} sx={{ color: "white" }} />
              <Menu
                id="basic-menu"
                open={open}
                onClose={handleClose}
                anchorEl={anchorE1}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                {
                  isAuthenticated ? (
                    <button onClick={handleLogout} style={{ cursor: "pointer", border: "none", padding: "12px 0", background: "transparent", outline: "none" }} className='link'><MenuItem onClick={handleLogout}>Logout</MenuItem></button>
                  ) : (
                    <Link to='/login' className="link"><MenuItem onClick={handleClose}>Login</MenuItem></Link>
                  )
                }
                <Link to={auth?.user?.role === "Admin" ? "/admin/dashboard" : auth?.user?.role === "Manager" ? "/manager/dashboard" : auth?.user?.role === "Sales Representative" ? "/sales/dashboard": "/dashboard"} className="link"><MenuItem onClick={handleClose}>Dashboard</MenuItem></Link>
                <Link to='/profile' className="link"><MenuItem onClick={handleClose}>Profile</MenuItem></Link>
              </Menu>
            </Box>
            <Box sx={{ mr: {sm: "none", xs: "auto"} }} >
              <Link style={{ textDecoration: "none" }} to="/">
                <h1 className="heading" >CRM APP</h1>
              </Link>
            </Box>
            <Box sx={{ color: "white", display: {sm: "block", xs: "none"} }}>
              {
                isAuthenticated ? (
                  <button onClick={handleLogout} style={{ cursor: "pointer", border: "none", fontSize: "16px"}} className='nav-link'>
                    Logout
                  </button>
                ) : (
                  <Link to="/login" className='nav-link'>
                    Login
                  </Link>
                )
              }
              <Link to={auth?.user?.role === "Admin" ? "/admin/dashboard" : auth?.user?.role === "Manager" ? "/manager/dashboard" : auth?.user?.role === "Sales Representative" ? "/sales/dashboard": "/dashboard"} className='nav-link'>
                Dashboard
              </Link>
              <Link to="/profile" className='nav-link'>
                Profile
              </Link>
            </Box>
          </Toolbar>
        </Nav>
      </Box>
    </Box>
  )
}

export default Header
