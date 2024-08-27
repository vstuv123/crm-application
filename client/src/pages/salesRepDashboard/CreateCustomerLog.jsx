import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MetaData from "../../components/layout/MetaData";
import Loader from "../../components/layout/Loader";
import { useGetNonArchivedCustomersSalesQuery } from "../../store/slices/customerSlice";
import { useCreateCustomerLogMutation } from "../../store/slices/customerLogSlice";
import Textarea from "@mui/joy/Textarea";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const customerInteractions = ["Meeting", "Call", "Email"];

const CreateCustomerLog = () => {
  const [customer, setCustomer] = useState("");
  const [interactionType, setInteractionType] = useState();
  const [date, setDate] = useState("");
  const [time, setTime] = useState();
  const [description, setDescription] = useState("");
  const search = "";
  const sort = "";
  const company = "";
  const industry = "";
  const { data, isLoading: SalesTeamLoading } =
    useGetNonArchivedCustomersSalesQuery({ search, sort, company, industry });
  const [createCustomerLog, { isLoading }] = useCreateCustomerLogMutation();
  const navigate = useNavigate();

  if (SalesTeamLoading || !data) {
    return <Loader />;
  }

  let customers = [];

  data &&
    data.forEach((customer) => {
      customers.push({ _id: customer._id, customer: customer.name });
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { customer, interactionType, date, time, description };
    try {
      toast.loading("creating...", { id: "createLog" });
      const response = await createCustomerLog(userData).unwrap();
      navigate("/sales/dashboard/all-logs");
      toast.success(response?.message, { id: "createLog" });
    } catch (error) {
      toast.error(error.data.message, { id: "createLog" });
    }
  };
  return (
    <>
      <MetaData title={"CRM - Create New Customer Log Sales Rep"} />
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
            mt: -10,
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
          <img
            src="https://img.freepik.com/free-vector/add-new-user_78370-4710.jpg"
            alt="create-opportunity"
            width={400}
            height={400}
          />
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
                mt: { md: 7, sm: 10, xs: 13 },
                mb: 4,
              }}
            >
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "30px" }}
              >
                <h1 className="heading" style={{ color: "#2C3E50" }}>
                  Create New Customer Log
                </h1>
                <Autocomplete
                  disablePortal
                  id="combo-box-second"
                  required
                  options={customers}
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
                  {isLoading ? "Creating..." : "Create Customer Log"}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default CreateCustomerLog;
