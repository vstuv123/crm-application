import { Autocomplete, Box, Button, TextField, Paper } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MetaData from "../../components/layout/MetaData";
import { useCreateUserMutation, useGetAllUsersQuery } from "../../store/slices/userSlice";
import Loader from "../../components/layout/Loader";


const roles = [
    { role: "Admin"},
    { role: "Manager"},
    { role: "Sales Representative"}
]

const CreateUser = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [contact, setContact] = useState("");
    const [role, setRole] = useState("");
    const [salesTeam, setSalesTeam] = useState([]);
    const [assignedTo, setAssignedTo] = useState("");
    const [createUser, { isLoading }] = useCreateUserMutation();
    const navigate = useNavigate();
    const search = "";
    const sort = "";
    const {data, isLoading: usersLoading} = useGetAllUsersQuery({ search, sort });

    if (usersLoading || !data) {
        return <Loader />
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

    const handleE = (e) => {
        if (e.key === "E" || e.key === "e") {
            e.preventDefault();
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = { name, email, password, contact: contact.toString(), role, salesTeam: team, assignedTo };
        try {
          toast.loading("creating...", { id: "createUser" })
          const response = await createUser(userData).unwrap();
          navigate('/admin/dashboard/all-users');

          toast.success(response?.message, { id: "createUser" });
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
          toast.error(message, { id: "createUser" });
        }
    }
  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <MetaData title={"CRM - CREATE NEW USER"} />
      <Box sx={{ mt: 6, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src="https://img.freepik.com/free-vector/add-new-user_78370-4710.jpg" alt="create-user" width={400} height={400} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <form onSubmit={handleSubmit}>
        <Box sx={{ backgroundColor: "#fff", height: "120%", width: {md: "360px", sm: "360px", xs: "350px"}, mt: { md: 12, sm: 15, xs: 18}, mb: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>Create New User</h1>
                <TextField type='text' value={name} label="Name" sx={{ ml: 2, width: "90%"}} onChange={(e) => setName(e.target.value)} required ></TextField>
                <TextField type='email' value={email} label="Email" sx={{ ml: 2, width: "90%"}} onChange={(e) => setEmail(e.target.value)} required ></TextField>
                <TextField type='password' value={password} label="Password" sx={{ ml: 2, width: "90%"}} onChange={(e) => setPassword(e.target.value)} required ></TextField>
                <TextField type='number' value={contact} label="Contact" sx={{ ml: 2, width: "90%"}} onChange={(e) => setContact(e.target.value)} onKeyDown={handleE} required ></TextField>
                <Autocomplete
                    disablePortal={true}
                    id="combo-box-demo"
                    options={roles}
                    getOptionLabel={(option) => option.role || ''}
                    sx={{ ml: 2, width: "90%" }}
                    renderInput={(params) => <TextField {...params} label="Role" />}
                    onChange={(e, newValue) => setRole(newValue ? newValue.role : null)}
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

                <Button type='submit' sx={{ ml: 2, width: "90%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"}, mb: 3 }}>{ isLoading ? "Creating..." : "Create User"}</Button>
            </Box>
        </Box>
        </form>
      </Box>
    </Box>
  )
}

export default CreateUser
