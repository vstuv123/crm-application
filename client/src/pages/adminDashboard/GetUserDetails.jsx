
import { Box, Button, Typography } from '@mui/material'
import MetaData from "../../components/layout/MetaData"
import { useParams, useNavigate } from 'react-router-dom';
import { useGetUserDetailsAdminQuery } from '../../store/slices/userSlice';
import Loader from '../../components/layout/Loader';

const GetUserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {data, isLoading} = useGetUserDetailsAdminQuery(id);

    if (isLoading || !data) {
        return <Loader />;
    }

    let nameData = "";

    if (data?.salesTeamData && data?.salesTeamData.length > 0) {
        for (let i = 0; i < data.salesTeamData.length; i++) {
            if (i === data.salesTeamData.length - 1) {
                nameData = nameData + data.salesTeamData[i].salesRep;
            }else {
                nameData = nameData + data.salesTeamData[i].salesRep + ", ";
            }
        }
    } else {
        nameData = nameData + "None";
    }

    const managerData = data?.managerData?.manager ? data.managerData.manager : "None"

    const date = new Date(data?.user?.createdAt);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const handleUpdateUser = () => {
        navigate(`/admin/dashboard/update-user/${id}`);
    }
  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <MetaData title={"CRM - User Details ADMIN"} />
      <Box sx={{ mt: 15, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src="https://images.freeimages.com/fic/images/icons/2443/bunch_of_cool_bluish_icons/512/info_user.png" alt="userDetails" width={350} height={360} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ backgroundColor: "#fff", height: "100%", width: {md: "420px", sm: "400px", xs: "370px"}, mt: { md: 15, sm: 25, xs: 25} }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>User Details</h1>
                <Typography sx={{ml: 8}}><strong>UserId:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data?.user?._id}</Typography>
                <Typography sx={{ml: 8}}><strong>Name:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data?.user?.name}</Typography>
                <Typography sx={{ml: 8}}><strong>Email:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data?.user?.email}</Typography>
                <Typography sx={{ml: 8}}><strong>Contact:</strong>&nbsp;&nbsp;&nbsp;{data?.user?.contact}</Typography>
                <Typography sx={{ml: 8}}><strong>Role:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data?.user?.role}</Typography>
                <Typography sx={{ml: 8}}><strong>Joined On:</strong>&nbsp;&nbsp;&nbsp;{formattedDate}</Typography>
                {
                    data?.user?.role === "Admin" ? (null) :
                    data?.user?.role === "Manager" ?
                    (<Typography sx={{ml: 8}}><strong>SalesTeam:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{nameData}</Typography>) :
                    data?.user?.role === "Sales Representative" ?
                    (
                        <Typography sx={{ml: 8}}><strong>AssignedTo:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{managerData}</Typography>
                    ) : (null)
                }
                <Button onClick={handleUpdateUser} sx={{ ml: 5, mb: 3, width: "80%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"} }} >Update User</Button>
            </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default GetUserDetails
