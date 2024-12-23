from django.db import models

class MarketRates(models.Model):
    date = models.DateField()
    origin = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    class Meta:
        managed = False
        db_table = 'market_rates'  

class MarketRatesAggregated(models.Model):
    date = models.DateField()
    origin = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    min_price = models.DecimalField(max_digits=10, decimal_places=2)
    percentile_10_price = models.DecimalField(max_digits=10, decimal_places=2)
    median_price = models.DecimalField(max_digits=10, decimal_places=2)
    percentile_90_price = models.DecimalField(max_digits=10, decimal_places=2)
    max_price = models.DecimalField(max_digits=10, decimal_places=2)
    class Meta:
        managed = False
        db_table = 'market_rates_aggregated'  

class UserRates(models.Model):
    user_email = models.EmailField(max_length=255)  # Matches VARCHAR(255)
    origin = models.CharField(max_length=10)  # Matches VARCHAR(10)
    destination = models.CharField(max_length=10)  # Matches VARCHAR(10)
    effective_date = models.DateField()  # Matches DATE
    expiry_date = models.DateField()  # Matches DATE
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Matches DECIMAL(10, 2)
    annual_volume = models.DecimalField(max_digits=10, decimal_places=2)  # Matches DECIMAL(10, 2)
    class Meta:
        managed = False
        db_table = 'user_rates' 
