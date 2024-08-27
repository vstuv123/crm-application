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
import { useGetNonArchivedOpportunitiesQuery } from "../../store/slices/opportunitySlice";
import { useCreateSaleMutation } from "../../store/slices/saleSlice";

const PaymentTerms = [
  "Net 15",
  "Net 30",
  "Net 60",
  "Due on Receipt",
  "Installments",
  "Prepaid",
  "COD(Cash On Delivery)",
];

const CreateSale = () => {
  const [opportunity, setOpportunity] = useState("");
  const [value, setValue] = useState("");
  const [customer, setCustomer] = useState("");
  const [closedDateSales, setClosedDateSales] = useState("");
  const [productsSold, setProductsSold] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const search = "";
  const sort = "";
  const stage = "";
  const closedDate = "";
  const company = "";
  const industry = "";
  const { data, isLoading: SalesTeamLoading } =
    useGetNonArchivedOpportunitiesQuery({ search, sort, stage, closedDate });
  const { data: CustomerData, isLoading: customerLoading } =
    useGetNonArchivedCustomersSalesQuery({ search, sort, company, industry });
  const [createSale, { isLoading }] = useCreateSaleMutation();
  const navigate = useNavigate();

  if (SalesTeamLoading || !data || !CustomerData || customerLoading) {
    return <Loader />;
  }

  let opportunities = [];

  data &&
    data.forEach((opportunity) => {
      opportunities.push({
        _id: opportunity._id,
        opportunity: opportunity.name,
      });
    });

  let customers = [];

  CustomerData &&
    CustomerData.forEach((customer) => {
      customers.push({ _id: customer._id, customer: customer.name });
    });

  const handleE = (e) => {
    if (e.key === "E" || e.key === "e") {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const saleData = {
      opportunity,
      value,
      customer,
      closedDate: closedDateSales,
      productsSold,
      paymentTerms,
    };
    try {
      toast.loading("creating...", { id: "createSale" });
      const response = await createSale(saleData).unwrap();
      navigate("/sales/dashboard/all-sales");
      toast.success(response?.message || "Sale Created Successfully", {
        id: "createSale",
      });
    } catch (error) {
      toast.error(error.data.message || "An unexpected error occurred", {
        id: "createSale",
      });
    }
  };
  return (
    <>
      <MetaData title={"CRM - Create New Sale - Sale Rep"} />
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
          <strong>Note:</strong>&nbsp; You can assign Sales to only UnArchived
          Opportunities and CustomeRs.If you want to assign Sales to Archived
          Opportunities and Customers, then first UnArchive them.
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
            mt: -20,
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
            alt="create-sale"
            width={400}
            height={500}
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
                mt: { md: 12, sm: 15, xs: 18 },
                mb: 4,
              }}
            >
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "30px" }}
              >
                <h1 className="heading" style={{ color: "#2C3E50" }}>
                  Create New Sale
                </h1>
                <Autocomplete
                  disablePortal
                  id="combo-box-pro"
                  required
                  options={opportunities}
                  getOptionLabel={(option) => option.opportunity || ""}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  sx={{ ml: 2, width: "90%" }}
                  renderInput={(params) => (
                    <TextField {...params} label="Opportunity Name" />
                  )}
                  onChange={(e, newValue) =>
                    setOpportunity(newValue ? newValue._id : null)
                  }
                  ListboxProps={{
                    style: {
                      maxHeight: "100px",
                      overflowY: "auto",
                    },
                  }}
                />
                <TextField
                  type="number"
                  value={value}
                  label="Value"
                  sx={{ ml: 2, width: "90%" }}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleE}
                  required
                ></TextField>
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
                <TextField
                  type="date"
                  label="Closed Date"
                  value={closedDateSales}
                  InputLabelProps={{ shrink: true }}
                  sx={{ ml: 2, width: "90%" }}
                  onChange={(e) => setClosedDateSales(e.target.value)}
                  required
                ></TextField>
                <TextField
                  type="number"
                  value={productsSold}
                  label="Products Sold"
                  sx={{ ml: 2, width: "90%" }}
                  onChange={(e) => setProductsSold(e.target.value)}
                  onKeyDown={handleE}
                  required
                ></TextField>

                <Autocomplete
                  disablePortal
                  id="combo-box-third"
                  required
                  options={PaymentTerms}
                  getOptionLabel={(option) => option || ""}
                  sx={{ ml: 2, width: "90%" }}
                  renderInput={(params) => (
                    <TextField {...params} label="Payment Terms" />
                  )}
                  onChange={(e, newValue) =>
                    setPaymentTerms(newValue ? newValue : null)
                  }
                  ListboxProps={{
                    style: {
                      maxHeight: "100px",
                      overflowY: "auto",
                    },
                  }}
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
                  {isLoading ? "Creating..." : "Create Sale"}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default CreateSale;
