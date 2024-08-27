import { Box, Button, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import MetaData from '../components/layout/MetaData';
import { useLoginUserMutation } from '../store/slices/userSlice';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/userContext';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginUser, { isLoading }] = useLoginUserMutation();
    const navigate = useNavigate();
    const { setAuth, setIsAuthenticated } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { email, password };
        try {
            toast.loading("Logging In", {id: "login"});
            const response = await loginUser(userData).unwrap();

            setAuth({ user: response?.user, token: response?.token });
            setIsAuthenticated(true);

            localStorage.setItem("user", JSON.stringify(response?.user));
            localStorage.setItem("token", response?.token);

            navigate("/profile");
            toast.success("Login successful", {id: "login"})
        } catch (err) {
          toast.error(err.data.message || "Login Failed", {id: "login"});
        }
    }

  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <MetaData title={"CRM - LOGIN PAGE"} />
      <Box sx={{ mt: 15, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src="https://png.pngtree.com/png-vector/20191003/ourmid/pngtree-user-login-or-authenticate-icon-on-gray-background-flat-icon-ve-png-image_1786166.jpg" alt="login" />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <form onSubmit={handleSubmit}>
        <Box sx={{ backgroundColor: "#fff", height: "400px", width: {md: "400px", sm: "400px", xs: "370px"}, mt: { md: 15, sm: 30, xs: 30} }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "46px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>Login Page</h1>
                <TextField type='email' value={email} label="Email" sx={{ ml: 2, width: "90%"}} onChange={(e) => setEmail(e.target.value)} required ></TextField>
                <TextField type='password' value={password} label="Password" sx={{ ml: 2, width: "90%"}} onChange={(e) => setPassword(e.target.value)} required ></TextField>
                <Button type='submit' sx={{ ml: 2, width: "90%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"} }} >{isLoading ? "Logging In..." : "Login"}</Button>
            </Box>
            <Link style={{ textDecoration: "none" }} to="/forgot-password">
                <Typography sx={{ mt: "20px", ml: "250px", color: "#878787", fontSize: "14px"}}>
                    Forgot Password
                </Typography>
            </Link>
        </Box>
        </form>
      </Box>
    </Box>
  )
}

export default Login
