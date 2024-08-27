import { Box, Typography } from "@mui/material";
import { useGetNonArchivedCustomersSalesQuery } from "../../store/slices/customerSlice";
import { useGetNonArchivedLeadsSalesRepQuery } from "../../store/slices/leadSlice";
import { useGetAllSalesSaleRepQuery } from "../../store/slices/saleSlice";
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
import { Bar, Line } from "react-chartjs-2";
import { getMonthYear, getWeekOfMonth, normalizeDateInput, numberWeekOfMonth } from "../../helpers/date";
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

const SaleDashboard = () => {
  const sort = "";
  const value = "";
  const closedDate = "";
  const search = "";
  const company = "";
  const industry = "";
  const source = "";
  const { data: customerData, isLoading: customerLoading } =
    useGetNonArchivedCustomersSalesQuery({ search, sort, company, industry });
  const { data: leadData, isLoading: leadLoading } =
    useGetNonArchivedLeadsSalesRepQuery({ search, sort, source });
  const { data: salesData, isLoading: saleLoading } =
    useGetAllSalesSaleRepQuery({ sort, value, closedDate });

    if (customerLoading || leadLoading || saleLoading || !customerData || !leadData || !salesData) {
      return <Loader />
    }

  const date = new Date();
  const monthYear = getMonthYear(date);
  const currentWeekIndex = numberWeekOfMonth(date) - 1;
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

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
          label: 'Customer Retention Rate (%)',
          data: retentionRates,
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          tension: 0.1, // Slight curve to the line
        },
      ],
    };

    const retentionOptions = {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Weeks',
            font: {
              size: 14,
            },
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Retention Rate (%)',
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

  const salesByWeek = salesData.reduce((acc, sale) => {
    const saleDate = normalizeDateInput(sale.closedDate);
    const week = getWeekOfMonth(saleDate);
    const mtYr = getMonthYear(saleDate);

    if (monthYear === mtYr) {
      if (!acc[mtYr]) acc[mtYr] = {};
      if (!acc[mtYr][week])
        acc[mtYr][week] = { totalSales: 0, totalRevenue: 0 };

      acc[mtYr][week].totalSales += 1;
      acc[mtYr][week].totalRevenue += sale.value;
    }
    return acc || {};
  }, {});


  const totalSalesArray = weeks.map(
    (week) => salesByWeek[monthYear]?.[week]?.totalSales || 0
  );
  
  const totalRevenueArray = weeks.map(
    (week) => salesByWeek[monthYear]?.[week]?.totalRevenue || 0
  );

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
        beginAtZero: true,
        position: "right",
        ticks: {
          precision: 0,
          callback: function (value) {
            return value;
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
          drawOnChartArea: false,
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
        mt: 6,
        height: "100%",
        width: "100%",
        display: { md: "block", sm: "flex", xs: "flex" },
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
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
          Sales Representative Dashboard
        </Typography>
      </Box>
      <Box
        sx={{
          mt: 7,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            width: "200px",
            height: "200px",
            background: "linear-gradient(135deg, #0b2ebc 0%, #e024d1 100%)",
            borderRadius: "50%",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontSize: "30px",
              textAlign: "center",
              position: "absolute",
              lineHeight: 1,
              top: 40,
            }}
          >
            Total
          </Typography>
          <Typography
            sx={{
              color: "white",
              fontSize: "30px",
              textAlign: "center",
              lineHeight: 1,
            }}
          >
            Leads
          </Typography>
          <Typography
            sx={{
              color: "white",
              textAlign: "center",
              position: "absolute",
              left: 83,
              top: 121,
              mt: 1,
              fontSize: "30px",
            }}
          >
            {leadData?.length}
          </Typography>
        </Box>
        <Box
          sx={{
            width: "200px",
            height: "200px",
            background: "linear-gradient(135deg, #0b2ebc 0%, #e024d1 100%)",
            borderRadius: "50%",
            position: "relative",
          }}
        >
          <Typography
            sx={{
              color: "white",
              position: "absolute",
              left: -2,
              top: 34,
              fontSize: "30px",
              textAlign: "center",
            }}
          >
            Total Customers
          </Typography>
          <Typography
            sx={{
              color: "white",
              textAlign: "center",
              position: "absolute",
              left: 83,
              top: 121,
              mt: 1,
              fontSize: "30px",
            }}
          >
            {customerData?.length}
          </Typography>
        </Box>
        <Box
          sx={{
            width: "200px",
            height: "200px",
            background: "linear-gradient(135deg, #0b2ebc 0%, #e024d1 100%)",
            borderRadius: "50%",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontSize: "30px",
              textAlign: "center",
              position: "absolute",
              lineHeight: 1,
              top: 40,
            }}
          >
            Total
          </Typography>
          <Typography
            sx={{
              color: "white",
              fontSize: "30px",
              textAlign: "center",
              lineHeight: 1,
            }}
          >
            Sales
          </Typography>
          <Typography
            sx={{
              color: "white",
              textAlign: "center",
              position: "absolute",
              left: 83,
              top: 121,
              mt: 1,
              fontSize: "30px",
            }}
          >
            {salesData?.length}
          </Typography>
        </Box>
      </Box>
      <Box>
        <Typography
          variant="h1"
          sx={{
            mt: 6,
            textAlign: "center",
            fontFamily: "Roboto",
            fontSize: {md: "32px", sm: "28px", xs: "25px"},
            fontWeight: 600,
            color: "#2C3E50",
          }}
        >
          Sales Performance {monthYear}
        </Typography>
      </Box>
      <Box
        sx={{
          mt: 5,
          mb: 2,
          width: "100%",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: 1,
        }}
      >
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
            data={data}
            options={chartOptions}
          />
        </Box>
      </Box>
      <Box>
        <Typography
          variant="h1"
          sx={{
            mt: 5,
            textAlign: "center",
            fontFamily: "Roboto",
            fontSize: {md: "32px", sm: "28px", xs: "25px"},
            fontWeight: 600,
            color: "#2C3E50",
          }}
        >
          Customers Retention Rate {monthYear}
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
          justifyContent: "flex-start",
          padding: 1,
          py: 1.6,
        }}
      >
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
    </Box>
  );
};

export default SaleDashboard;
