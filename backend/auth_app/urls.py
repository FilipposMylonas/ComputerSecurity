from django.urls import path
from .views import login_view, signup_view

urlpatterns = [
    path('api/login/', login_view),
    path('api/register/', signup_view ),
]