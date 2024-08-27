import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import MetaData from "../../components/layout/MetaData";
import updateProfile from "../../images/updateProfileAdmin.png";
import Loader from "../../components/layout/Loader";
import {
  useGetLogDetailsQuery,
  useUpdateLogMutation,
} from "../../store/slices/customerLogSlice";
import { useGetNonArchivedCustomersSalesQuery } from "../../store/slices/customerSlice";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Textarea from "@mui/joy/Textarea";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const customerInteractions = ["Meeting", "Call", "Email"];

const UpdateLog = () => {
  const { id } = useParams();
  const [updateOpportunity, { isLoading }] = useUpdateLogMutation();
  const [customer, setCustomer] = useState("");
  const [interactionType, setInteractionType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState();
  const [description, setDescription] = useState("");
  const search = "";
  const sort = "";
  const company = "";
  const industry = "";
  const { data, isLoading: SalesTeamLoading } =
    useGetNonArchivedCustomersSalesQuery({ search, sort, company, industry });
  const { data: logData, isLoading: logLoading } = useGetLogDetailsQuery(id);
  const navigate = useNavigate();

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  dayjs.extend(utc);
  dayjs.extend(timezone);

  function formatTimeFromISO(isoDateString) {
    return dayjs(isoDateString);
  }

  function formatTimeForServer(time) {
    return time.utc().format(); // Convert back to ISO 8601 string for the server
  }

  useEffect(() => {
    if (logData) {
      setCustomer(logData?.interaction?.customer?._id || "");
      setInteractionType(logData?.interaction?.interactionType || "");
      setDate(formatDate(logData?.interaction?.date) || "");
      setTime(formatTimeFromISO(logData?.interaction?.time) || dayjs());
      setDescription(logData?.interaction?.description || "");
    }
  }, [logData]);

  if (SalesTeamLoading || !logData || logLoading || !data) {
    return <Loader />;
  }

  let customers = [];

  data &&
    data.forEach((customer) => {
      customers.push({ _id: customer._id, customer: customer.name });
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedTime = formatTimeForServer(time);

    const leadData = {
      id,
      customer,
      interactionType,
      date,
      time: formattedTime,
      description,
    };
    try {
      toast.loading("updating...", { id: "updateLog" });
      const response = await updateOpportunity(leadData).unwrap();
      navigate(`/sales/dashboard/log-details/${id}`);

      toast.success(response?.message, { id: "updateLog" });
    } catch (error) {
      toast.error(error.data.message, { id: "updateLog" });
    }
  };
  return (
    <>
      <MetaData title={"CRM - Update Customer Log SalesRep"} />
      <Box sx={{ mt: 9, mb: 1 }}>
        <Typography
          sx={{
            textAlign: "center",
            color: "red",
            fontFamily: "Roboto",
            fontSize: "18px",
            fontWeight: 500,
          }}
        >
          <strong>Note:</strong>&nbsp; You can assign Log to only UnArchived
          CustomeRs.If you want to assign Log to Archived Customers, then first
          UnArchive them.
        </Typography>
      </Box>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "100px",
        }}
      >
        <Box
          sx={{
            mt: 14,
            display: {
              md: "block",
              sm: "none",
              xs: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          }}
        >
          <img src={updateProfile} alt="update-log" width={350} height={380} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                backgroundColor: "#fff",
                height: "120%",
                width: { md: "360px", sm: "360px", xs: "350px" },
                mt: { md: 12, sm: 15, xs: 18 },
                mb: 4,
              }}
            >
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "30px" }}
              >
                <h1 className="heading" style={{ color: "#2C3E50" }}>
                  Update Customer Log
                </h1>
                <Autocomplete
                  disablePortal
                  id="combo-box-second"
                  required
                  options={customers}
                  value={customers.find((rep) => rep._id === customer) || null}
                  getOptionLabel={(option) => option.customer || ""}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  sx={{ ml: 2, width: "90%" }}
                  renderInput={(params) => (
                    <TextField {...params} label="Customer Name" />
                  )}
                  onChange={(e, newValue) =>
                    setCustomer(newValue ? newValue._id : null)
                  }
                  ListboxProps={{
                    style: {
                      maxHeight: "100px",
                      overflowY: "auto",
                    },
                  }}
                />
                <Autocomplete
                  disablePortal={true}
                  id="combo-box-demo"
                  options={customerInteractions}
                  value={interactionType}
                  required
                  getOptionLabel={(option) => option || ""}
                  sx={{ ml: 2, width: "90%" }}
                  renderInput={(params) => (
                    <TextField {...params} label="Interaction Type" />
                  )}
                  onChange={(e, newValue) =>
                    setInteractionType(newValue ? newValue : null)
                  }
                  ListboxProps={{
                    style: {
                      maxHeight: "100px",
                      overflowY: "auto",
                    },
                  }}
                />

                <TextField
                  type="date"
                  label="Date"
                  value={date}
                  InputLabelProps={{ shrink: true }}
                  sx={{ ml: 2, width: "90%" }}
                  onChange={(e) => setDate(e.target.value)}
                  required
                ></TextField>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileTimePicker
                    label="Time"
                    value={time}
                    onChange={(newValue) => setTime(newValue)}
                    sx={{ ml: 2, width: "90%" }}
                  />
                </LocalizationProvider>

                <Textarea
                  minRows={4}
                  type="text"
                  value={description}
                  label="Description"
                  sx={{ ml: 2, width: "90%" }}
                  placeholder="Enter description here..."
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  sx={{
                    ml: 2,
                    width: "90%",
                    background: "#d39925",
                    color: "white",
                    "&:hover": { backgroundColor: "#c08717" },
                    "&:focus": { backgroundColor: "#c08717" },
                    "&:active": { backgroundColor: "#c08717" },
                    mb: 3,
                  }}
                >
                  {isLoading ? "Updating..." : "Update Customer Log"}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default UpdateLog;
