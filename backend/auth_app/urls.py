from django.urls import path
from .views import login_view, vulnerable_register,vulnerable_login_view

urlpatterns = [
    path('api/login', vulnerable_login_view),
    path('api/register', vulnerable_register),
]