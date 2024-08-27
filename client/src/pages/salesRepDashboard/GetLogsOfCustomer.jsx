import { useTable, useSortBy, usePagination } from "react-table";
import Loader from "./../../components/layout/Loader";
import { Visibility } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Tooltip } from "@mui/material";
import MetaData from "../../components/layout/MetaData";
import toast from "react-hot-toast";
import { useGetLogsOfCustomerMutation } from "../../store/slices/customerLogSlice";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';


const GetLogsOfCustomer = () => {
  const location = useLocation();
  const [id, setId] = useState(location.state?.id || "");
  const [getLogsOfCustomer, {isLoading}] = useGetLogsOfCustomerMutation();
  const [data, setData] = useState(location.state?.data || []);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.id) {
      setId(location.state.id);
    }
    if (location.state?.data) {
      setData(location.state.data);
    }
  }, [location.state]);

  const handleGetUserDetails = (id) => {
    sessionStorage.setItem('previousPath', window.location.pathname);
    navigate(`/sales/dashboard/log-details/${id}`, { state: { id, data } });
  }
  const handleSearch = async () => {
      const IdData = { id };
      try {
        const response = await getLogsOfCustomer(IdData).unwrap();
        setData(response?.interactions);

        sessionStorage.setItem('id', id);
        sessionStorage.setItem('data', JSON.stringify(response?.interactions));

        navigate(".", { replace: true, state: { id, data: response?.interactions, from: '/sales/dashboard/logs/customer' } });

      } catch (error) {
        toast.error(error?.data?.message);
      }
  }

  dayjs.extend(utc);
  dayjs.extend(timezone);
  
  function formatTimeFromISO(isoDateString) {
    // Parse the ISO date string into a dayjs object
    const date = dayjs(isoDateString).local(); // Convert to local time if needed
  
    // Format the time to 'hh:mm:ss A'
    return date.format('hh:mm:ss A');
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}


const columns = useMemo(() => [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Customer Name",
      accessor: "cmName",
    },
    {
      Header: "Interaction Type",
      accessor: "interactionType",
    },
    {
      Header: "Date",
      accessor: "date",
    },
    {
      Header: "Time",
      accessor: "time",
    },
    {
        Header: "Description",
        accessor: "description",
    },
    {
      Header: "Actions",
      accessor: "actions",
      //eslint-disable-next-line
      Cell: ({ row }) => (
        <div style={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Get Customer Log Details">
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

  console.log(id);
  
  const displayedLeads = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map(log => ({
      id: log._id,
      cmName: log.customer,
      interactionType: log.interactionType,
      date: formatDate(log.date),
      time: formatTimeFromISO(log.time),
      description: log.description
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
                <MetaData title={"CRM - Search Logs Of Single Customer Sales Rep"} />
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: {md: "row", sm: "column", xs: "column"}, mt: 3, mb: 3, gap: 3 }}>
                  <Box sx={{ width: {md: "80%", sm: "80%", xs: "100%" }, ml: {md: 10, sm: 0, xs: 0} }}>
                    <TextField type='text' label="Customer Id" sx={{ ml: 2, width: { md: "70%", sm: "60%", xs: "60%"}, height: "40px" }} value={id} onChange={(e) => setId(e.target.value)} placeholder="Enter Customer Id here" required ></TextField>
                    <Button onClick={handleSearch} sx={{ ml: 2, width: { md: "20%", sm: "25%", xs: "30%"}, background: "#d39925", color: "white", '&:hover': {backgroundColor: "#c08717"}, '&:focus': {backgroundColor: "#c08717"}, '&:active': {backgroundColor: "#c08717"}, height: "40px", fontSize: "15px", mt: 1 }} >Search</Button>
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
                      (data.length > 0) ? (
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

export default GetLogsOfCustomer