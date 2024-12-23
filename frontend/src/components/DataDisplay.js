import { Container, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import React, { useState, useEffect } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DataDisplay = () => {
  const [userRates, setUserRates] = useState([]);
  const [marketRatesAggregated, setMarketRatesAggregated] = useState([]);
  const [marketRates, setMarketRates] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRatesResponse = await fetch('http://127.0.0.1:8000/fetch_all_user_rates_data/');
        const userRatesData = await userRatesResponse.json();
        setUserRates(userRatesData);

        const marketRatesAggregatedResponse = await fetch('http://127.0.0.1:8000/fetch_all_market_rates_aggregated_data/');
        const marketRatesAggregatedData = await marketRatesAggregatedResponse.json();
        setMarketRatesAggregated(marketRatesAggregatedData);

        const marketRatesResponse = await fetch('http://127.0.0.1:8000/fetch_all_market_rates_data/');
        const marketRatesData = await marketRatesResponse.json();
        setMarketRates(marketRatesData);

        setLoading(false); 
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', paddingTop: 4 }}>
        <CircularProgress />
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: 'center', paddingTop: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const aggregatedPrices = marketRatesAggregated.slice(0, 5); 
  const chartData = {
    labels: aggregatedPrices.map((rate) => `${rate.origin} to ${rate.destination}`),
    datasets: [
      {
        label: 'Min Price',
        data: aggregatedPrices.map((rate) => rate.min_price),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Max Price',
        data: aggregatedPrices.map((rate) => rate.max_price),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Dashboard
      </Typography>

      {/* Market Rates Aggregated Chart */}
      <Typography variant="h6" align="center" gutterBottom>
        Market Rates Aggregated (Limited View)
      </Typography>
      <Bar data={chartData} />

      {/* User Rates Table */}
      <Typography variant="h6" gutterBottom>
        User Rates (Limited Data)
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Effective Date</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Annual Volume</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userRates.slice(0, 5).map((rate, index) => ( 
              <TableRow key={index}>
                <TableCell>{rate.user_email}</TableCell>
                <TableCell>{rate.origin}</TableCell>
                <TableCell>{rate.destination}</TableCell>
                <TableCell>{rate.effective_date}</TableCell>
                <TableCell>{rate.expiry_date}</TableCell>
                <TableCell>{rate.price}</TableCell>
                <TableCell>{rate.annual_volume}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Market Rates Table */}
      <Typography variant="h6" gutterBottom>
        Market Rates (Limited Data)
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Min Price</TableCell>
              <TableCell>Median Price</TableCell>
              <TableCell>Max Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {marketRatesAggregated.slice(0, 5).map((rate, index) => ( 
              <TableRow key={index}>
                <TableCell>{rate.origin}</TableCell>
                <TableCell>{rate.destination}</TableCell>
                <TableCell>{rate.date}</TableCell>
                <TableCell>{rate.min_price}</TableCell>
                <TableCell>{rate.median_price}</TableCell>
                <TableCell>{rate.max_price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DataDisplay;
