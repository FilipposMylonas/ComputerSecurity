from django.urls import path
from .views import vulnerable_login, vulnerable_register

urlpatterns = [
    path('api/login', vulnerable_login),
    path('api/register', vulnerable_register),
]