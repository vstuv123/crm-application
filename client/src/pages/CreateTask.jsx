import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MetaData from "../components/layout/MetaData";
import { useCreateTaskMutation } from "../store/slices/taskSlice";
import Textarea from "@mui/joy/Textarea";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

const statuses = [
    "Pending",
    "Completed",
]


const CreateTask = () => {
    const [name, setName] = useState("");
    const [status, setStatus] = useState();
    const [taskDetails, setTaskDetails] = useState("");
    const [closedDate, setClosedDate] = useState();
    const [createTask, { isLoading }] = useCreateTaskMutation();
    const navigate = useNavigate();

    console.log(closedDate)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = { name, status, taskDetails, closedDate };
        try {
          toast.loading("creating...", { id: "createTask" })
          const response = await createTask(userData).unwrap();
          navigate('/dashboard/all-tasks');
          toast.success(response?.message, { id: "createTask" });

        } catch (error) {
          toast.error(error.data.message, { id: "createTask" });
        }
    }
  return (
    <>
    <MetaData title={"CRM - Create New Task"} />
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <Box sx={{ mt: 5, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src="https://img.freepik.com/free-vector/add-new-user_78370-4710.jpg" alt="create-task" width={400} height={400} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <form onSubmit={handleSubmit}>
        <Box sx={{ backgroundColor: "#fff", height: "120%", width: {md: "360px", sm: "360px", xs: "350px"}, mt: { md: 15, sm: 19, xs: 23}, mb: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>Create New Task</h1>
                <TextField type='text' value={name} label="Task Name" sx={{ ml: 2, width: "90%"}} onChange={(e) => setName(e.target.value)} required ></TextField>

                <Autocomplete
                    disablePortal={true}
                    id="combo-box-demo"
                    options={statuses}
                    value={status}
                    required
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

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDateTimePicker label="Due Date And Time" value={closedDate}
                    onChange={(newValue) => setClosedDate(newValue)} sx={{ ml: 2, width: "90%"}}  />
                </LocalizationProvider>

                <Textarea minRows={4} type='text' value={taskDetails} label="Task Details" sx={{ ml: 2, width: "90%"}} placeholder="Enter task details here..." onChange={(e) => setTaskDetails(e.target.value)} required />

                <Button type='submit' sx={{ ml: 2, width: "90%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"}, mb: 3 }}>{ isLoading ? "Creating..." : "Create Task"}</Button>
            </Box>
        </Box>
        </form>
      </Box>
    </Box>
    </>
  )
}

export default CreateTask