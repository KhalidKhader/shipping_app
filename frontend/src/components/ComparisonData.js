import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ComparisonData = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/fetch_rates_comparison/")
            .then((response) => {
                setData(response.data.results.slice(0, 10)); // Limit to 10 rows
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    // Prepare chart data
    const chartData = data.map(item => ({
        date: item.date,
        user_price: parseFloat(item.user_price.replace('$', '').replace(',', '')),
        min_price: parseFloat(item.potential_savings_min_price.replace('$', '').replace(',', '')),
        median_price: parseFloat(item.potential_savings_median_price.replace('$', '').replace(',', ''))
    }));

    return (
        <Container maxWidth="md">
            <Typography variant="h4" align="center" gutterBottom>
                Comparison Data
            </Typography>
            
            {/* Table for displaying data */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Origin</TableCell>
                            <TableCell>Destination</TableCell>
                            <TableCell>User Price</TableCell>
                            <TableCell>Potential Savings (Min)</TableCell>
                            <TableCell>Potential Savings (Median)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.date}</TableCell>
                                <TableCell>{item.origin}</TableCell>
                                <TableCell>{item.destination}</TableCell>
                                <TableCell>{item.user_price}</TableCell>
                                <TableCell>{item.potential_savings_min_price}</TableCell>
                                <TableCell>{item.potential_savings_median_price}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Chart for visualization */}
            <Grid container spacing={3} justifyContent="center" marginTop={3}>
                <Grid item xs={12}>
                    <Typography variant="h6" align="center" gutterBottom>
                        Price Comparison Over Time
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="user_price" stroke="#8884d8" />
                            <Line type="monotone" dataKey="min_price" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="median_price" stroke="#ffc658" />
                        </LineChart>
                    </ResponsiveContainer>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ComparisonData;
