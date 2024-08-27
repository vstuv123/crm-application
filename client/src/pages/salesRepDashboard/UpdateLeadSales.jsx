import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import MetaData from "../../components/layout/MetaData";
import updateProfile from '../../images/updateProfileAdmin.png'
import Loader from "../../components/layout/Loader";
import { useGetLeadDetailsSalesQuery, useUpdateLeadSalesRepMutation } from "../../store/slices/leadSlice";


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

const UpdateLeadSales = () => {
    const { id } = useParams();
    const [updateLeadSalesRep, { isLoading }] = useUpdateLeadSalesRepMutation();
    const navigate = useNavigate();
    const {data: leadDetailsData, isLoading: leadDetailsLoading} = useGetLeadDetailsSalesQuery(id);
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [source, setSource] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (leadDetailsData) {
          setName(leadDetailsData?.lead?.name || "");
          setContact(leadDetailsData?.lead?.contact || "");
          setSource(leadDetailsData?.lead?.source || "");
          setStatus(leadDetailsData?.lead?.status || "");
        }
      }, [leadDetailsData]);

    if (leadDetailsLoading || !leadDetailsData) {
        return <Loader />;
    }

    const handleE = (e) => {
        if (e.key === "E" || e.key === "e") {
            e.preventDefault();
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const leadData = { id, name, contact: contact.toString(), source, status };
        try {
          toast.loading("updating...", { id: "updateLeadSales" })
          const response = await updateLeadSalesRep(leadData).unwrap();
          navigate(`/sales/dashboard/lead-details/${id}`);

          toast.success(response?.message, { id: "updateLeadSales" });
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
            toast.error(message, { id: "updateLeadSales" });
        }
    }
  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <MetaData title={"CRM - Update Lead SalesRep"} />
      <Box sx={{ mt: 14, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src={updateProfile} alt="update-lead" width={350} height={380} />
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

                {
                  (status !== "Pending" && status !== "Rejected") ?
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
                /> : (null)
                }

                <Button type='submit' sx={{ ml: 2, width: "90%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"}, mb: 3 }}>{ isLoading ? "Updating..." : "Update Lead"}</Button>
            </Box>
        </Box>
        </form>
      </Box>
    </Box>
  )
}

export default UpdateLeadSales