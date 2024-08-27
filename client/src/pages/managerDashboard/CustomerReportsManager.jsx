import { getISOWeek } from "date-fns";
import { Box, Typography, Button, TextField } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LineElement,
  PointElement,
  LineController,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import { getMonthYear, numberWeekOfMonth } from "../../helpers/date";
import { useState } from "react";
import toast from "react-hot-toast";
import { useGetSalesOfCustomerMutation } from "../../store/slices/saleSlice";
import { useGetNonArchivedCustomersQuery } from "../../store/slices/customerSlice";
import { useGetLogsOfCustomerMutation } from "../../store/slices/customerLogSlice";
import Loader from "../../components/layout/Loader";

ChartJS.register(
  CategoryScale,
  LineElement,
  PointElement,
  LineController,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CustomerReports = () => {
  const date = new Date();
  const monthYear = getMonthYear(date);
  const currentWeekIndex = numberWeekOfMonth(date) - 1;
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
  const [id, setId] = useState("");
  const [frequencyData, setFrequencyData] = useState([]);
  const [singleCustomerSalesData, setSingleCustomerSalesData] = useState([]);
  const sort = "";
  const search = "";
  const company = "";
  const industry = "";
  const { data: customerData, isLoading: customerLoading } =
    useGetNonArchivedCustomersQuery({ search, sort, company, industry });
    const [getSalesOfCustomer] = useGetSalesOfCustomerMutation();
    const [getLogsOfCustomer] = useGetLogsOfCustomerMutation();

    if (customerLoading || !customerData) {
        return <Loader />
      }

      const handleSales = async () => {
        const IdData = { id };
        try {
          toast.loading("Loading data...", { id: "Load" });
      
          // Execute both requests in parallel
          const [logsResponse, salesResponse] = await Promise.all([
            getLogsOfCustomer(IdData).unwrap(),
            getSalesOfCustomer(IdData).unwrap()
          ]);
      
          // Set state with the results
          setSingleCustomerSalesData(salesResponse?.sales);
          setFrequencyData(logsResponse?.interactions);
      
        } catch (error) {
          toast.error(error?.data?.message || "An error occurred", { id: "Load" });
        } finally {
          toast.dismiss("Load");
        }
      };

  const interactionsByType = frequencyData.reduce((acc, interaction) => {
    acc[interaction.interactionType] =
      (acc[interaction.interactionType] || 0) + 1;
    return acc;
  }, {});

  const interactionTypes = Object.keys(interactionsByType);
  const interactionCounts = Object.values(interactionsByType);

  const placeholderData = {
    labels: ["No Data"],
    datasets: [
      {
        data: [1], // A single slice for "No Data"
        backgroundColor: ["#E0E0E0"],
        hoverBackgroundColor: ["#BDBDBD"],
      },
    ],
  };

  const historyBarData = frequencyData && frequencyData.length > 0 ? {
    labels: interactionTypes,
    datasets: [
      {
        label: "Interaction Distribution",
        data: interactionCounts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  } : placeholderData;


  const interactionsPerWeek = {};
  frequencyData.forEach((log) => {
    const date = new Date(log.time);
    const weekNumber = getISOWeek(date);
    const year = date.getFullYear();
    const weekYear = `Week ${weekNumber}, ${year}`;
    if (!interactionsPerWeek[weekYear]) {
      interactionsPerWeek[weekYear] = 0;
    }
    interactionsPerWeek[weekYear] += 1;
  });

  const logWeeks = Object.keys(interactionsPerWeek);
  const logFrequencies = Object.values(interactionsPerWeek);

  const historyChartData = {
    labels: logWeeks,
    datasets: [
      {
        label: "Number of Interactions(Logs) per Week",
        data: logFrequencies,
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        barThickness: 50,
      },
    ],
  };

  const historyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Week",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Customer Interaction History (Customer Logs per Week)",
        },
      },
    },
  };

  const salesWeekVise = {};
  singleCustomerSalesData.forEach((sale) => {
    const date = new Date(sale.closedDate);
    const weekNumber = getISOWeek(date);
    const year = date.getFullYear();
    const weekYear = `Week ${weekNumber}, ${year}`;
    if (!salesWeekVise[weekYear]) {
      salesWeekVise[weekYear] = 0;
    }
    salesWeekVise[weekYear] += 1;
  });

  const week = Object.keys(salesWeekVise);
  const saleFrequencies = Object.values(salesWeekVise);

  const frequencyChartData = {
    labels: week,
    datasets: [
      {
        label: "Sales Frequency (Sales per Week)",
        data: saleFrequencies,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        barThickness: 50,
      },
    ],
  };

  const frequencyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Week",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Interaction Frequency (Sales per Week)",
        },
      },
    },
  };

  const weeklyCustomerCounts = new Array(5).fill(0);
  const filteredCustomers = customerData.filter(customer => {
    return getMonthYear(customer.createdAt) === monthYear;
  });

  const customersByWeek = {
    "Week 1": [],
    "Week 2": [],
    "Week 3": [],
    "Week 4": [],
    "Week 5": []
  };
  

  filteredCustomers.forEach(customer => {
    const date = new Date(customer.createdAt);
    const dayOfMonth = date.getDate();
    if (dayOfMonth <= 7) customersByWeek["Week 1"].push(customer);
    else if (dayOfMonth <= 14) customersByWeek["Week 2"].push(customer);
    else if (dayOfMonth <= 21) customersByWeek["Week 3"].push(customer);
    else if (dayOfMonth <= 28) customersByWeek["Week 4"].push(customer);
    else customersByWeek["Week 5"].push(customer);
  });

  let activeCustomers = [];

    const retentionRates = weeks.map((week, index) => {
      if (index === 0) {
        activeCustomers = [...customersByWeek[week]];
        return 0;
      }

      const currentWeek = `Week ${index + 1}`;

      if (index > currentWeekIndex) {
        return null;
      }

      const previousWeekCustomers = [...activeCustomers];
      const currentWeekCustomers = [...activeCustomers, ...customersByWeek[currentWeek]];

      activeCustomers = currentWeekCustomers;
      const retainedCustomers = previousWeekCustomers.filter(prevCustomer =>
        currentWeekCustomers.some(currCustomer => currCustomer._id === prevCustomer._id)
      );

      const retentionRate = previousWeekCustomers.length > 0
        ? (retainedCustomers.length / previousWeekCustomers.length) * 100
        : 0;

      return retentionRate;
    });

  const retentionData = {
    labels: weeks,
    datasets: [
      {
        label: "Customer Retention Rate (%)",
        data: retentionRates,
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        tension: 0.1,
      },
    ],
  };

  const retentionOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Weeks",
          font: {
            size: 14,
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Retention Rate (%)",
          font: {
            size: 14,
          },
        },
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  customerData.forEach((customer) => {
    if (monthYear.includes(getMonthYear(customer.createdAt))) {
      const week = numberWeekOfMonth(customer.createdAt) - 1;
      weeklyCustomerCounts[week] += 1;
    }
  });

  const newCustomersData = {
    labels: weeks, // X-axis: Weeks
    datasets: [
      {
        label: "Number of New Customers",
        data: weeklyCustomerCounts, // Y-axis: Number of new customers per week
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        barThickness: 30,
      },
    ],
  };

  const newCustomerOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: `Weeks of ${monthYear}`,
          font: {
            size: 14,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
        title: {
          display: true,
          text: "Number of New Customers",
          font: {
            size: 14,
          },
        },
      },
    },
  };


  return (
    <Box
      sx={{
        mt: 3,
        mb: 1,
        height: "100%",
        width: "100%",
        display: { md: "block", sm: "flex", xs: "flex" },
        flexDirection: "column",
      }}
    >
      {" "}
      <Box>
        <Typography
          variant="h1"
          sx={{
            mt: 3,
            textAlign: "center",
            fontFamily: "Roboto",
            fontSize: "32px",
            fontWeight: 600,
            color: "#2C3E50",
          }}
        >
          Customer Reports {monthYear}
        </Typography>
      </Box>
      <Box
        sx={{
          mt: 4,
          mb: 2,
          width: "100%",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "flex-start", // Start from the top
          padding: 1,
          py: 1.6,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            alignSelf: "flex-start",
            fontFamily: "Roboto",
            px: 1,
            fontSize: "18px",
            fontWeight: 500,
            color: "#2C3E50",
          }}
        >
          Track of New Customers Per Week of {monthYear}
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "370px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Bar
            style={{ width: "100%", height: "100%" }}
            data={newCustomersData}
            options={newCustomerOptions}
          />
        </Box>
      </Box>
      <Box
        sx={{
          mt: 4,
          mb: 2,
          width: "100%",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: 1,
          py: 1.6,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            alignSelf: "flex-start",
            fontFamily: "Roboto",
            px: 1,
            fontSize: "18px",
            fontWeight: 500,
            color: "#2C3E50",
          }}
        >
          {monthYear} Weekly Customer Retention Rate
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "370px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Line
            style={{ width: "100%", height: "100%" }}
            data={retentionData}
            options={retentionOptions}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          mt: 5,
          mb: 4,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            textAlign: "center",
            fontFamily: "Roboto",
            fontSize: {md: "32px", sm: "28px", xs: "25px"},
            fontWeight: 600,
            color: "#2C3E50",
            flexGrow: 1,
          }}
        >
          Search By Customer Id To Get Below Reports
        </Typography>
      </Box>
      <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            width: "100%",
            mt: 1,
            mb: 3,
            gap: { md: 3, sm: 3, xs: 2 },
          }}
        >
          <TextField
            type="text"
            label="Customer Id"
            sx={{
              width: { md: "60%", sm: "90%", xs: "90%" },
              height: "35px",
            }}
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter Customer Id here"
            required
          ></TextField>
          <Button
            onClick={handleSales}
            sx={{
              width: { md: "20%", sm: "25%", xs: "30%" },
              background: "#d39925",
              color: "white",
              "&:hover": { backgroundColor: "#c08717" },
              "&:focus": { backgroundColor: "#c08717" },
              "&:active": { backgroundColor: "#c08717" },
              height: "40px",
              fontSize: "15px",
              mt: 2.3,
            }}
          >
            Search
          </Button>
        </Box>
      <Box
        sx={{
          mt: 4,
          mb: 2,
          width: "100%",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: 1,
          py: 1.6,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            alignSelf: "flex-start",
            fontFamily: "Roboto",
            px: 1,
            fontSize: "18px",
            fontWeight: 500,
            color: "#2C3E50",
          }}
        >
          Customer Interaction(By Sales) Frequency per week 2024
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "370px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Bar
            style={{ width: "100%", height: "100%" }}
            data={frequencyChartData}
            options={frequencyChartOptions}
          />
        </Box>
      </Box>
      <Box
        sx={{
          mt: 4,
          mb: 2,
          width: "100%",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: 1,
          py: 1.6,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            alignSelf: "flex-start",
            fontFamily: "Roboto",
            px: 1,
            fontSize: "18px",
            fontWeight: 500,
            color: "#2C3E50",
          }}
        >
          Customer Interaction History per week 2024
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "370px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Bar
            style={{ width: "100%", height: "100%" }}
            data={historyChartData}
            options={historyChartOptions}
          />
        </Box>
      </Box>
      <Box
        sx={{
          mt: 4,
          mb: 2,
          width: "100%",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: 1,
          py: 1.6,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            alignSelf: "flex-start",
            fontFamily: "Roboto",
            px: 1,
            fontSize: "18px",
            fontWeight: 500,
            color: "#2C3E50",
          }}
        >
          Customer Interaction Type History per week 2024
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "370px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pie
          
            style={{ width: "100%", height: "100%" }}
            data={historyBarData}
            options={{ responsive: true }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CustomerReports;

