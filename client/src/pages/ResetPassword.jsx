import { Box, Button, TextField } from '@mui/material'
import { useState } from 'react'
import MetaData from '../components/layout/MetaData';
import { useResetPasswordMutation } from '../store/slices/userSlice';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';


const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const navigate = useNavigate();
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { token, password, confirmPassword };
        try {
          toast.loading("loading...", { id: "reset" });
          await resetPassword(userData).unwrap();
          navigate("/login");
          toast.success("Password has been changed successfully", { id: "reset" });
        } catch (error) {
          let message = error.data.message;
          const parts = message.split(':');
          if (parts.length === 1) {
            message = parts[0]?.trim();
          }
          if (parts.length === 2) {
              message = parts[1]?.trim();
          }
          if (parts.length > 2) {
            message = parts.slice(2).join(':').trim();
          }
          toast.error(message, { id: "reset" });
        }
    }
  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <MetaData title={"CRM - RESET_PASSWORD"} />
      <Box sx={{ mt: 15, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src="https://png.pngtree.com/png-clipart/20230522/original/pngtree-reset-password-png-image_9167196.png" alt="reset" height={380} width={400} />
      </Box>
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <form onSubmit={handleSubmit}>
      <Box sx={{ backgroundColor: "#fff", height: "385px", width: {md: "400px", sm: "400px", xs: "370px"}, mt: { md: 17, sm: 30, xs: 30} }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "46px" }}>
              <h1 className='heading' style={{ color: "#2C3E50" }}>Reset Password</h1>
              <TextField type='password' value={password} label="Password" sx={{ ml: 2, width: "90%"}} onChange={(e) => setPassword(e.target.value)} required ></TextField>
              <TextField type='password' value={confirmPassword} label="Confirm Password" sx={{ ml: 2, width: "90%"}} onChange={(e) => setConfirmPassword(e.target.value)} required ></TextField>
              <Button type='submit' sx={{ ml: 2, width: "90%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"} }} >{isLoading ? "Loading..." : "Reset Password"}</Button>
          </Box>
      </Box>
      </form>
    </Box>
  </Box>
  )
}

export default ResetPassword
