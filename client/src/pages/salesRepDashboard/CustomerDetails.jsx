import { Box, Button, Typography } from '@mui/material'
import MetaData from "../../components/layout/MetaData"
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../../components/layout/Loader';
import { useGetCustomerDetailsSalesQuery } from '../../store/slices/customerSlice';

const CustomerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {data, isLoading} = useGetCustomerDetailsSalesQuery(id);

    if (isLoading || !data) {
        return <Loader />;
    }

    const saleRepName = data?.saleRepData ? data.saleRepData.salesRep : "None";

    const date = new Date(data?.customer?.createdAt);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const handleUpdateCustomer = () => {
        navigate(`/sales/dashboard/update-customer/${id}`);
    }
  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <MetaData title={"CRM - Customer Details SalesRep"} />
      <Box sx={{ mt: -10, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src="https://images.freeimages.com/fic/images/icons/2443/bunch_of_cool_bluish_icons/512/info_user.png" alt="leadDetails" width={350} height={360} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ backgroundColor: "#fff", height: "100%", width: {md: "420px", sm: "400px", xs: "370px"}, mt: { md: 15, sm: 25, xs: 25} }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>Customer Details</h1>
                <Typography sx={{ml: { md: 8, sm: 8, xs: 6 }}}><strong>CustomerId:</strong>&nbsp;&nbsp;{data?.customer?._id}</Typography>
                <Typography sx={{ml: { md: 8, sm: 8, xs: 6 }}}><strong>Name:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data?.customer?.name}</Typography>
                <Typography sx={{ml: { md: 8, sm: 8, xs: 6 }}}><strong>Contact:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{data?.customer?.contact}</Typography>
                <Typography sx={{ml: { md: 8, sm: 8, xs: 6 }}}><strong>Company:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data?.customer?.company}</Typography>
                <Typography sx={{ml: { md: 8, sm: 8, xs: 6 }}}><strong>Industry:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data?.customer?.industry}</Typography>
                <Typography sx={{ml: { md: 8, sm: 8, xs: 6 }}}><strong>Address:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data?.customer?.address}</Typography>
                <Typography sx={{ml: { md: 8, sm: 8, xs: 6 }}}><strong>Status:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data?.customer?.status}</Typography>
                <Typography sx={{ml: { md: 8, sm: 8, xs: 6 }}}><strong>Notes:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data?.customer?.notes}</Typography>
                <Typography sx={{ml: { md: 8, sm: 8, xs: 6 }}}><strong>Created At:</strong>&nbsp;&nbsp;&nbsp;{formattedDate}</Typography>
                <Typography sx={{ml: { md: 8, sm: 8, xs: 6 }}}><strong>AssignedTo:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{saleRepName}</Typography>
                <Button onClick={handleUpdateCustomer} sx={{ ml: 5, mb: 3, width: "80%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"} }} >Update Customer</Button>
            </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default CustomerDetails