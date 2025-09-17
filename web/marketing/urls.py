from django.urls import path
from .views import HomePage

app_name = "marketing"

urlpatterns = [
    path(
        "", 
        HomePage.as_view(), 
        name="home"
    ),
]