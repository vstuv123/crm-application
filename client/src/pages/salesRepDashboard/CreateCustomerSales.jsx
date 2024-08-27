import { Box, Button, TextField, Typography } from "@mui/material";
import Textarea from '@mui/joy/Textarea';
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MetaData from "../../components/layout/MetaData";
import { useCreateCustomerSalesRepMutation } from "../../store/slices/customerSlice";

const CreateCustomerSales = () => {
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [company, setCompany] = useState("");
    const [address, setAddress] = useState("");
    const [industry, setIndustry] = useState("");
    const [notes, setNotes] = useState("");
    const [createCustomerSalesRep, { isLoading }] = useCreateCustomerSalesRepMutation();
    const navigate = useNavigate();


    const handleE = (e) => {
        if (e.key === "E" || e.key === "e") {
            e.preventDefault();
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const customerData = { name, company, address, industry, notes, contact: contact.toString() };
        try {
          toast.loading("creating...", { id: "createCustomerSales" })
          const response = await createCustomerSalesRep(customerData).unwrap();
          navigate('/sales/dashboard/all-unarchived-customers');
          toast.success(response?.message, { id: "createCustomerSales" });

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
          toast.error(message, { id: "createCustomerSales" });
        }
    }
  return (
    <>
    <MetaData title={"CRM - Create New Customer SalesRep"} />
    <Box sx={{ mt: 8, mb: 1 }}>
        <Typography sx={{ textAlign: "center", color: "red", fontFamily: "Roboto", fontSize: "18px" }}><strong>Note:</strong>&nbsp; Status of Created Customers will automatically be changed to Pending and hence requires approval from manager. If Manager Approved, then status will change to Active and you can update it later while if Manager Rejected, then customer will automatically be archived.You will be informed via Email when Manger Approved or Rejected it</Typography>
    </Box>
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <Box sx={{ mt: -20, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src="https://img.freepik.com/free-vector/add-new-user_78370-4710.jpg" alt="create-customer" width={400} height={500} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <form onSubmit={handleSubmit}>
        <Box sx={{ backgroundColor: "#fff", height: "120%", width: {md: "360px", sm: "360px", xs: "350px"}, mt: { md: 12, sm: 15, xs: 18}, mb: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>Create New Customer</h1>
                <TextField type='text' value={name} label="Name" sx={{ ml: 2, width: "90%"}} onChange={(e) => setName(e.target.value)} required ></TextField>
                <TextField type='number' value={contact} label="Contact" sx={{ ml: 2, width: "90%"}} onChange={(e) => setContact(e.target.value)} onKeyDown={handleE} required ></TextField>
                <TextField type='text' value={company} label="Company" sx={{ ml: 2, width: "90%"}} onChange={(e) => setCompany(e.target.value)} required ></TextField>
                <TextField type='text' value={address} label="Address" sx={{ ml: 2, width: "90%"}} onChange={(e) => setAddress(e.target.value)} required ></TextField>
                <TextField type='text' value={industry} label="Industry" sx={{ ml: 2, width: "90%"}} onChange={(e) => setIndustry(e.target.value)} required ></TextField>
                <Textarea minRows={4} type='text' value={notes} label="Notes" sx={{ ml: 2, width: "90%"}} placeholder="Enter notes here..." onChange={(e) => setNotes(e.target.value)} required />

                <Button type='submit' sx={{ ml: 2, width: "90%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"}, mb: 3 }}>{ isLoading ? "Creating..." : "Create Customer"}</Button>
            </Box>
        </Box>
        </form>
      </Box>
    </Box>
  </>
  )
}

export default CreateCustomerSales