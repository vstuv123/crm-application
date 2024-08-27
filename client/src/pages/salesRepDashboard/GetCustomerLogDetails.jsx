import { Box, Button, Typography } from '@mui/material'
import MetaData from "../../components/layout/MetaData"
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../../components/layout/Loader';
import { useEffect, useState } from 'react';
import { useGetLogDetailsQuery } from '../../store/slices/customerLogSlice';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

const GetCustomerLogDetails = () => {

    const [previousPage, setPreviousPage] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();
    const {data, isLoading} = useGetLogDetailsQuery(id);

    useEffect(() => {
      const prevPath = sessionStorage.getItem('previousPath');
      setPreviousPage(prevPath);
    }, []);

    if (isLoading || !data) {
        return <Loader />;
    }

    dayjs.extend(utc);
    dayjs.extend(timezone);
    
    function formatTimeFromISO(isoDateString) {
      // Parse the ISO date string into a dayjs object
      const date = dayjs(isoDateString).local(); // Convert to local time if needed
    
      // Format the time to 'hh:mm:ss A'
      return date.format('hh:mm:ss A');
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
    
        return `${day}-${month}-${year}`;
    }

    const handleGoBack = () => {
      const previousPath = sessionStorage.getItem('previousPath');
      const savedId = sessionStorage.getItem('id');
    const savedData = JSON.parse(sessionStorage.getItem('data'));

    if (previousPath && savedId && savedData) {
      navigate(previousPath, { state: { id: savedId, data: savedData } });
    } else {
      navigate(-1);
    }
  }

    const handleUpdateLead = () => {
        navigate(`/sales/dashboard/update-log/${id}`);
    }
  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <MetaData title={"CRM - Customer Log Details SalesRep"} />
      <Box sx={{ mt: 15, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src="https://images.freeimages.com/fic/images/icons/2443/bunch_of_cool_bluish_icons/512/info_user.png" alt="leadDetails" width={350} height={360} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ backgroundColor: "#fff", height: "100%", width: {md: "420px", sm: "400px", xs: "370px"}, mt: { md: 15, sm: 18, xs: 20} }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>Customer Log Details</h1>
                <Typography sx={{ml: 6}}><strong>LogId:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{data?.interaction?._id}</Typography>
                <Typography sx={{ml: 6}}><strong>Customer Name:</strong>&nbsp;&nbsp;{data?.interaction?.customer?.name}</Typography>
                <Typography sx={{ml: 6}}><strong>Date:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{formatDate(data?.interaction?.date)}</Typography>
                <Typography sx={{ml: 6}}><strong>Time:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{formatTimeFromISO(data?.interaction?.time)}</Typography>
                <Typography sx={{ml: 6}}><strong>Description:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{data?.interaction?.description}</Typography>
                <Typography sx={{ml: 6}}><strong>Created At:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{formatDate(data?.interaction?.createdAt)}</Typography>
                {
                  previousPage !== "/sales/dashboard/logs/customer" ?
                  <Button onClick={handleUpdateLead} sx={{ ml: 5, mb: 3, width: "80%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"} }} >Update Customer Log</Button> : (
                    <Button onClick={handleGoBack} sx={{ ml: 5, mb: 3, width: "80%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"} }} >Go Back</Button>)
                }
            </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default GetCustomerLogDetails