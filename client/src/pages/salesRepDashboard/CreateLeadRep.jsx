import { Autocomplete, Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MetaData from "../../components/layout/MetaData";
import { useCreateLeadSalesRepMutation } from "../../store/slices/leadSlice";


const sources = [
    "Website Form",
    "Referral",
    "Social Media",
    "Email Campaign",
    "Trade Show",
    "Cold Call",
    "Others",
]


const CreateLeadRep = () => {
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [source, setSource] = useState("");
    const [createLeadSalesRep, { isLoading }] = useCreateLeadSalesRepMutation();
    const navigate = useNavigate();

    const handleE = (e) => {
        if (e.key === "E" || e.key === "e") {
            e.preventDefault();
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = { name, source, contact: contact.toString() };
        try {
          toast.loading("creating...", { id: "createLeadSales" })
          const response = await createLeadSalesRep(userData).unwrap();
          navigate('/sales/dashboard/all-unarchived-leads');
          toast.success(response?.message, { id: "createLeadSales" });

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
          toast.error(message, { id: "createLeadSales" });
        }
    }
  return (
    <>
    <MetaData title={"CRM - Create New Lead SalesRep"} />
    <Box sx={{ mt: 8, mb: 1 }}>
        <Typography sx={{ textAlign: "center", color: "red", fontFamily: "Roboto", fontSize: "18px" }}><strong>Note:</strong>&nbsp; Status of Created Leads will automatically be changed to Pending and hence requires approval from manager. If Manager Approved, then status will change to New and you can update it later while if Manager Rejected, then lead will automatically be archived.You will be informed via Email when manger Approved or Rejected it</Typography>
    </Box>
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <Box sx={{ mt: 20, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src="https://img.freepik.com/free-vector/add-new-user_78370-4710.jpg" alt="create-lead" width={400} height={400} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <form onSubmit={handleSubmit}>
        <Box sx={{ backgroundColor: "#fff", height: "120%", width: {md: "380px", sm: "360px", xs: "350px"}, mt: { md: 3, sm: 5, xs: 8}, mb: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>Create New Lead</h1>
                <TextField type='text' value={name} label="Name" sx={{ ml: 2, width: "90%"}} onChange={(e) => setName(e.target.value)} required ></TextField>
                <TextField type='number' value={contact} label="Contact" sx={{ ml: 2, width: "90%"}} onChange={(e) => setContact(e.target.value)} onKeyDown={handleE} required ></TextField>
                <Autocomplete
                    disablePortal={true}
                    id="combo-box-demo"
                    options={sources}
                    required
                    getOptionLabel={(option) => option || ''}
                    sx={{ ml: 2, width: "90%" }}
                    renderInput={(params) => <TextField {...params} label="Source" />}
                    onChange={(e, newValue) => setSource(newValue ? newValue : null)}
                    ListboxProps={{
                        style: {
                          maxHeight: '100px',
                          overflowY: 'auto',
                        }
                    }}
                />

                <Button type='submit' sx={{ ml: 2, width: "90%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"}, mb: 3 }}>{ isLoading ? "Creating..." : "Create Lead"}</Button>
            </Box>
        </Box>
        </form>
      </Box>
    </Box>
    </>
  )
}

export default CreateLeadRep
