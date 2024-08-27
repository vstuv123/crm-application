import { Box, Button, Typography } from '@mui/material'
import MetaData from "../components/layout/MetaData";
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/layout/Loader';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useGetTaskDetailsQuery } from '../store/slices/taskSlice';
import customParseFormat from 'dayjs/plugin/customParseFormat';

const GetTaskDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const {data, isLoading} = useGetTaskDetailsQuery(id);

    if (isLoading || !data) {
        return <Loader />;
    }

    dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(customParseFormat);

  function formatDateTimeFromISO(isoDateString) {
    // Parse the ISO date string into a dayjs object
    const date = dayjs(isoDateString).utc().local(); // Convert to local time if needed

    // Format the date and time as 'DD MMMM YYYY, hh:mm A'
    return date.format('DD MMMM YYYY, hh:mm A');
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

    const handleUpdateLead = () => {
        navigate(`/dashboard/update-task/${id}`);
    }
  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <MetaData title={"CRM - Task Details"} />
      <Box sx={{ mt: 15, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src="https://images.freeimages.com/fic/images/icons/2443/bunch_of_cool_bluish_icons/512/info_user.png" alt="leadDetails" width={350} height={360} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ backgroundColor: "#fff", height: "100%", width: {md: "420px", sm: "400px", xs: "370px"}, mt: { md: 15, sm: 18, xs: 20} }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>Task Details</h1>
                <Typography sx={{ml: 7}}><strong>TaskId:</strong>&nbsp;&nbsp;{data?.task?._id}</Typography>
                <Typography sx={{ml: 7}}><strong>Name:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{data?.task?.name}</Typography>
                <Typography sx={{ml: 7}}><strong>Status:</strong>&nbsp;&nbsp;&nbsp;{data?.task?.status}</Typography>
                <Typography sx={{ml: 7}}><strong>Details:</strong>&nbsp;&nbsp;{data?.task?.taskDetails}</Typography>
                <Typography sx={{ml: 7}}><strong>Due Date:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{formatDateTimeFromISO(data?.task?.closedDate)}</Typography>
                <Typography sx={{ml: 7}}><strong>Created At:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{formatDate(data?.task?.createdAt)}</Typography>
                  <Button onClick={handleUpdateLead} sx={{ ml: 5, mb: 3, width: "80%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"} }} >Update Task</Button>
            </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default GetTaskDetails