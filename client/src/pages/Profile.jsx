import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import MetaData from '../components/layout/MetaData';
import { useAuth } from '../context/userContext';

const Profile = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const handleProfile = () => {
        navigate("/profile/update");
    }
    const handlePassword = () => {
        navigate("/password/update");
    }

    const date = new Date(auth?.user?.createdAt);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", flexDirection: {md: "row", sm: "column", xs: "column"}, justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <MetaData title={"CRM - MY PROFILE"} />
      <Box sx={{ mt: 15, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDMV7G1cA-1rWzQ6CHNX3_VMcvpECTE7I8Jg&s" alt="profile" width={350} height={360} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ backgroundColor: "#fff", height: "100%", width: {md: "400px", sm: "400px", xs: "370px"}, mt: { md: 15, sm: 0, xs: 0} }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>My Profile</h1>
                <Typography sx={{ml: 10}}><strong>Name:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{auth?.user?.name}</Typography>
                <Typography sx={{ml: 10}}><strong>Email:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{auth?.user?.email}</Typography>
                <Typography sx={{ml: 10}}><strong>Contact:</strong>&nbsp;&nbsp;{auth?.user?.contact}</Typography>
                <Typography sx={{ml: 10}}><strong>Role:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{auth?.user?.role}</Typography>
                <Typography sx={{ml: 10}}><strong>Joined On:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{formattedDate}</Typography>
                <Button onClick={handleProfile} sx={{ ml: 5, width: "80%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"} }} >Update Profile</Button>
                <Button onClick={handlePassword} sx={{ ml: 5, mb: 1, width: "80%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"} }} >Update Password</Button>
            </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Profile
