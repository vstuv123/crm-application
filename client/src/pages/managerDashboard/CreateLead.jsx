import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MetaData from "../../components/layout/MetaData";
import Loader from "../../components/layout/Loader";
import { useGetSalesTeamManagerQuery } from "../../store/slices/userSlice";
import { useCreateLeadManagerMutation } from "../../store/slices/leadSlice";


const sources = [
    "Website Form",
    "Referral",
    "Social Media",
    "Email Campaign",
    "Trade Show",
    "Cold Call",
    "Others",
]

const statuses = [
    "New",
    "In Progress",
    "Converted",
    "Lost"
]


const CreateLead = () => {
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [source, setSource] = useState("");
    const [status, setStatus] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const search = "";
    const sort = "";
    const {data, isLoading: SalesTeamLoading} = useGetSalesTeamManagerQuery({ search, sort });
    const [createLead, { isLoading }] = useCreateLeadManagerMutation();
    const navigate = useNavigate();

    if (SalesTeamLoading || !data) {
        return <Loader />
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

        const userData = { name, source, status, contact: contact.toString(), assignedTo };
        try {
          toast.loading("creating...", { id: "createLead" })
          const response = await createLead(userData).unwrap();
          navigate('/manager/dashboard/all-unarchived-leads');
          toast.success(response?.message, { id: "createLead" });

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
          toast.error(message, { id: "createLead" });
        }
    }
  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <MetaData title={"CRM - CREATE NEW LEAD MANAGER"} />
      <Box sx={{ mt: 6, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src="https://img.freepik.com/free-vector/add-new-user_78370-4710.jpg" alt="create-lead" width={400} height={400} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <form onSubmit={handleSubmit}>
        <Box sx={{ backgroundColor: "#fff", height: "120%", width: {md: "360px", sm: "360px", xs: "350px"}, mt: { md: 12, sm: 15, xs: 18}, mb: 4 }}>
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

                <Autocomplete
                    disablePortal
                    id="combo-box-third"
                    required
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
                    required
                    options={salesMen}
                    getOptionLabel={(option) => option.salesRep || ''}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    sx={{ ml: 2, width: "90%" }}
                    renderInput={(params) => <TextField {...params} label="Assigned To" />}
                    onChange={(e, newValue) => setAssignedTo(newValue ? newValue._id : null)}
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
  )
}

export default CreateLead
