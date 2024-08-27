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
import { useGetNonArchivedOpportunitiesQuery } from "../../store/slices/opportunitySlice";
import { useGetNonArchivedCustomersSalesQuery } from "../../store/slices/customerSlice";
import {
  useGetSaleDetailsQuery,
  useUpdateSaleMutation,
} from "../../store/slices/saleSlice";

const PaymentTerms = [
  "Net 15",
  "Net 30",
  "Net 60",
  "Due on Receipt",
  "Installments",
  "Prepaid",
  "COD(Cash On Delivery)",
];

const UpdateSale = () => {
  const { id } = useParams();
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
  const { data: saleData, isLoading: saleLoading } = useGetSaleDetailsQuery(id);
  const [updateSale, { isLoading }] = useUpdateSaleMutation();
  const navigate = useNavigate();

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    if (saleData) {
      setOpportunity(saleData?.sale?.opportunity._id || "");
      setValue(saleData?.sale?.value || "");
      setCustomer(saleData?.sale?.customer?._id || "");
      setClosedDateSales(formatDate(saleData?.sale?.closedDate) || "");
      setProductsSold(saleData?.sale?.productsSold || "");
      setPaymentTerms(saleData?.sale?.paymentTerms || "");
    }
  }, [saleData]);

  if (
    SalesTeamLoading ||
    !data ||
    !CustomerData ||
    customerLoading ||
    !saleData ||
    saleLoading
  ) {
    return <Loader />;
  }

  const handleE = (e) => {
    if (e.key === "E" || e.key === "e") {
      e.preventDefault();
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const leadData = {
      id,
      opportunity,
      value,
      customer,
      closedDate: closedDateSales,
      productsSold,
      paymentTerms,
    };
    try {
      toast.loading("updating...", { id: "updateSale" });
      const response = await updateSale(leadData).unwrap();
      navigate(`/dashboard/sale-details/${id}`);

      toast.success(response?.message, { id: "updateSale" });
    } catch (error) {
      toast.error(error.data.message, { id: "updateSale" });
    }
  };
  return (
    <>
      <MetaData title={"CRM - Update Sale SalesRep"} />
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
          Opportunities and CustomeRs.If you want to assign Sale to Archived
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
          <img
            src={updateProfile}
            alt="update-opportunity"
            width={350}
            height={380}
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
                  Update Sale
                </h1>
                <Autocomplete
                  disablePortal
                  id="combo-box-pro"
                  required
                  options={opportunities}
                  value={
                    opportunities.find((rep) => rep._id === opportunity) || null
                  }
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
                  value={paymentTerms}
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
                  {isLoading ? "Updating..." : "Update Sale"}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default UpdateSale;
