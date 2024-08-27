import { Autocomplete, Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import MetaData from "../../components/layout/MetaData";
import updateProfile from '../../images/updateProfileAdmin.png'
import Loader from "../../components/layout/Loader";
import { useGetNonArchivedLeadsSalesRepQuery } from "../../store/slices/leadSlice";
import { useGetOpportunityDetailsQuery, useUpdateOpportunityMutation } from "../../store/slices/opportunitySlice";


const stages = [
    "Qualification",
    "Proposal",
    "Negotiation", 
    "Closed"
]

const UpdateOpportunity = () => {
    const { id } = useParams();
    const [updateOpportunity, { isLoading }] = useUpdateOpportunityMutation();
    const [name, setName] = useState("");
    const [value, setValue] = useState();
    const [stage, setStage] = useState("");
    const [closedDate, setClosedDate] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const search = "";
    const sort = "";
    const source = "";
    const {data, isLoading: SalesTeamLoading} = useGetNonArchivedLeadsSalesRepQuery({ search, sort, source });
    const {data: opportunityData, isLoading: opportunityLoading} = useGetOpportunityDetailsQuery(id);
    const navigate = useNavigate();

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
    
        return `${year}-${month}-${day}`;
    }


    useEffect(() => {
        if (opportunityData) {
          setName(opportunityData?.opportunity?.name || "");
          setValue(opportunityData?.opportunity?.value || "");
          setStage(opportunityData?.opportunity?.stage || "");
          setClosedDate(formatDate(opportunityData?.opportunity?.closedDate) || "");
          setAssignedTo(opportunityData?.leadData?._id || "");
        }
      }, [opportunityData]);

      if (SalesTeamLoading || opportunityLoading) {
        return <Loader />
    }

    const handleE = (e) => {
        if (e.key === "E" || e.key === "e") {
            e.preventDefault();
        }
    }

    let leads = [];

    data && data.forEach(lead => {
        leads.push({ _id: lead._id, name: lead.name })
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const leadData = { id, name, value, stage, closedDate, assignedTo };
        try {
          toast.loading("updating...", { id: "updateOpportunity" })
          const response = await updateOpportunity(leadData).unwrap();
          navigate(`/sales/dashboard/opportunity-details/${id}`);

          toast.success(response?.message, { id: "updateOpportunity" });
        } catch (error) {
            toast.error(error.data.message, { id: "updateOpportunity" });
        }
    }
  return (
    <>
    <MetaData title={"CRM - Update Opportunity SalesRep"} />
    <Box sx={{ mt: 9, mb: 1 }}>
        <Typography sx={{ textAlign: "center", color: "red", fontFamily: "Roboto", fontSize: "18px", fontWeight: 500 }}><strong>Note:</strong>&nbsp; You can assign Opportunities to only UnArchived Leads. If you want to assign Opportunity to Archived Leads, then first UnArchive them.</Typography>
    </Box>
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <Box sx={{ mt: 14, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src={updateProfile} alt="update-opportunity" width={350} height={380} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ backgroundColor: "#fff", height: "120%", width: {md: "360px", sm: "360px", xs: "350px"}, mt: { md: 12, sm: 15, xs: 18}, mb: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>Update Opportunity</h1>
                <TextField type='text' value={name} label="Name" sx={{ ml: 2, width: "90%"}} onChange={(e) => setName(e.target.value)} required ></TextField>
                <TextField type='number' value={value} InputLabelProps={{ shrink: true }} label="Value" sx={{ ml: 2, width: "90%"}} onChange={(e) => setValue(e.target.value)} onKeyDown={handleE} required ></TextField>
                <Autocomplete
                    disablePortal={true}
                    id="combo-box-demo"
                    options={stages}
                    value={stage}
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
                    value={leads.find((rep) => rep._id === assignedTo) || null}
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

                <Button type='submit' sx={{ ml: 2, width: "90%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"}, mb: 3 }}>{ isLoading ? "Updating..." : "Update Opportunity"}</Button>
            </Box>
        </Box>
        </form>
      </Box>
    </Box>
  </>
  )
}

export default UpdateOpportunity