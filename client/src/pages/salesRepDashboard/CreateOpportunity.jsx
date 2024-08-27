import { Autocomplete, Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MetaData from "../../components/layout/MetaData";
import Loader from "../../components/layout/Loader";
import { useGetNonArchivedLeadsSalesRepQuery } from "../../store/slices/leadSlice";
import { useCreateOpportunityMutation } from "../../store/slices/opportunitySlice";


const stages = [
    "Qualification",
    "Proposal",
    "Negotiation", 
    "Closed"
]


const CreateOpportunity = () => {
    const [name, setName] = useState("");
    const [value, setValue] = useState();
    const [stage, setStage] = useState("");
    const [closedDate, setClosedDate] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const search = "";
    const sort = "";
    const source = "";
    const {data, isLoading: SalesTeamLoading} = useGetNonArchivedLeadsSalesRepQuery({ search, sort, source });
    const [createOpportunity, { isLoading }] = useCreateOpportunityMutation();
    const navigate = useNavigate();

    if (SalesTeamLoading || !data) {
        return <Loader />
    }

    let leads = [];

    data && data.forEach(lead => {
        leads.push({ _id: lead._id, name: lead.name })
    });

    const handleE = (e) => {
        if (e.key === "E" || e.key === "e") {
            e.preventDefault();
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = { name, value, stage, closedDate, assignedTo };
        try {
          toast.loading("creating...", { id: "createOpportunity" })
          const response = await createOpportunity(userData).unwrap();
          navigate('/sales/dashboard/all-unarchived-opportunities');
          toast.success(response?.message, { id: "createOpportunity" });

        } catch (error) {
          toast.error(error.data.message, { id: "createOpportunity" });
        }
    }
  return (
    <>
    <MetaData title={"CRM - Create New Opportunity Sales Rep"} />
    <Box sx={{ mt: 9, mb: 1 }}>
        <Typography sx={{ textAlign: "center", color: "red", fontFamily: "Roboto", fontSize: "18px", fontWeight: 500 }}><strong>Note:</strong>&nbsp; You can assign Opportunities to only UnArchived Leads. If you want to assign Opportunity to Archived Leads, then first UnArchive them.</Typography>
    </Box>
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <Box sx={{ mt: -10, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src="https://img.freepik.com/free-vector/add-new-user_78370-4710.jpg" alt="create-opportunity" width={400} height={400} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <form onSubmit={handleSubmit}>
        <Box sx={{ backgroundColor: "#fff", height: "120%", width: {md: "360px", sm: "360px", xs: "350px"}, mt: { md: 7, sm: 10, xs: 13}, mb: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>Create New Opportunity</h1>
                <TextField type='text' value={name} label="Name" sx={{ ml: 2, width: "90%"}} onChange={(e) => setName(e.target.value)} required ></TextField>
                <TextField type='number' value={value} label="Value" sx={{ ml: 2, width: "90%"}} onChange={(e) => setValue(e.target.value)} onKeyDown={handleE} required ></TextField>
                <Autocomplete
                    disablePortal={true}
                    id="combo-box-demo"
                    options={stages}
                    required
                    getOptionLabel={(option) => option || ''}
                    sx={{ ml: 2, width: "90%" }}
                    renderInput={(params) => <TextField {...params} label="Stage" />}
                    onChange={(e, newValue) => setStage(newValue ? newValue : null)}
                    ListboxProps={{
                        style: {
                          maxHeight: '100px',
                          overflowY: 'auto',
                        }
                    }}
                />

                <TextField type='date' label="Closed Date" value={closedDate} InputLabelProps={{ shrink: true }} sx={{ ml: 2, width: "90%"}} onChange={(e) => setClosedDate(e.target.value)} required ></TextField>

                <Autocomplete
                    disablePortal
                    id="combo-box-second"
                    required
                    options={leads}
                    getOptionLabel={(option) => option.name || ''}
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
    </>
  )
}

export default CreateOpportunity
