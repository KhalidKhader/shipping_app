import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PricePredictionChart = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slope, setSlope] = useState(0);
  const [intercept, setIntercept] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/predict_future_prices/");
        setPredictions(response.data.predictions);
        setIntercept(response.data.intercept);
        setSlope(response.data.slope);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching predictions:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const dates = predictions.map((item) => item.date);
  const prices = predictions.map((item) => parseFloat(item.predicted_price.replace('$', '').replace(',', '')));
  const regressionLine = prices.map((_, index) => slope * index + intercept);

  const priceData = {
    labels: dates,
    datasets: [
      {
        label: "Predicted Price",
        data: prices,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const regressionData = {
    labels: dates,
    datasets: [
      {
        label: "Regression Line",
        data: regressionLine,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        borderDash: [5, 5],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Predicted Prices and Regression Line',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `$${tooltipItem.raw.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      {loading ? (
        <p>Loading predictions...</p>
      ) : (
        <div>
          <h3>Predicted Prices</h3>
          <Line data={priceData} options={options} />
          <h3>Regression Line</h3>
          <Line data={regressionData} options={options} />
        </div>
      )}
    </div>
  );
};

export default PricePredictionChart;
