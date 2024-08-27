import { useTable, useSortBy, usePagination } from "react-table";
import Loader from "./../../components/layout/Loader";
import { Visibility, Edit, Archive } from "@mui/icons-material";
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
  useArchiveOpportunityMutation,
  useGetNonArchivedOpportunitiesQuery,
} from "../../store/slices/opportunitySlice";

const sorts = ["Latest", "Oldest"];

const stages = ["Qualification", "Proposal", "Negotiation", "Closed"];

const NonArchivedOpportunities = () => {
  const searchRef = useRef("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [stage, setStage] = useState("");
  const [closedDate, setClosedDate] = useState("");
  const { data, isLoading } = useGetNonArchivedOpportunitiesQuery({
    search,
    sort,
    stage,
    closedDate,
  });
  const [archiveOpportunity] = useArchiveOpportunityMutation();
  const navigate = useNavigate();
  const handleGetUserDetails = (id) => {
    navigate(`/sales/dashboard/opportunity-details/${id}`);
  };

  const handleEditUser = (id) => {
    navigate(`/sales/dashboard/update-opportunity/${id}`);
  };

  const archiveCustomer = async (id) => {
    try {
      toast.loading("Archiving...", { id: "archiveOpportunity" });
      const response = await archiveOpportunity(id).unwrap();
      toast.success(response?.message, { id: "archiveOpportunity" });
    } catch (error) {
      toast.error(error.data.message, { id: "archiveOpportunity" });
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

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Value (PKR)",
        accessor: "value",
      },
      {
        Header: "Stage",
        accessor: "stage",
      },
      {
        Header: "ClosedDate",
        accessor: "closedDate",
      },
      {
        Header: "Actions",
        accessor: "actions",
        //eslint-disable-next-line
        Cell: ({ row }) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Get Opportunity Details">
              <Visibility
                style={{ cursor: "pointer", marginRight: "10px" }}
                //eslint-disable-next-line
                onClick={() => handleGetUserDetails(row.original.id)}
              />
            </Tooltip>
            <Tooltip title="Update Opportunity">
              <Edit
                style={{ cursor: "pointer", marginRight: "10px" }}
                //eslint-disable-next-line
                onClick={() => handleEditUser(row.original.id)}
              />
            </Tooltip>
            <Tooltip title="Archive Opportunity">
              <Archive
                style={{ cursor: "pointer", marginRight: "10px" }}
                //eslint-disable-next-line
                onClick={() => archiveCustomer(row.original.id)}
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
    return data.map((opportunity) => ({
      id: opportunity._id,
      name: opportunity.name,
      value: `Rs.${opportunity.value}`,
      stage: opportunity.stage,
      closedDate: formatDate(opportunity.closedDate),
    }));
  }, [data]);

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
          <MetaData title={"CRM - UnArchived Opportunities SalesRep"} />
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
                label="Search Opportunities"
                sx={{
                  ml: 2,
                  width: { md: "70%", sm: "60%", xs: "60%" },
                  height: "40px",
                }}
                placeholder="Search Opportunities By Name"
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
                <strong>Filter By Stage:</strong>
              </Typography>
              <Autocomplete
                disablePortal={true}
                id="combo-box-demo"
                options={stages}
                getOptionLabel={(option) => option || ""}
                sx={{ ml: 2, width: { md: "90%", sm: "38%", xs: "46%" } }}
                renderInput={(params) => (
                  <TextField {...params} label="Stage" />
                )}
                onChange={(e, newValue) => setStage(newValue ? newValue : null)}
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
              <strong>Filter By Stage:</strong>
            </Typography>
            <Autocomplete
              disablePortal={true}
              id="combo-box"
              options={stages}
              getOptionLabel={(option) => option || ""}
              sx={{ ml: 2, width: "90%" }}
              renderInput={(params) => <TextField {...params} label="Stage" />}
              onChange={(e, newValue) => setStage(newValue ? newValue : null)}
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
            {search || stage || closedDate ? (
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

export default NonArchivedOpportunities;
