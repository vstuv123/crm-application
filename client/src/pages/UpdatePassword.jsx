import { Box, Button, TextField } from '@mui/material'
import { useState } from 'react';
import updatePassword from '../images/updatePassword.png';
import MetaData from '../components/layout/MetaData';
import { useUpdatePasswordUserMutation } from '../store/slices/userSlice';
import toast from 'react-hot-toast';
import { useAuth } from '../context/userContext';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {
    const [updatePasswordUser, { isLoading }] = useUpdatePasswordUserMutation();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { oldPassword, newPassword, confirmPassword };
        try {
          toast.loading("updating...", { id: "updatePassword" })
          const response = await updatePasswordUser(userData).unwrap();
          setAuth({ user: response?.user, token: response?.token });

          localStorage.setItem("user", JSON.stringify(response?.user));
          localStorage.setItem("token", response?.token);
          navigate('/profile');

          toast.success("Password updated successfully", { id: "updatePassword" });
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
          toast.error(message, { id: "updatePassword" });
        }
    }
  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <MetaData title={"CRM - UPDATE PASSWORD"} />
      <Box sx={{ mt: 15, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src={updatePassword} alt="updatePassword" width={380} height={380} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <form onSubmit={handleSubmit}>
        <Box sx={{ backgroundColor: "#fff", height: "420px", width: {md: "360px", sm: "360px", xs: "350px"}, mt: { md: 15, sm: 26, xs: 30} }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "37px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>Update Password</h1>
                <TextField type='password' value={oldPassword} label="Old Password" sx={{ ml: 2, width: "90%"}} onChange={(e) => setOldPassword(e.target.value)} required placeholder='Enter your Old Password here' ></TextField>
                <TextField type='password' value={newPassword} label="New Password" sx={{ ml: 2, width: "90%"}} onChange={(e) => setNewPassword(e.target.value)} required placeholder='Enter your New Password here' ></TextField>
                <TextField type='password' value={confirmPassword} label="Confirm Password" sx={{ ml: 2, width: "90%"}} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder='Enter your Confirm Password here' ></TextField>
                <Button type='submit' sx={{ ml: 2, width: "90%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"} }}>{ isLoading ? "Updating..." : "Update Password"}</Button>
            </Box>
        </Box>
        </form>
      </Box>
    </Box>
  )
}

export default UpdatePassword
