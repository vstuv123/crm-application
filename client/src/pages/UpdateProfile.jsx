import { Box, Button, TextField } from '@mui/material'
import { useState } from 'react'
import MetaData from '../components/layout/MetaData';
import { useUpdateProfileUserMutation } from '../store/slices/userSlice';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/userContext';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
    const { auth, setAuth } = useAuth();
    const [name, setName] = useState(auth?.user?.name);
    const [email, setEmail] = useState(auth?.user?.email);
    const [contact, setContact] = useState(auth?.user?.contact);
    const [updateProfileUser, { isLoading }] = useUpdateProfileUserMutation();
    const navigate = useNavigate();

    function preventE(event) {
      if (event.key === 'e' || event.key === 'E') {
        event.preventDefault();
      }
    }
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { name, email, contact: contact.toString() };
        try {
          toast.loading("updating...", { id: "updateUserProfile" });
          const response = await updateProfileUser(userData).unwrap();

          setAuth((prevAuth) => ({ ...prevAuth, user: response.updatedUser }));
          localStorage.setItem("user", JSON.stringify(response?.updatedUser));
          navigate("/profile");

          toast.success(response?.message, { id: "updateUserProfile" });
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
          toast.error(message, { id: "updateUserProfile" });
        }
    }
  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <MetaData title={"CRM - UPDATE PROFILE"} />
      <Box sx={{ mt: 15, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa60dw4Lt7ZWggNI0X_skqJxXASme0GVLAFg&s" alt="updateProfile" width={360} height={370} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <form onSubmit={handleSubmit}>
        <Box sx={{ backgroundColor: "#fff", height: "420px", width: {md: "400px", sm: "400px", xs: "370px"}, mt: { md: 15, sm: 30, xs: 30} }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "35px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>Update Profile</h1>
                <TextField type='text' value={name} label="Name" sx={{ ml: 2, width: "90%"}} onChange={(e) => setName(e.target.value)} required ></TextField>
                <TextField type='email' value={email} label="Email" sx={{ ml: 2, width: "90%"}} onChange={(e) => setEmail(e.target.value)} required ></TextField>
                <TextField type='number' value={contact} label="Contact" sx={{ ml: 2, width: "90%"}} onChange={(e) => setContact(e.target.value)} onKeyDown={(event) => preventE(event)} required ></TextField>
                <Button type='submit' sx={{ ml: 2, width: "90%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"} }} >{isLoading ? "Updating...": "Update Profile"}</Button>
            </Box>
        </Box>
        </form>
      </Box>
    </Box>
  )
}

export default UpdateProfile
