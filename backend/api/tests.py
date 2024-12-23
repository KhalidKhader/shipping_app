# from django.test import TestCase

from api.models import UserRates

# Manually insert a record into UserRates
UserRates.objects.create(
    user_email="test@example.com",
    origin="Origin1",
    destination="Destination1",
    effictive_date="2024-01-01",
    expiry_date="2024-12-31",
    price=100,
    annual_volume=500
)

# Verify that data is inserted
print(UserRates.objects.all())
