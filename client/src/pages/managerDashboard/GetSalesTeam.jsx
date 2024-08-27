import { useTable, useSortBy, usePagination } from "react-table";
import { useGetSalesTeamManagerQuery } from "../../store/slices/userSlice";
import Loader from "./../../components/layout/Loader";
import { Visibility } from "@mui/icons-material";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Autocomplete, Box, Button, Paper, TextField, Tooltip } from "@mui/material";
import MetaData from "../../components/layout/MetaData";

const sorts = [
  "Latest",
  "Oldest"
]

const GetSalesTeam = () => {
  const searchRef = useRef("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const { data, isLoading } = useGetSalesTeamManagerQuery({ search, sort });
  const navigate = useNavigate();
  const handleGetUserDetails = (id) => {
    navigate(`/manager/dashboard/sales-rep-details/${id}`);
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
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Role",
      accessor: "role",
    },
    {
      Header: "Actions",
      accessor: "actions",
      //eslint-disable-next-line
      Cell: ({ row }) => (
        <div>
            <Tooltip title="Get Sales Rep Details">
              <Visibility
                style={{ cursor: "pointer", marginRight: "10px" }}
                //eslint-disable-next-line
                onClick={() => handleGetUserDetails(row.original.id)}
              />
            </Tooltip>
        </div>
      ),
    },
    //eslint-disable-next-line
  ], []);
  
  const displayedUsers = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data?.users?.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
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
      data: displayedUsers,
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
                <MetaData title={"CRM - Sales Team Manager"} />
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: {md: "row", sm: "column", xs: "column"}, mt: 3, mb: 3, gap: 3 }}>
                  <Box sx={{ width: {md: "80%", sm: "80%", xs: "100%" }, ml: {md: 10, sm: 0, xs: 0} }}>
                    <TextField type='text' inputRef={searchRef} label="Search Users" sx={{ ml: 2, width: { md: "70%", sm: "60%", xs: "60%"}, height: "40px" }} placeholder="Search Users By Name or Email" required ></TextField>
                    <Button onClick={handleSearch} sx={{ ml: 2, width: { md: "20%", sm: "25%", xs: "30%"}, background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"}, height: "40px", fontSize: "15px", mt: 1 }} >Search</Button>
                  </Box>
                  <Box sx={{ width: { md: "30%", sm: "40%", xs: "50%" }, mr: {md: 20, sm: 8, xs: 5}, mt: {md: 1, sm: 0, xs: 0} }}>
                    <Autocomplete
                      disablePortal={true}
                      id="combo-box-demo"
                      value={sort}
                      options={sorts}
                      getOptionLabel={(option) => option || ''}
                      sx={{ ml: 2, width: "90%" }}
                      renderInput={(params) => <TextField {...params} label="Sort" />}
                      onChange={(e, newValue) => setSort(newValue ? newValue : null)}
                      PaperComponent={(props) => (
                      <Paper {...props} sx={{ maxHeight: 100, overflowY: 'auto' }} />
                    )}
                  />
                </Box>
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
                      search ? (
                        <span>{displayedUsers?.length} Documents matches your search</span>
                      ) : (
                        <span style={{ marginLeft: "50px" }}>Total {displayedUsers?.length} Documents</span>
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
  );
};

export default GetSalesTeam;

