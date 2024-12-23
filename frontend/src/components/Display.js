import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Display = () => {
  const [userRates, setUserRates] = useState([]);
  const [marketRates, setMarketRates] = useState([]);
  const [selectedPercentile, setSelectedPercentile] = useState(50);
  const [filteredMarketRates, setFilteredMarketRates] = useState(marketRates);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRatesData = await fetch('http://127.0.0.1:8000/fetch_all_user_rates_data/').then(res => res.json());
        const marketRatesData = await fetch('http://127.0.0.1:8000/fetch_all_market_rates_data/').then(res => res.json());

        setUserRates(userRatesData);
        setMarketRates(marketRatesData);
        setFilteredMarketRates(marketRatesData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  const filterByPercentile = (percentile) => {
    const sortedRates = [...marketRates].sort((a, b) => a.price - b.price);
    const index = Math.floor((percentile / 100) * sortedRates.length);
    setFilteredMarketRates(sortedRates.slice(0, index));
  };

  useEffect(() => {
    filterByPercentile(selectedPercentile);
  }, [selectedPercentile]);

  const calculateSavings = () => {
    let totalSavings = 0;
    userRates.forEach((userRate, index) => {
      const marketRate = marketRates[index];
      if (marketRate) {
        totalSavings += Math.max(0, marketRate.price - userRate.price);
      }
    });
    return totalSavings;
  };

  const MarketVsUserRatesChart = () => {
    const chartData = userRates.map((userRate, index) => ({
      date: userRate.date,
      userRate: userRate.price,
      marketRate: marketRates[index]?.price || 0, 
    }));

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="userRate" stroke="#8884d8" />
          <Line type="monotone" dataKey="marketRate" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const PercentileFilter = () => {
    const handleChange = (event) => {
      setSelectedPercentile(event.target.value);
    };

    return (
      <div>
        <label>Select Percentile: </label>
        <select onChange={handleChange} value={selectedPercentile}>
          <option value="10">10th Percentile</option>
          <option value="50">50th Percentile</option>
          <option value="90">90th Percentile</option>
        </select>
      </div>
    );
  };

  return (
    <div>
      <h1>Market vs User Rates</h1>
      <PercentileFilter />
      <MarketVsUserRatesChart />
      
      <h1>Potential Savings</h1>
      <p>Total Savings: ${calculateSavings()}</p>
    </div>
  );
};

export default Display;
