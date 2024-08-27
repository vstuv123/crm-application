

import { Autocomplete, Box, Button, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import MetaData from "../../components/layout/MetaData";
import { useGetSalesTeamManagerQuery } from "../../store/slices/userSlice";
import updateProfile from '../../images/updateProfileAdmin.png'
import Loader from "../../components/layout/Loader";
import { useGetCustomerDetailsQuery, useUpdateCustomerManagerMutation } from "../../store/slices/customerSlice";
import Textarea from "@mui/joy/Textarea";

const statuses = [
    "Active",
    "InActive"
]

const UpdateCustomer = () => {
    const { id } = useParams();
    const [updateCustomerManager, { isLoading }] = useUpdateCustomerManagerMutation();
    const navigate = useNavigate();
    const search = "";
    const sort = "";
    const {data, isLoading: SalesTeamLoading} = useGetSalesTeamManagerQuery({ search, sort });
    const {data: customerDetailsData, isLoading: CustomerDetailsLoading} = useGetCustomerDetailsQuery(id);
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [company, setCompany] = useState("");
    const [address, setAddress] = useState("");
    const [industry, setIndustry] = useState("");
    const [notes, setNotes] = useState("");
    const [status, setStatus] = useState("");
    const [assignedTo, setAssignedTo] = useState("");

    useEffect(() => {
        if (customerDetailsData) {
          setName(customerDetailsData?.customer?.name || "");
          setContact(customerDetailsData?.customer?.contact || "");
          setCompany(customerDetailsData?.customer?.company || "");
          setAddress(customerDetailsData?.customer?.address || "");
          setIndustry(customerDetailsData?.customer?.industry || "");
          setNotes(customerDetailsData?.customer?.notes || "");
          setStatus(customerDetailsData?.customer?.status || "");
          setAssignedTo(customerDetailsData?.saleRepData?._id || "")
        }
      }, [customerDetailsData]);

    if (SalesTeamLoading || !data || CustomerDetailsLoading || !customerDetailsData) {
        return <Loader />;
    }

    let salesMen = [];

    data && data.users && data.users.forEach(user => {
        salesMen.push({ _id: user._id, salesRep: user.name })
    });

    const handleE = (e) => {
        if (e.key === "E" || e.key === "e") {
            e.preventDefault();
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const customerData = { id, name, contact: contact.toString(), company, industry, address, notes, status, assignedTo };
        try {
          toast.loading("updating...", { id: "updateCustomerManager" })
          const response = await updateCustomerManager(customerData).unwrap();
          navigate(`/manager/dashboard/customer-details/${id}`);

          toast.success(response?.message, { id: "updateCustomerManager" });
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
            toast.error(message, { id: "updateCustomerManager" });
        }
    }
  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <MetaData title={"CRM - UPDATE CUSTOMER MANAGER"} />
      <Box sx={{ mt: -20, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src={updateProfile} alt="update-customer" width={400} height={450} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ backgroundColor: "#fff", height: "120%", width: {md: "360px", sm: "360px", xs: "350px"}, mt: { md: 12, sm: 15, xs: 18}, mb: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>Update Customer</h1>
                <TextField type='text' value={name} label="Name" sx={{ ml: 2, width: "90%"}} onChange={(e) => setName(e.target.value)} required ></TextField>
                <TextField type='number' value={contact} label="Contact" sx={{ ml: 2, width: "90%"}} onChange={(e) => setContact(e.target.value)} onKeyDown={handleE} required ></TextField>
                <TextField type='text' value={company} label="Company" sx={{ ml: 2, width: "90%"}} onChange={(e) => setCompany(e.target.value)} required ></TextField>
                <TextField type='text' value={address} label="Address" sx={{ ml: 2, width: "90%"}} onChange={(e) => setAddress(e.target.value)} required ></TextField>
                <TextField type='text' value={industry} label="Industry" sx={{ ml: 2, width: "90%"}} onChange={(e) => setIndustry(e.target.value)} required ></TextField>
                <Textarea minRows={4} type='text' value={notes} label="Notes" sx={{ ml: 2, width: "90%"}} placeholder="Enter notes here..." onChange={(e) => setNotes(e.target.value)} required />

                <Autocomplete
                    disablePortal
                    id="combo-box-third"
                    required
                    value={status}
                    options={statuses}
                    getOptionLabel={(option) => option || ''}
                    sx={{ ml: 2, width: "90%" }}
                    renderInput={(params) => <TextField {...params} label="Status" />}
                    onChange={(e, newValue) => setStatus(newValue ? newValue : null)}
                    ListboxProps={{
                        style: {
                          maxHeight: '100px',
                          overflowY: 'auto',
                        }
                    }}
                />

                <Autocomplete
                    disablePortal
                    id="combo-box-second"
                    options={salesMen}
                    value={salesMen.find((rep) => rep._id === assignedTo) || null}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => option.salesRep || ''}
                    sx={{ ml: 2, width: "90%" }}
                    renderInput={(params) => <TextField {...params} label="Assigned To" />}
                    onChange={(e, newValue) => setAssignedTo(newValue ? newValue._id : null)}
                    PaperComponent={(props) => (
                        <Paper {...props} sx={{ maxHeight: 100, overflowY: 'auto' }} />
                    )}
                />

                <Button type='submit' sx={{ ml: 2, width: "90%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"}, mb: 3 }}>{ isLoading ? "Updating..." : "Update Customer"}</Button>
            </Box>
        </Box>
        </form>
      </Box>
    </Box>
  )
}

export default UpdateCustomer


