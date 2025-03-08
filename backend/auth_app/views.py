
from django.http import JsonResponse
from django.db import connection
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email', '')
        password = request.POST.get('password', '')

        # --- Vulnerability: SQL Injection ---
        # User input is directly used in an SQL query without sanitization
        query = f"SELECT id, email, password FROM auth_app_userapp WHERE email = '{email}' AND password = '{password}'"
        with connection.cursor() as cursor:
            cursor.execute(query)
            row = cursor.fetchone()

        if row:
            # --- Vulnerability: Broken Authentication ---
            # Storing user session insecurely without a proper token system
            request.session['user_id'] = row[0]
            request.session['email'] = row[1]
            return JsonResponse({
                'status': 'success',
                'user_id': row[0],
                'email': row[1]
            })
        else:
            # --- Vulnerability: XSS in Error Message ---
            # Directly reflecting user input in the error message
            return JsonResponse({
                'status': 'fail',
                'error': "Login failed for email: " + email  # Potential XSS attack
            })

    return JsonResponse({'error': 'Only POST method is allowed.'}, status=405)

@csrf_exempt
def signup_view(request):
    if request.method == 'POST':
        email = request.POST.get('email', '')
        password = request.POST.get('password', '')

        # --- Vulnerability: No Input Validation ---
        # Allows empty emails and passwords
        if not email or not password:
            return JsonResponse({'status': 'fail', 'error': 'Email and password cannot be empty!'})

        # --- Vulnerability: SQL Injection ---
        # Directly inserting user input into an SQL query
        query = f"INSERT INTO auth_app_userapp (email, password) VALUES ('{email}', '{password}')"
        try:
            with connection.cursor() as cursor:
                cursor.execute(query)
        except Exception as e:
            # No proper error handling
            return JsonResponse({'status': 'fail', 'error': str(e)})

        return JsonResponse({'status': 'success', 'message': 'User registered successfully!'})

    return JsonResponse({'error': 'Only POST method is allowed.'}, status=405)
