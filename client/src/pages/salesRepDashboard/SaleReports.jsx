
import { getMonthYear, getWeekOfMonth } from "../../helpers/date";
import { Box, Typography } from "@mui/material";
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
    ArcElement
  } from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useGetNonArchivedLeadsSalesRepQuery } from "../../store/slices/leadSlice";
import { useGetAllSalesSaleRepQuery } from "../../store/slices/saleSlice";
import { useGetNonArchivedCustomersSalesQuery } from "../../store/slices/customerSlice";
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

const SaleReports = () => {
    const sort = "";
  const value = "";
  const closedDate = "";
  const search = "";
  const company = "";
  const industry = "";
  const source = "";

  const date = new Date();
  const monthYear = getMonthYear(date);
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
  const { data: leadData, isLoading: leadLoading } =
  useGetNonArchivedLeadsSalesRepQuery({ search, sort, source });
const { data: salesData, isLoading: saleLoading } =
  useGetAllSalesSaleRepQuery({ sort, value, closedDate });
  const { data: customerData, isLoading: customerLoading } =
    useGetNonArchivedCustomersSalesQuery({ search, sort, company, industry });

  if (customerLoading || leadLoading || saleLoading || !customerData || !leadData || !salesData) {
    return <Loader />
  }

  const filteredCustomers = customerData.filter(customer => {
    return getMonthYear(customer.createdAt) === monthYear;
  });

  const customerNames = filteredCustomers.map((customer) => customer.name);
  const conversionDays = filteredCustomers.map(
    (customer) => customer.salesCycleLength
  );

  const totalCustomers = filteredCustomers.length;
  const calculatedBarThickness =
    totalCustomers > 30
      ? 11
      : totalCustomers > 15
      ? 17
      : totalCustomers > 10
      ? 20
      : totalCustomers > 5
      ? 20
      : 22;

  // Set chart data
  const barData = {
    labels: customerNames, // X-axis: Customer names
    datasets: [
      {
        label: "Sales Cycle Length (Days)",
        data: conversionDays, // Y-axis: Conversion days
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        barThickness: calculatedBarThickness,
      },
    ],
  };

  // Chart options
  const barOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: `Names of Customers Created In ${monthYear}`,
          font: {
            size: 14,
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Sales Cycle Length (Days)",
          font: {
            size: 14,
          },
        },
      },
    },
  };
  

  const salesByWeek = salesData.reduce((acc, sale) => {
    const saleDate = new Date(sale.closedDate);
    const week = getWeekOfMonth(saleDate);
    const mtYr = getMonthYear(saleDate);

    if (monthYear.includes(mtYr)) {
      if (!acc[mtYr]) acc[mtYr] = {};
      if (!acc[mtYr][week]) acc[mtYr][week] = { totalSales: 0, totalRevenue: 0 };

      acc[mtYr][week].totalSales += 1;
      acc[mtYr][week].totalRevenue += sale.value;
    }
    return acc || {};
  }, {});

  const leadsByWeek = leadData.reduce((acc, lead) => {
    const leadDate = new Date(lead.createdAt);
    const week = getWeekOfMonth(leadDate);
    const mtYr = getMonthYear(leadDate);

    if (monthYear.includes(mtYr)) {
      if (!acc[mtYr]) acc[mtYr] = {};
      if (!acc[mtYr][week]) acc[mtYr][week] = { totalLeads: 0 };

      acc[mtYr][week].totalLeads += 1;
    }
    return acc || {};
  }, {});


  const totalSalesArray = weeks.map(
    (week) => salesByWeek[monthYear]?.[week]?.totalSales || 0
  );

  const totalLeadsArray = weeks.map(
    (week) => leadsByWeek[monthYear]?.[week]?.totalLeads || 0
  );
  
  const totalRevenueArray = weeks.map(
    (week) => salesByWeek[monthYear]?.[week]?.totalRevenue || 0
  );

  const averageClosedDealArray = weeks.map((week) => {
    const totalSales = salesByWeek[monthYear]?.[week]?.totalSales || 0;
    const totalRevenue = salesByWeek[monthYear]?.[week]?.totalRevenue || 0;
  
    return totalSales > 0 ? (totalRevenue / totalSales) : 0;
  });


  let totalLeads = totalLeadsArray.reduce((acc, leads) => acc + leads, 0);
  if (totalLeads < 0) {
    totalLeads = 0;
  }

  let notConverted = totalLeads - filteredCustomers.length

  if (notConverted < 0) {
    notConverted = 0;
  }

  const pieData = {
    labels: ["Converted", "Not Converted"],
    datasets: [
      {
        data: [filteredCustomers.length, notConverted],
        backgroundColor: ["rgba(75, 192, 75, 0.8)", "rgba(255, 99, 132, 0.8)"],
        hoverBackgroundColor: ["rgba(75, 192, 75, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: weeks,
    datasets: [
      {
        label: "Average Deal Size Per Week",
        data: averageClosedDealArray,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Weeks", // Example: Weeks
          font: {
            size: 14,
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Average Deal Size", // Example: Values
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw;
            const percentage = ((value / totalLeads) * 100).toFixed(2);
            return `${tooltipItem.label}: ${percentage}% (${value})`;
          },
        },
      },
    },
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
        ticks: {
          precision: 0,
          callback: function (value) {
            return "Rs." + value;
          },
        },
        title: {
          display: true,
          text: "Total Revenue (Rs.)",
          font: {
            size: 14,
          },
        },
      },
      y1: {
        // Secondary Y-Axis for Total Sales
        beginAtZero: true,
        position: "right", // Place the secondary axis on the right side
        ticks: {
          precision: 0,
          callback: function (value) {
            return value; // Customize labels for total sales
          },
        },
        title: {
          display: true,
          text: "Total Number Of Sales",
          font: {
            size: 14,
          },
        },
        grid: {
          drawOnChartArea: false, // Prevent grid lines from overlapping with the main Y-axis
        },
      },
    },
  };

  const data = {
    labels: weeks, // Label showing total sales
    datasets: [
      {
        label: "Total Number Of Sales",
        data: totalSalesArray,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        barThickness: 16,
        yAxisID: "y1",
      },
      {
        label: "Total Revenue",
        data: totalRevenueArray,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        barThickness: 16, // Match thickness with sales bars
        yAxisID: "y",
      },
    ],
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
          Sales Reports {monthYear}
        </Typography>
      </Box>
      <Box
        sx={{
          mt: 4,
          mb: 2,
          width: "100%",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start", // Start from the top
          padding: 1,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            alignSelf: "flex-start", // Align the text to the start of the box
            mb: 2,
            px: 1,
            fontFamily: "Roboto",
            fontSize: "18px",
            fontWeight: 500,
            color: "#2C3E50",
          }}
        >
          {monthYear} Sales Performance Overview
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "370px", // Keep this fixed height for the container
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Bar
            style={{ width: "100%", height: "100%" }} // Make the chart take up the full container space
            data={data}
            options={chartOptions}
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
          {monthYear} Conversion Rate Overview
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
          <Doughnut
            style={{ width: "100%", height: "100%" }}
            data={pieData}
            options={pieChartOptions}
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
          {monthYear} Average Deal Size Overview
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
            data={lineChartData}
            options={lineChartOptions}
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
          {monthYear} Sales Cycle Length Overview
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
            data={barData}
            options={barOptions}
          />
        </Box>
      </Box>
    </Box>
  )
};

export default SaleReports;
