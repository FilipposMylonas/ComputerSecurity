from django.db import models

class UserApp(models.Model):
    email = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)  # Stored in plaintext