import { useTable, useSortBy, usePagination } from "react-table";
import Loader from "./../../components/layout/Loader";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Box,
  Button,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import MetaData from "../../components/layout/MetaData";
import toast from "react-hot-toast";
import {
  useDeleteSaleMutation,
  useGetAllSalesSaleRepQuery,
} from "../../store/slices/saleSlice";

const sorts = ["Latest", "Oldest"];

const values = [
  "0 to 2000",
  "2000 to 4000",
  "4000 to 6000",
  "6000 to 8000",
  "8000 to 10000",
  "10000 or more",
];

const GetAllSales = () => {
  const searchRef = useRef("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [value, setValue] = useState("");
  const [closedDate, setClosedDate] = useState("");
  const { data, isLoading } = useGetAllSalesSaleRepQuery({
    sort,
    value,
    closedDate,
  });
  const [deleteSale] = useDeleteSaleMutation();
  const navigate = useNavigate();

  const handleGetUserDetails = (id) => {
    navigate(`/dashboard/sale-details/${id}`);
  };

  const handleEditUser = (id) => {
    navigate(`/sales/dashboard/update-sale/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      toast.loading("Deleting...", { id: "deleteSale" });
      const response = await deleteSale(id).unwrap();
      toast.success(response?.message, { id: "deleteSale" });
    } catch (error) {
      toast.error(error.data.message, { id: "deleteSale" });
    }
  };

  const handleSearch = () => {
    setSearch(searchRef.current.value);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const handleValueChange = (e, newValue) => {
    if (newValue) {
      const parts = newValue.split(" to ");
      const minValue = parseInt(parts[0], 10);
      const maxValue = parts[1] ? parseInt(parts[1], 10) : Infinity;
      setValue([minValue, maxValue]);
    } else {
      setValue([null, null]);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Opportunity Name",
        accessor: "opName",
      },
      {
        Header: "Value (PKR)",
        accessor: "value",
      },
      {
        Header: "Customer Name",
        accessor: "cmName",
      },
      {
        Header: "ClosedDate",
        accessor: "closedDate",
      },
      {
        Header: "Products Sold",
        accessor: "productsSold",
      },
      {
        Header: "Payment Terms",
        accessor: "paymentTerms",
      },
      {
        Header: "Actions",
        accessor: "actions",
        //eslint-disable-next-line
        Cell: ({ row }) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Get Sale Details">
              <Visibility
                style={{ cursor: "pointer", marginRight: "10px" }}
                //eslint-disable-next-line
                onClick={() => handleGetUserDetails(row.original.id)}
              />
            </Tooltip>
            <Tooltip title="Update Sale">
              <Edit
                style={{ cursor: "pointer", marginRight: "10px" }}
                //eslint-disable-next-line
                onClick={() => handleEditUser(row.original.id)}
              />
            </Tooltip>
            <Tooltip title="Delete Sale">
              <Delete
                style={{ cursor: "pointer", marginRight: "10px", color: "red" }}
                //eslint-disable-next-line
                onClick={() => handleDelete(row.original.id)}
              />
            </Tooltip>
          </div>
        ),
      },
      //eslint-disable-next-line
    ],
    []
  );

  const displayedLeads = useMemo(() => {
    if (!data || data.length === 0) return [];
    const filteredData = data.filter((sale) => {
      const searchTerm = search.toLowerCase();
      const opName = sale.opportunity.toLowerCase();
      const cmName = sale.customer.toLowerCase();

      return opName.includes(searchTerm) || cmName.includes(searchTerm);
    });
    return filteredData.map((sale) => ({
      id: sale._id,
      opName: sale.opportunity,
      value: `Rs.${sale.value}`,
      cmName: sale.customer,
      closedDate: formatDate(sale.closedDate),
      productsSold: sale.productsSold,
      paymentTerms: sale.paymentTerms,
    }));
  }, [data, search]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    state: { pageIndex },
    pageCount,
    gotoPage,
  } = useTable(
    {
      columns,
      data: displayedLeads,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  if (isLoading || !data) {
    return <Loader />;
  }

  return (
    <>
      {isLoading || !data ? (
        <Loader />
      ) : (
        <Box className="container">
          <MetaData title={"CRM - All Sales SalesRep"} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: { md: "row", sm: "column", xs: "column" },
              mt: 3,
              mb: 3,
              gap: 3,
            }}
          >
            <Box
              sx={{
                width: { md: "80%", sm: "80%", xs: "100%" },
                ml: { md: 10, sm: 0, xs: 0 },
              }}
            >
              <TextField
                type="text"
                inputRef={searchRef}
                label="Search Sales"
                sx={{
                  ml: 2,
                  width: { md: "70%", sm: "60%", xs: "60%" },
                  height: "40px",
                }}
                placeholder="Search Sales By Opportunity Name or Customer Name"
                required
              ></TextField>
              <Button
                onClick={handleSearch}
                sx={{
                  ml: 2,
                  width: { md: "20%", sm: "25%", xs: "30%" },
                  background: "#d39925",
                  color: "white",
                  "&:hover": { backgroundColor: "#c08717" },
                  "&:focus": { backgroundColor: "#c08717" },
                  "&:active": { backgroundColor: "#c08717" },
                  height: "40px",
                  fontSize: "15px",
                  mt: 1,
                }}
              >
                Search
              </Button>
            </Box>
            <Box
              sx={{
                width: { md: "30%", sm: "80%", xs: "100%" },
                mr: { md: 20, sm: 2, xs: 1 },
                mt: { md: 1, sm: 0, xs: 0 },
                display: { md: "block", sm: "flex", xs: "flex" },
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  ml: { md: 0, sm: 5, xs: 5 },
                  width: { sm: "30%", xs: "34%" },
                  fontFamily: "Roboto",
                  fontSize: { sm: "18px !important", xs: "17px !important" },
                  display: { md: "none", sm: "block", xs: "block" },
                }}
              >
                <strong>Filter By Sort:</strong>
              </Typography>
              <Autocomplete
                disablePortal={true}
                id="combo-box"
                value={sort}
                options={sorts}
                getOptionLabel={(option) => option || ""}
                sx={{ ml: 2, width: { md: "90%", sm: "38%", xs: "46%" } }}
                renderInput={(params) => <TextField {...params} label="Sort" />}
                onChange={(e, newValue) => setSort(newValue ? newValue : null)}
                PaperComponent={(props) => (
                  <Paper
                    {...props}
                    sx={{ maxHeight: 100, overflowY: "auto" }}
                  />
                )}
              />
            </Box>
            <Box
              sx={{
                width: { md: "30%", sm: "80%", xs: "100%" },
                mr: { md: 20, sm: 2, xs: 1 },
                mt: { md: 1, sm: 0, xs: 0 },
                display: { md: "none", sm: "flex", xs: "flex" },
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  ml: { md: 0, sm: 4, xs: 2 },
                  width: { sm: "32%", xs: "40%" },
                  fontFamily: "Roboto",
                  fontSize: { sm: "18px !important", xs: "17px !important" },
                  display: { md: "none", sm: "block", xs: "block" },
                }}
              >
                <strong>Filter By Value:</strong>
              </Typography>
              <Autocomplete
                disablePortal={true}
                id="combo-box-demo"
                options={values}
                getOptionLabel={(option) => option || ""}
                sx={{ ml: 2, width: { md: "90%", sm: "38%", xs: "46%" } }}
                renderInput={(params) => (
                  <TextField {...params} label="Value Range" />
                )}
                onChange={handleValueChange}
                ListboxProps={{
                  style: {
                    maxHeight: "100px",
                    overflowY: "auto",
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                width: { md: "30%", sm: "80%", xs: "100%" },
                mr: { md: 20, sm: 2, xs: 1 },
                mt: { md: 1, sm: 0, xs: 0 },
                display: { md: "none", sm: "flex", xs: "flex" },
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  ml: { md: 0, sm: 4, xs: 2 },
                  width: { sm: "32%", xs: "39%" },
                  fontFamily: "Roboto",
                  fontSize: { sm: "18px !important", xs: "17px !important" },
                  display: { md: "none", sm: "block", xs: "block" },
                }}
              >
                <strong>Filter By ClsDate:</strong>
              </Typography>
              <TextField
                type="date"
                label="Closed Date"
                InputLabelProps={{ shrink: true }}
                sx={{ ml: 2, width: { md: "90%", sm: "38%", xs: "46%" } }}
                onChange={(e) => setClosedDate(e.target.value)}
                required
              ></TextField>
            </Box>
          </Box>
          <Box
            sx={{
              display: { md: "flex", sm: "none", xs: "none" },
              justifyContent: "center",
              alignItems: "center",
              width: "70%",
              mb: 3,
            }}
          >
            <Typography
              sx={{
                ml: 35,
                width: "80%",
                fontFamily: "Roboto",
                fontSize: "18px !important",
              }}
            >
              <strong>Filter By Value:</strong>
            </Typography>
            <Autocomplete
              disablePortal={true}
              id="combo-box"
              options={values}
              getOptionLabel={(option) => option || ""}
              sx={{ ml: 2, width: "90%" }}
              renderInput={(params) => (
                <TextField {...params} label="Value Range" />
              )}
              onChange={handleValueChange}
              ListboxProps={{
                style: {
                  maxHeight: "100px",
                  overflowY: "auto",
                },
              }}
            />
          </Box>
          <Box
            sx={{
              display: { md: "flex", sm: "none", xs: "none" },
              justifyContent: "center",
              alignItems: "center",
              width: "70%",
              mb: 3,
            }}
          >
            <Typography
              sx={{
                ml: 35,
                width: "80%",
                fontFamily: "Roboto",
                fontSize: "18px !important",
              }}
            >
              <strong>Filter By ClsDate:</strong>
            </Typography>
            <TextField
              type="date"
              label="Closed Date"
              InputLabelProps={{ shrink: true }}
              sx={{ ml: 2, width: "90%" }}
              onChange={(e) => setClosedDate(e.target.value)}
              required
            ></TextField>
          </Box>
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((hg, index) => (
                <tr key={index} {...hg.getHeaderGroupProps()}>
                  {hg.headers.map((column, colIndex) => (
                    <th
                      key={colIndex}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      {column.isSorted && (
                        <span>{column.isSortedDesc ? " ⬇️" : " ⬆️"}</span>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr key={row.id} {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td key={cell.column.id} {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Box className="span">
            {search || value || closedDate ? (
              <span>
                {displayedLeads?.length} Documents matches your search
              </span>
            ) : (
              <span style={{ marginLeft: "50px" }}>
                Total {displayedLeads?.length} Documents
              </span>
            )}
          </Box>
          <Box className="btn-container">
            <button disabled={pageIndex === 0} onClick={() => gotoPage(0)}>
              First
            </button>
            <button disabled={!canPreviousPage} onClick={() => previousPage()}>
              Prev
            </button>
            <span>
              {pageIndex + 1} of {pageCount}
            </span>
            <button disabled={!canNextPage} onClick={() => nextPage()}>
              Next
            </button>
            <button
              disabled={pageIndex === pageCount - 1}
              onClick={() => gotoPage(pageCount - 1)}
            >
              Last
            </button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default GetAllSales;
