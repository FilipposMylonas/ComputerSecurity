from .models import UserApp as User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
import json
@api_view(['POST'])
def vulnerable_login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"error": "Missing username or password"}, status.HTTP_400_BAD_REQUEST)

    # Fetch user with plaintext password (vulnerable)
    try:
        user = User.objects.get(email=email)
        if user.password == password:  # BAD: Plaintext password comparison
            return Response({"message": "Login successful", "user_id": user.id})
        else:
            return Response({"error": "Invalid credentials"}, status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({"error": "Invalid credentials"}, status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def vulnerable_register(request):
    # No CAPTCHA or hashing
    serializer=UserSerializer(data=request.data)
    if serializer.is_valid():
        User.objects.create(
            email=serializer.data.get("email"),
            password=serializer.data.get('password')  # Plaintext
        )
        return Response({"status": "success"},status.HTTP_200_OK)
    else:
        return Response({"status": "user not created"},status.HTTP_200_OK)