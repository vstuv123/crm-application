import { Box, Button, Typography } from '@mui/material'
import MetaData from "../../components/layout/MetaData"
import { useNavigate } from 'react-router-dom';
import { useGetManagerDetailsQuery } from '../../store/slices/userSlice';
import Loader from '../../components/layout/Loader';

const GetManagerDetails = () => {
    const navigate = useNavigate();
    const {data, isLoading} = useGetManagerDetailsQuery();

    if (isLoading) {
        return <Loader />;
    }

    let nameData = "";

    if (data?.managerData && data?.managerData.length > 0) {
        for (let i = 0; i < data.managerData.length; i++) {
            if (i === data.managerData.length - 1) {
                nameData = nameData + data.managerData[i].salesRepName;
            }else {
                nameData = nameData + data.managerData[i].salesRepName + ", ";
            }
        }
    } else {
        nameData = nameData + "None";
    }

    const date = new Date(data?.manager?.createdAt);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const handleGoBack = () => {
        navigate(`/sales/dashboard/`);
    }
  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <MetaData title={"CRM - Manager Details Sales Rep"} />
      {
        data?.manager !== null ? (
          <>
            <Box sx={{ mt: 15, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src="https://images.freeimages.com/fic/images/icons/2443/bunch_of_cool_bluish_icons/512/info_user.png" alt="userDetails" width={350} height={360} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ backgroundColor: "#fff", height: "100%", width: {md: "420px", sm: "400px", xs: "370px"}, mt: { md: 15, sm: 25, xs: 25} }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>Manager Details</h1>
                <Typography sx={{ml: 8}}><strong>ManagerId:</strong>&nbsp;&nbsp;&nbsp;{data?.manager?._id}</Typography>
                <Typography sx={{ml: 8}}><strong>Name:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data?.manager?.name}</Typography>
                <Typography sx={{ml: 8}}><strong>Email:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data?.manager?.email}</Typography>
                <Typography sx={{ml: 8}}><strong>Contact:</strong>&nbsp;&nbsp;&nbsp;{data?.manager?.contact}</Typography>
                <Typography sx={{ml: 8}}><strong>Role:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data?.manager?.role}</Typography>
                <Typography sx={{ml: 8}}><strong>Joined On:</strong>&nbsp;&nbsp;&nbsp;{formattedDate}</Typography>
                <Typography sx={{ml: 8}}><strong>Sales Team:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{nameData}</Typography>
                <Button onClick={handleGoBack} sx={{ ml: 5, mb: 3, width: "80%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"} }} >Go Back</Button>
            </Box>
        </Box>
      </Box>
          </>
        ) : (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh', // Full viewport height to center vertically
            textAlign: 'center', // Center the text
            padding: 2, // Add some padding
            backgroundColor: '#f5f5f5', // Optional: Light background color for better visibility
          }}>
            <Typography sx={{ fontSize: "22px", fontFamily: "Roboto", fontWeight: 600, color: "red" }}>You are not currently Assigned To any manager. Manager Details will only show when you are Assigned To a manager. Please Contact Your Admin for further details.</Typography>
          </Box>
        )
      }
    </Box>
  )
}

export default GetManagerDetails