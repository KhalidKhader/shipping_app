import logging
from datetime import datetime
import io
import pandas as pd
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import UserRates, MarketRates, MarketRatesAggregated
from .serializers import UserRatesSerializer
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from .models import MarketRates, MarketRatesAggregated
from decimal import Decimal

logger = logging.getLogger(__name__)



@api_view(['GET'])
def predict_future_prices(request):
    """
    Predict future prices using Linear Regression based on market trends.
    """
    try:
        market_rates = pd.DataFrame.from_records(
            MarketRates.objects.all().values('origin', 'destination', 'date', 'price')
        )

        market_rates['date'] = pd.to_datetime(market_rates['date'])
        market_rates['date_ordinal'] = market_rates['date'].apply(lambda x: x.toordinal())  


        X = market_rates[['date_ordinal']] 
        y = market_rates['price']  

        model = LinearRegression()
        model.fit(X, y)

        slope = model.coef_[0]
        intercept = model.intercept_

        future_dates = pd.date_range(market_rates['date'].max(), periods=31, freq='D')
        future_dates_ordinal = future_dates.to_series().apply(lambda x: x.toordinal()).values.reshape(-1, 1)
        predicted_prices = model.predict(future_dates_ordinal)

        future_predictions = [
            {
                "date": future_dates[i].strftime('%Y-%m-%d'),
                "predicted_price": f"${predicted_prices[i]:.2f}",
            }
            for i in range(len(future_dates))
        ]

        results = {
            "slope": slope,
            "intercept": intercept,
            "predictions": future_predictions
        }

        return Response(results, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error predicting future prices: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def fetch_rates_comparison(request):
    """
    API to fetch aggregated market price data and user-uploaded rates, and calculate savings.
    """
    try:
        user_rates = pd.DataFrame.from_records(
            UserRates.objects.all().values(
                'user_email', 'origin', 'destination', 'effective_date', 'price', 'annual_volume'
            )
        )
        print(user_rates.head())
        market_rates_aggregated = pd.DataFrame.from_records(
            MarketRatesAggregated.objects.all().values(
                'origin', 'destination', 'date', 'min_price',
                'percentile_10_price', 'median_price', 'percentile_90_price', 'max_price'
            )
        )
        


        user_rates.rename(columns={'effective_date': 'date'}, inplace=True)
        
        merged_df = pd.merge(
            user_rates,
            market_rates_aggregated,
            on=['origin', 'destination', 'date'],
            how='inner'
        )
        

        merged_df['potential_savings_min_price'] = (merged_df['min_price'] - merged_df['price']) * merged_df['annual_volume']
        merged_df['potential_savings_percentile_10_price'] = (merged_df['percentile_10_price'] - merged_df['price']) * merged_df['annual_volume']
        merged_df['potential_savings_median_price'] = (merged_df['median_price'] - merged_df['price']) * merged_df['annual_volume']
        merged_df['potential_savings_percentile_90_price'] = (merged_df['percentile_90_price'] - merged_df['price']) * merged_df['annual_volume']
        merged_df['potential_savings_max_price'] = (merged_df['max_price'] - merged_df['price']) * merged_df['annual_volume']
        
        results = merged_df.apply(
            lambda row: {
                "date": row['date'],
                "origin": row['origin'],
                "destination": row['destination'],
                "user_price": f"${row['price']:.2f}",
                "min_price": f"${row['min_price']:.2f}",
                "percentile_10_price": f"${row['percentile_10_price']:.2f}",
                "median_price": f"${row['median_price']:.2f}",
                "percentile_90_price": f"${row['percentile_90_price']:.2f}",
                "max_price": f"${row['max_price']:.2f}",
                "potential_savings_min_price": f"${row['potential_savings_min_price']:.2f}",
                "potential_savings_percentile_10_price": f"${row['potential_savings_percentile_10_price']:.2f}",
                "potential_savings_median_price": f"${row['potential_savings_median_price']:.2f}",
                "potential_savings_percentile_90_price": f"${row['potential_savings_percentile_90_price']:.2f}",
                "potential_savings_max_price": f"${row['potential_savings_max_price']:.2f}",
            },
            axis=1
        ).tolist()

        return Response({"results": results}, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error fetching and calculating rates: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def upload_user_rates(request):
    """
    Upload and process a CSV or Excel file containing user rates, and update the MarketRatesAggregated table.
    """
    csv_file = request.FILES.get('file')

    if not csv_file:
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

    if not (csv_file.name.endswith('.csv') or csv_file.name.endswith('.xlsx')):
        return Response({'error': 'Invalid file type. Please upload a CSV or Excel file.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        if csv_file.name.endswith('.csv'):
            file_content = io.TextIOWrapper(csv_file.file, encoding='utf-8')
            df = pd.read_csv(file_content)
        else:
            df = pd.read_excel(csv_file)

        required_columns = ["origin", "destination", "effective_date", "expiry_date", "price", "annual_volume", "user_email"]

        if not all(col in df.columns for col in required_columns):
            logger.error(f"Missing required columns. Found columns: {df.columns.tolist()}")
            return Response({'error': 'Missing required columns in the file.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            df["effective_date"] = pd.to_datetime(df["effective_date"]).dt.date
            df["expiry_date"] = pd.to_datetime(df["expiry_date"]).dt.date
        except Exception as date_error:
            logger.error(f"Error parsing dates: {date_error}")
            return Response({'error': 'Date parsing error. Please ensure correct date format.'}, status=status.HTTP_400_BAD_REQUEST)

        errors = []
        for _, row in df.iterrows():
            user_data = {
                "user_email": request.user.email if request.user.is_authenticated else "anonymous@example.com",
                "origin": row["origin"],
                "destination": row["destination"],
                "effective_date": row["effective_date"],
                "expiry_date": row["expiry_date"],
                "price": row["price"],
                "annual_volume": row["annual_volume"],
            }
            serializer = UserRatesSerializer(data=user_data)
            if serializer.is_valid():
                serializer.save()
            else:
                error_msg = f"Error saving row: {serializer.errors}"
                logger.error(error_msg)
                errors.append(error_msg)

        if errors:
            return Response({'error': errors}, status=status.HTTP_400_BAD_REQUEST)


        user_rates_grouped = df.groupby(['origin', 'destination', 'effective_date'])['price']

        for group, prices in user_rates_grouped:
            origin, destination, date = group

            min_price = Decimal(float(prices.min()))  
            percentile_10_price = Decimal(float(prices.quantile(0.1)))  
            median_price = Decimal(float(prices.median()))  
            percentile_90_price = Decimal(float(prices.quantile(0.9)))  
            max_price = Decimal(float(prices.max()))  

            MarketRatesAggregated.objects.update_or_create(
                origin=origin,
                destination=destination,
                date=date,
                defaults={
                    'min_price': min_price,
                    'percentile_10_price': percentile_10_price,
                    'median_price': median_price,
                    'percentile_90_price': percentile_90_price,
                    'max_price': max_price
                }
            )

        return Response({'success': 'File uploaded and processed successfully.'}, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Error processing file: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
def get_rates(request):
    """
    Retrieve all user rates as JSON.
    """
    user_rates = UserRates.objects.all()
    serializer = UserRatesSerializer(user_rates, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def fetch_all_user_rates_data(request):
    user_rates = UserRates.objects.all().values() 
    return JsonResponse(list(user_rates), safe=False)

@api_view(['GET'])
def fetch_all_market_rates_aggregated_data(request):
    market_rates_aggregated = MarketRatesAggregated.objects.all().values() 
    return JsonResponse(list(market_rates_aggregated), safe=False)

@api_view(['GET'])
def fetch_all_market_rates_data(request):
    market_rates = MarketRates.objects.all().values()  
    return JsonResponse(list(market_rates), safe=False)


@api_view(['GET'])
def welcome(request):
    return JsonResponse({'message': 'welcome'})