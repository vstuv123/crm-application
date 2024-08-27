import { Autocomplete, Box, Button, TextField, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import MetaData from "../../components/layout/MetaData";
import { useGetAllUsersQuery, useGetUserDetailsAdminQuery, useUpdateUserAdminMutation } from "../../store/slices/userSlice";
import updateProfile from '../../images/updateProfileAdmin.png'
import Loader from "../../components/layout/Loader";

const roles = [
    "Admin",
    "Manager",
    "Sales Representative"
]


const UpdateUser = () => {
    const { id } = useParams();
    const [updateUserAdmin, { isLoading }] = useUpdateUserAdminMutation();
    const navigate = useNavigate();
    const search = "";
    const sort = ""
    const {data, isLoading: usersLoading} = useGetAllUsersQuery({ search, sort });
    const {data: userDetailsData, isLoading: userDetailsLoading} = useGetUserDetailsAdminQuery(id);
    const [role, setRole] = useState("");
    const [salesTeam, setSalesTeam] = useState([]);
    const [assignedTo, setAssignedTo] = useState("");

    useEffect(() => {
        if (userDetailsData) {
          setRole(userDetailsData?.user?.role || "");
          setSalesTeam(userDetailsData?.salesTeamData || []);
          setAssignedTo(userDetailsData?.managerData?._id || "");
        }
      }, [userDetailsData]);

    if (usersLoading || !data || userDetailsLoading || !userDetailsData) {
        return <Loader />;
    }

    let managers = [];
    let salesMen = [];

    data && data.forEach(user => {
        if (user.role === "Manager") {
            managers.push({ _id: user._id, manager: user.name });
        } else if (user.role === "Sales Representative") {
            salesMen.push({ _id: user._id, salesRep: user.name })
        }
    });

    const handleChange = (event, newValue) => {
        const uniqueSalesTeam = Array.from(
          new Set(newValue.map((option) => option._id))
        ).map((id) => newValue.find((option) => option._id === id));

        setSalesTeam(uniqueSalesTeam);
      };

    let team = [];

    salesTeam.map((data) => (
        team.push(data._id)
    ));

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = { id, role, salesTeam: team, assignedTo };
        try {
          toast.loading("updating...", { id: "updateUserAdmin" })
          const response = await updateUserAdmin(userData).unwrap();
          navigate(`/admin/dashboard/user-details/${id}`);

          toast.success(response?.message, { id: "updateUserAdmin" });
        } catch (error) {
          toast.error(error.data.message, { id: "updateUserAdmin" });
        }
    }
  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <MetaData title={"CRM - UPDATE USER ADMIN"} />
      <Box sx={{ mt: 14, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src={updateProfile} alt="update-user" width={350} height={380} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <form onSubmit={handleSubmit}>
        <Box sx={{ backgroundColor: "#fff", height: "120%", width: {md: "360px", sm: "360px", xs: "350px"}, mt: { md: 18, sm: 25, xs: 26}, mb: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "38px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>Update User</h1>
                <Autocomplete
                    disablePortal={true}
                    id="combo-box-demo"
                    options={roles}
                    value={role}
                    getOptionLabel={(option) => option || ''}
                    sx={{ ml: 2, width: "90%" }}
                    renderInput={(params) => <TextField {...params} label="Role" />}
                    onChange={(e, newValue) => setRole(newValue ? newValue : null)}
                    PaperComponent={(props) => (
                        <Paper {...props} sx={{ maxHeight: 100, overflowY: 'auto' }} />
                    )}
                />

                {
                    role === "Admin" ? (null) : role === "Manager" ? (
                        <Autocomplete
                            multiple
                            id="tags-demo"
                            options={salesMen}
                            value={salesTeam}
                            getOptionLabel={(option) => option.salesRep || []}
                            sx={{ ml: 2, width: "90%" }}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                            onChange={handleChange}
                            renderInput={(params) => (
                                <TextField {...params} label="Sales Team" />
                            )}
                            PaperComponent={(props) => (
                                <Paper {...props} sx={{ maxHeight: 100, overflowY: 'auto' }} />
                            )}
                        />
                    ) : role === "Sales Representative" ? (
                        <Autocomplete
                            disablePortal
                            id="combo-box-second"
                            options={managers}
                            value={managers.find((rep) => rep._id === assignedTo) || null}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                            getOptionLabel={(option) => option.manager || ''}
                            sx={{ ml: 2, width: "90%" }}
                            renderInput={(params) => <TextField {...params} label="Assigned To" />}
                            onChange={(e, newValue) => setAssignedTo(newValue ? newValue._id : null)}
                            PaperComponent={(props) => (
                                <Paper {...props} sx={{ maxHeight: 100, overflowY: 'auto' }} />
                            )}
                        />
                    ) : (null)
                }

                <Button type='submit' sx={{ ml: 2, width: "90%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"}, mb: 3 }}>{ isLoading ? "Updating..." : "Update User"}</Button>
            </Box>
        </Box>
        </form>
      </Box>
    </Box>
  )
}

export default UpdateUser
