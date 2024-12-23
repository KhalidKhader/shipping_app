# Project Name: Price Prediction and Comparison Platform

## Overview

This project allows users to upload rate data, compare their rates against market prices, and predict future price trends using machine learning. The backend API is built using Django and the frontend is a React-based application. The platform provides a seamless user experience for both data upload and visualization.

## Backend (Django)

### API Endpoints

1. **/api/welcome/** - **GET**  
   Returns a welcome message to verify the API is running.  
   **Response:**  
   ```json
   { "message": "welcome" }
   ```

2. **/api/predict_future_prices/** - **GET**  
   Predicts future prices using a linear regression model based on market trends.  
   **Response:**  
   ```json
   {
     "slope": 0.45,
     "intercept": 50.25,
     "predictions": [
       { "date": "2024-01-01", "predicted_price": "$55.50" },
       ...
     ]
   }
   ```

3. **/api/fetch_rates_comparison/** - **GET**  
   Fetches aggregated market price data and user-uploaded rates, calculating potential savings.  
   **Response:**  
   ```json
   {
     "results": [
       {
         "date": "2024-01-01",
         "origin": "NYC",
         "destination": "LA",
         "user_price": "$150.00",
         "min_price": "$120.00",
         "percentile_10_price": "$130.00",
         "median_price": "$140.00",
         "potential_savings_min_price": "$15,000.00",
         "potential_savings_percentile_10_price": "$10,000.00",
         ...
       }
     ]
   }
   ```

4. **/api/upload_user_rates/** - **POST**  
   Uploads and processes a CSV or Excel file containing user rates. Updates the aggregated market rates table.  
   **Request:**  
   Form-data with a file (`.csv` or `.xlsx`) containing columns:
   - origin
   - destination
   - effective_date
   - expiry_date
   - price
   - annual_volume
   - user_email
   
   **Response:**  
   ```json
   { "success": "File uploaded and processed successfully." }
   ```

5. **/api/get_rates/** - **GET**  
   Retrieves all user rates as JSON.  
   **Response:**  
   ```json
   [
     { "user_email": "user@example.com", "origin": "NYC", "destination": "LA", "price": 150.00, ... },
     ...
   ]
   ```

6. **/api/fetch_all_user_rates_data/** - **GET**  
   Retrieves all user rates data.  
   **Response:**  
   ```json
   [
     { "user_email": "user@example.com", "origin": "NYC", "destination": "LA", "price": 150.00, ... },
     ...
   ]
   ```

7. **/api/fetch_all_market_rates_aggregated_data/** - **GET**  
   Retrieves all aggregated market rates data.  
   **Response:**  
   ```json
   [
     { "origin": "NYC", "destination": "LA", "date": "2024-01-01", "min_price": 120.00, ... },
     ...
   ]
   ```

8. **/api/fetch_all_market_rates_data/** - **GET**  
   Retrieves all market rates data.  
   **Response:**  
   ```json
   [
     { "origin": "NYC", "destination": "LA", "date": "2024-01-01", "price": 140.00, ... },
     ...
   ]
   ```

---

### How to Use the Backend

1. **Install Dependencies:**  
   Ensure you have Django, Django REST Framework, Pandas, NumPy, and Scikit-Learn installed.
   ```bash
   pip install django djangorestframework pandas numpy scikit-learn
   ```

2. **Setup Django Project:**  
   - Clone the repository.
   - Run `python manage.py migrate` to set up the database.
   - Create models, views, and serializers as per your requirements.

3. **Run the Server:**  
   ```bash
   python manage.py runserver
   ```

4. **Interact with the API:**  
   Use tools like Postman or CURL to interact with the API endpoints.

---

## Frontend (React)

### Components

The frontend is built using React. It consists of the following components:

1. **UploadComponent:**  
   Handles file uploads (CSV or Excel) for user rates.

2. **ComparisonData:**  
   Displays the comparison data between user rates and market prices.

3. **DataDisplay:**  
   Visualizes the user rates and market rates in a tabular format.

4. **Display:**  
   Renders general information and results.

5. **PricePredictionChart:**  
   Displays the predicted price trends over time using a chart.

### React Application

The main application file (`AppFile.js`) imports the components and renders them in sequence:

```jsx
import UploadComponent from "./components/UploadComponent";
import ComparisonData from "./components/ComparisonData";
import DataDisplay from "./components/DataDisplay";
import Display from "./components/Display";
import PricePredictionChart from "./components/PricePredictionChart";

const AppFile = () => (
  <div>
    <UploadComponent />
    <ComparisonData />
    <DataDisplay/>
    <Display/>
    <PricePredictionChart/>
  </div>
);

export default AppFile;
```

### How to Use the Frontend

1. **Install Dependencies:**  
   Make sure you have Node.js installed, then install the required dependencies.
   ```bash
   npm install
   ```

2. **Start the Development Server:**  
   ```bash
   npm start
   ```

   This will start the frontend application on `http://localhost:3000`.

3. **Upload User Data:**  
   - Navigate to the `UploadComponent` and upload a `.csv` or `.xlsx` file with user rates.
   - The file should contain the following columns: `origin`, `destination`, `effective_date`, `expiry_date`, `price`, `annual_volume`, and `user_email`.

4. **View Predictions and Comparisons:**  
   - Use the `PricePredictionChart` to visualize predicted price trends.
   - View the comparison results and calculate potential savings using `ComparisonData`.

---

## Summary

- **Backend:** The Django API provides endpoints to upload user rates, fetch market data, and predict future prices using machine learning models.
- **Frontend:** The React app handles the UI, allowing users to upload rate files, view comparisons, and visualize price predictions.
- **Integration:** The frontend and backend communicate via API endpoints, ensuring seamless interaction between the user data and price prediction models.

### Technologies Used:
- **Backend:** Django, Django REST Framework, Pandas, Scikit-Learn
- **Frontend:** React
- **Database:** PostgreSQL (or any Django-supported database)
- **Machine Learning:** Linear Regression

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This README gives a complete overview of the backend and frontend, explaining the APIs, usage instructions, and how to run both the backend and frontend.
