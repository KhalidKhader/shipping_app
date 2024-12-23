from django.urls import path
from .views import upload_user_rates, fetch_rates_comparison, welcome, fetch_all_user_rates_data, fetch_all_market_rates_aggregated_data, fetch_all_market_rates_data, predict_future_prices

urlpatterns = [
    path('upload-user-rates/', upload_user_rates, name='upload_user_rates'),
    path('fetch_rates_comparison/', fetch_rates_comparison, name='fetch_comparison_data'),
    path('fetch_all_user_rates_data/', fetch_all_user_rates_data, name='fetch_all_user_rates_data'),
    path('fetch_all_market_rates_aggregated_data/', fetch_all_market_rates_aggregated_data, name='fetch_all_market_rates_aggregated_data'),
    path('fetch_all_market_rates_data/', fetch_all_market_rates_data, name='fetch_all_market_rates_data'),
    path('predict_future_prices/', predict_future_prices, name='predict_future_prices'),
    path('', welcome, name='welcome'),
]
