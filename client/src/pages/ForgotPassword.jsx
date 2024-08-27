import { Box, Button, TextField } from '@mui/material'
import { useState } from 'react';
import MetaData from '../components/layout/MetaData';
import { useForgotPasswordMutation } from '../store/slices/userSlice';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { email };
        try {
          toast.loading("Loading...", { id: "forgot" });
          const response = await forgotPassword(userData).unwrap();
          toast.success(response.message, { id: "forgot" });
        } catch (error) {
          toast.error(error.data.message || "Something went wrong. Try Again", { id: "forgot" })
        }
    }
  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <MetaData title={"CRM - FORGOT PASSWORD"} />
      <Box sx={{ mt: 20, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNJYoK_aGB835iYlTw5mEpaWUTRkO5C7atXA&s" alt="forgot" width={350} height={300} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <form onSubmit={handleSubmit}>
        <Box sx={{ backgroundColor: "#fff", height: "300px", width: {md: "360px", sm: "360px", xs: "350px"}, mt: { md: 20, sm: 32, xs: 32} }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "46px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>Forgot Password</h1>
                <TextField type='email' value={email} label="Email" sx={{ ml: 2, width: "90%"}} onChange={(e) => setEmail(e.target.value)} required placeholder='Enter your Email here' ></TextField>
                <Button type='submit' sx={{ ml: 2, width: "90%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"} }}>{isLoading ? "Loading..." : "Forgot Password" }</Button>
            </Box>
        </Box>
        </form>
      </Box>
    </Box>
  )
}

export default ForgotPassword
