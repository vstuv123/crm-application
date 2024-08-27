import { useTable, useSortBy, usePagination } from "react-table";
import Loader from "./../../components/layout/Loader";
import { Visibility } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Tooltip } from "@mui/material";
import MetaData from "../../components/layout/MetaData";
import toast from "react-hot-toast";
import { useGetLeadsOfSaleRepMutation } from "../../store/slices/leadSlice";

const GetLeadsOfSalesRep = () => {
  const location = useLocation();
  const [id, setId] = useState(location.state?.id || "");
  const [getLeadsOfSalesRep, { isLoading }] = useGetLeadsOfSaleRepMutation();
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
    sessionStorage.setItem("previousPath", window.location.pathname);
    navigate(`/manager/dashboard/lead-details/${id}`, { state: { id, data } });
  };

  const handleSearch = async () => {
    const IdData = { id };
    try {
      const response = await getLeadsOfSalesRep(IdData).unwrap();
      setData(response?.leads);

      sessionStorage.setItem("id", id);
      sessionStorage.setItem("data", JSON.stringify(response?.leads));

      navigate(".", {
        replace: true,
        state: {
          id,
          data: response?.leads,
          from: "/manager/dashboard/leads/sales-rep",
        },
      });
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  const displayedLeads = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((lead) => ({
      id: lead._id,
      name: lead.name,
      contact: lead.contact,
      source: lead.source,
      status: lead.status,
      archived: lead.isArchived === true ? "Archived" : "Non- Archived",
    }));
  }, [data]);

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
        Header: "Contact",
        accessor: "contact",
      },
      {
        Header: "Source",
        accessor: "source",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "IsArchived",
        accessor: "archived",
      },
      {
        Header: "Actions",
        accessor: "actions",
        //eslint-disable-next-line
        Cell: ({ row }) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Get Customer Details">
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
    ],
    []
  );

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
          <MetaData title={"CRM - Search Leads By Sales Rep Id Manager"} />
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
                label="Sale Rep Id"
                sx={{
                  ml: 2,
                  width: { md: "70%", sm: "60%", xs: "60%" },
                  height: "40px",
                }}
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter Sales Rep Id here"
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
            {data.length > 0 ? (
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

export default GetLeadsOfSalesRep;
