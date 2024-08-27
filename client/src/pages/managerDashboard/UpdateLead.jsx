import { Autocomplete, Box, Button, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import MetaData from "../../components/layout/MetaData";
import { useGetSalesTeamManagerQuery } from "../../store/slices/userSlice";
import updateProfile from '../../images/updateProfileAdmin.png'
import Loader from "../../components/layout/Loader";
import { useGetLeadDetailsQuery, useUpdateLeadManagerMutation } from "../../store/slices/leadSlice";


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

const UpdateLead = () => {
    const { id } = useParams();
    const [updateLeadManager, { isLoading }] = useUpdateLeadManagerMutation();
    const navigate = useNavigate();
    const search = "";
    const sort = "";
    const {data, isLoading: SalesTeamLoading} = useGetSalesTeamManagerQuery({ search, sort });
    const {data: leadDetailsData, isLoading: leadDetailsLoading} = useGetLeadDetailsQuery(id);
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [source, setSource] = useState("");
    const [status, setStatus] = useState("");
    const [assignedTo, setAssignedTo] = useState("");

    useEffect(() => {
        if (leadDetailsData) {
          setName(leadDetailsData?.lead?.name || "");
          setContact(leadDetailsData?.lead?.contact || "");
          setSource(leadDetailsData?.lead?.source || "");
          setStatus(leadDetailsData?.lead?.status || "");
          setAssignedTo(leadDetailsData?.saleRepData?._id || "")
        }
      }, [leadDetailsData]);

    if (SalesTeamLoading || !data || leadDetailsLoading || !leadDetailsData) {
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

        const leadData = { id, name, contact: contact.toString(), source, status, assignedTo };
        try {
          toast.loading("updating...", { id: "updateLeadManager" })
          const response = await updateLeadManager(leadData).unwrap();
          navigate(`/manager/dashboard/lead-details/${id}`);

          toast.success(response?.message, { id: "updateLeadManager" });
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
            toast.error(message, { id: "updateLeadManager" });
        }
    }
  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <MetaData title={"CRM - UPDATE LEAD MANAGER"} />
      <Box sx={{ mt: 14, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src={updateProfile} alt="update-user" width={350} height={380} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ backgroundColor: "#fff", height: "120%", width: {md: "360px", sm: "360px", xs: "350px"}, mt: { md: 12, sm: 15, xs: 18}, mb: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>Update Lead</h1>
                <TextField type='text' value={name} label="Name" sx={{ ml: 2, width: "90%"}} onChange={(e) => setName(e.target.value)} required ></TextField>
                <TextField type='number' value={contact} label="Contact" sx={{ ml: 2, width: "90%"}} onChange={(e) => setContact(e.target.value)} onKeyDown={handleE} required ></TextField>
                <Autocomplete
                    disablePortal={true}
                    id="combo-box-demo"
                    options={sources}
                    value={source}
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

                <Button type='submit' sx={{ ml: 2, width: "90%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"}, mb: 3 }}>{ isLoading ? "Updating..." : "Update Lead"}</Button>
            </Box>
        </Box>
        </form>
      </Box>
    </Box>
  )
}

export default UpdateLead

