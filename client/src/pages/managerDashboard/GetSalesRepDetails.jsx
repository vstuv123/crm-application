
import { Box, Button, Typography } from '@mui/material'
import MetaData from "../../components/layout/MetaData"
import { useParams, useNavigate } from 'react-router-dom';
import { useGetSalesRepDetailsQuery } from '../../store/slices/userSlice';
import Loader from '../../components/layout/Loader';

const GetSalesRepDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {data, isLoading} = useGetSalesRepDetailsQuery(id);

    if (isLoading || !data) {
        return <Loader />;
    }

    const managerData = data?.managerName ? data.managerName : "None"

    const date = new Date(data?.user?.createdAt);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const handleGoBack = () => {
        navigate(`/manager/dashboard/sales-team`);
    }
  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <MetaData title={"CRM - Sales Rep Details MANAGER"} />
      <Box sx={{ mt: 15, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src="https://images.freeimages.com/fic/images/icons/2443/bunch_of_cool_bluish_icons/512/info_user.png" alt="userDetails" width={350} height={360} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ backgroundColor: "#fff", height: "100%", width: {md: "420px", sm: "400px", xs: "370px"}, mt: { md: 15, sm: 25, xs: 25} }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>Sales Rep Details</h1>
                <Typography sx={{ml: 8}}><strong>SalesRepId:</strong>&nbsp;&nbsp;&nbsp;{data?.user?._id}</Typography>
                <Typography sx={{ml: 8}}><strong>Name:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data?.user?.name}</Typography>
                <Typography sx={{ml: 8}}><strong>Email:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data?.user?.email}</Typography>
                <Typography sx={{ml: 8}}><strong>Contact:</strong>&nbsp;&nbsp;&nbsp;{data?.user?.contact}</Typography>
                <Typography sx={{ml: 8}}><strong>Role:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data?.user?.role}</Typography>
                <Typography sx={{ml: 8}}><strong>Joined On:</strong>&nbsp;&nbsp;&nbsp;{formattedDate}</Typography>
                <Typography sx={{ml: 8}}><strong>AssignedTo:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{managerData}</Typography>
                <Button onClick={handleGoBack} sx={{ ml: 5, mb: 3, width: "80%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"} }} >Go Back</Button>
            </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default GetSalesRepDetails

