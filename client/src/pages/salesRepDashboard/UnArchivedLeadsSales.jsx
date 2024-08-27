import { useTable, useSortBy, usePagination } from "react-table";
import Loader from "./../../components/layout/Loader";
import { Visibility, Edit, Archive } from "@mui/icons-material";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Autocomplete, Box, Button, Paper, TextField, Tooltip, Typography } from "@mui/material";
import { useArchiveLeadSalesRepMutation, useGetNonArchivedLeadsSalesRepQuery } from "../../store/slices/leadSlice";
import MetaData from "../../components/layout/MetaData";
import toast from "react-hot-toast";

const sorts = [
  "Latest",
  "Oldest"
]

const sources = [
  "Website Form",
  "Referral",
  "Social Media",
  "Email Campaign",
  "Trade Show",
  "Cold Call",
  "Others",
]

const UnArchivedLeadsSales = () => {
  const searchRef = useRef("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [source, setSource] = useState("");
  const { data, isLoading } = useGetNonArchivedLeadsSalesRepQuery({ search, sort, source });
  const [archiveLeadSalesRep] = useArchiveLeadSalesRepMutation();
  const navigate = useNavigate();
  const handleGetUserDetails = (id) => {
    navigate(`/sales/dashboard/lead-details/${id}`);
  }

  const handleEditUser = (id) => {
    navigate(`/sales/dashboard/update-lead/${id}`);
  }

  const archiveLead = async (id) => {
    try {
        toast.loading("Archiving...", { id: "archiveLead" });
        const response = await archiveLeadSalesRep(id).unwrap();
        toast.success(response?.message, { id: "archiveLead" })
    } catch (error) {
        toast.error(error.data.message, { id: "archiveLead" })
    }
  }

  const handleSearch = () => {
      setSearch(searchRef.current.value);
  }

  const columns = useMemo(() => [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Contact",
      accessor: "contact",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Source",
      accessor: "source",
    },
    {
      Header: "Actions",
      accessor: "actions",
      //eslint-disable-next-line
      Cell: ({ row }) => (
        <div>
            <Tooltip title="Get Lead Details">
              <Visibility
              style={{ cursor: "pointer", marginRight: "10px" }}
              //eslint-disable-next-line
              onClick={() => handleGetUserDetails(row.original.id)}
              />
            </Tooltip>
            <Tooltip title="Update Lead">
              <Edit
              style={{ cursor: "pointer", marginRight: "10px" }}
              //eslint-disable-next-line
              onClick={() => handleEditUser(row.original.id)}
              />
            </Tooltip>
            <Tooltip title="Archive Lead">
              <Archive
              style={{ cursor: "pointer", marginRight: "10px" }}
              //eslint-disable-next-line
              onClick={() => archiveLead(row.original.id)}
              />
            </Tooltip>
        </div>
      ),
    },
    //eslint-disable-next-line
  ], []);
  
  const displayedLeads = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map(lead => ({
      id: lead._id,
      name: lead.name,
      contact: lead.contact,
      source: lead.source,
      status: lead.status,
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
        {
            (isLoading || !data) ? (
                <Loader />
            ) : (
              <Box className="container">
                <MetaData title={"CRM - UnArchived Leads Manager"} />
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: {md: "row", sm: "column", xs: "column"}, mt: 3, mb: 3, gap: 3 }}>
                  <Box sx={{ width: {md: "80%", sm: "80%", xs: "100%" }, ml: {md: 10, sm: 0, xs: 0} }}>
                    <TextField type='text' inputRef={searchRef} label="Search Leads" sx={{ ml: 2, width: { md: "70%", sm: "60%", xs: "60%"}, height: "40px" }} placeholder="Search Leads By Name" required ></TextField>
                    <Button onClick={handleSearch} sx={{ ml: 2, width: { md: "20%", sm: "25%", xs: "30%"}, background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"}, height: "40px", fontSize: "15px", mt: 1 }} >Search</Button>
                  </Box>
                  <Box sx={{ width: { md: "30%", sm: "80%", xs: "100%" }, mr: {md: 20, sm: 2, xs: 1}, mt: {md: 1, sm: 0, xs: 0}, display: {md: "block", sm: "flex", xs: "flex"}, alignItems: "center" }}>
                  <Typography sx={{ml: {md: 0, sm: 5, xs: 5}, width: {sm: "30%", xs: "34%"}, fontFamily: "Roboto", fontSize: {sm: "20px !important", xs: "19px !important"}, display: {md: "none", sm: "block", xs: "block"} }}><strong>Filter By Sort:</strong></Typography>
                    <Autocomplete
                      disablePortal={true}
                      id="combo-box"
                      value={sort}
                      options={sorts}
                      getOptionLabel={(option) => option || ''}
                      sx={{ ml: 2, width: {md: "90%", sm: "38%", xs: "38%"} }}
                      renderInput={(params) => <TextField {...params} label="Sort" />}
                      onChange={(e, newValue) => setSort(newValue ? newValue : null)}
                      PaperComponent={(props) => (
                      <Paper {...props} sx={{ maxHeight: 100, overflowY: 'auto' }} />
                    )}
                  />
                </Box>
                <Box sx={{ width: { md: "30%", sm: "80%", xs: "100%" }, mr: {md: 20, sm: 2, xs: 1}, mt: {md: 1, sm: 0, xs: 0}, display: {md: "none", sm: "flex", xs: "flex"}, alignItems: "center" }}>
                <Typography sx={{ml: {md: 0, sm: 5, xs: 3}, width: {sm: "32%", xs: "39%"}, fontFamily: "Roboto", fontSize: {sm: "20px !important", xs: "19px !important"}, display: {md: "none", sm: "block", xs: "block"} }}><strong>Filter By Source:</strong></Typography>
                    <Autocomplete
                      disablePortal={true}
                      id="combo-box-demo"
                      options={sources}
                      getOptionLabel={(option) => option || ''}
                      sx={{ ml: 2, width: {md: "90%", sm: "38%", xs: "38%"} }}
                      renderInput={(params) => <TextField {...params} label="Source" />}
                      onChange={(e, newValue) => setSource(newValue ? newValue : null)}
                      ListboxProps={{
                        style: {
                          maxHeight: '100px',
                          overflowY: 'auto',
                        }
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: {md: "flex", sm: "none", xs: "none"}, justifyContent: "center", alignItems: "center", width: "70%", mb: 3 }}>
                <Typography sx={{ml: 35, width: "80%", fontFamily: "Roboto", fontSize: "20px !important" }}><strong>Filter By Source:</strong></Typography>
                <Autocomplete
                    disablePortal={true}
                    id="combo-box"
                    options={sources}
                    getOptionLabel={(option) => option || ''}
                    sx={{ ml: 2, width: "90%" }}
                    renderInput={(params) => <TextField {...params} label="Source" />}
                    onChange={(e, newValue) => setSource(newValue ? newValue : null)}
                    ListboxProps={{
                        style: {
                          maxHeight: '100px',
                          overflowY: 'auto',
                        }
                    }}
                />
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
                    {
                      (search || source) ? (
                        <span>{displayedLeads?.length} Documents matches your search</span>
                      ) : (
                        <span style={{ marginLeft: "50px" }}>Total {displayedLeads?.length} Documents</span>
                      )
                    }
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
            )
        }
    </>
  )
}

export default UnArchivedLeadsSales
