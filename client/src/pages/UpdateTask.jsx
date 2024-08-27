import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import MetaData from "../components/layout/MetaData";
import { useGetTaskDetailsQuery, useUpdateTaskMutation } from "../store/slices/taskSlice";
import Textarea from "@mui/joy/Textarea";
import Loader from "../components/layout/Loader";
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';


const statuses = [
    "Pending",
    "Completed",
]


const UpdateTask = () => {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [status, setStatus] = useState("");
    const [taskDetails, setTaskDetails] = useState("");
    const [closedDate, setClosedDate] = useState();
    const [updateTask, { isLoading }] = useUpdateTaskMutation();
    const { data, isLoading: dataLoading } = useGetTaskDetailsQuery(id);
    const navigate = useNavigate();

    dayjs.extend(utc);
    dayjs.extend(timezone);
    
    function formatDateTimeFromISO(isoDateString) {
      return dayjs(isoDateString).utc().local();
  }

      
  function formatDateTimeForServer(dateTime) {
    return dayjs(dateTime).utc().format();
}

    useEffect(() => {
        if (data) {
          setName(data?.task?.name || "");
          setStatus(data?.task?.status || "");
          setTaskDetails(data?.task?.taskDetails || "");
          const formattedDate = data?.task?.closedDate ? formatDateTimeFromISO(data.task.closedDate) : null;
          setClosedDate(formattedDate);
        }
      }, [data]);

    if (dataLoading || !data) {
        return <Loader />;
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedDateTime = formatDateTimeForServer(closedDate);

        const userData = { id, name, status, taskDetails, closedDate: formattedDateTime };
        try {
          toast.loading("updating...", { id: "UpdateTask" })
          const response = await updateTask(userData).unwrap();
          navigate(`/dashboard/task-details/${id}`);
          toast.success(response?.message, { id: "UpdateTask" });

        } catch (error) {
          toast.error(error.data.message, { id: "UpdateTask" });
        }
    }
  return (
    <>
    <MetaData title={"CRM - Update Task"} />
    <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "100px" }} >
      <Box sx={{ mt: 5, display: {md: "block", sm: "none", xs: "none", display: "flex", justifyContent: "center", alignItems: "center"} }}>
        <img src="https://img.freepik.com/free-vector/add-new-user_78370-4710.jpg" alt="create-task" width={400} height={400} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <form onSubmit={handleSubmit}>
        <Box sx={{ backgroundColor: "#fff", height: "120%", width: {md: "360px", sm: "360px", xs: "350px"}, mt: { md: 14, sm: 18, xs: 23}, mb: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                <h1 className='heading' style={{ color: "#2C3E50" }}>Update Task</h1>
                <TextField type='text' value={name} label="Name" sx={{ ml: 2, width: "90%"}} onChange={(e) => setName(e.target.value)} required ></TextField>

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

                <Button type='submit' sx={{ ml: 2, width: "90%", background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"}, mb: 3 }}>{ isLoading ? "Updating..." : "Update Task"}</Button>
            </Box>
        </Box>
        </form>
      </Box>
    </Box>
    </>
  )
}

export default UpdateTask