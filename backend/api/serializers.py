from rest_framework import serializers
from .models import UserRates, MarketRates, MarketRatesAggregated

class UserRatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRates
        fields = '__all__'

class MarketRatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketRates
        fields = '__all__'

class MarketRatesAggregatedSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketRatesAggregated
        fields = '__all__'
