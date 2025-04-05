# Secure Authentication System

A full-stack web application demonstrating secure authentication practices and common security vulnerabilities for educational purposes.

## Project Overview

This project implements a secure authentication system with both secure and vulnerable implementations for educational comparison. It consists of:

- **Frontend**: Next.js/React application with login and registration forms
- **Backend**: Django REST Framework API for user authentication

The project was created as part of the BSC2420 Computer Security course's Blue Team Challenge, demonstrating intentional security vulnerabilities in authentication systems and their proper remediation.

## Security Features

### Secure Implementation
- Server-side rate limiting using Django Axes
- JWT-based authentication with proper expiration
- Argon2 password hashing (one of the strongest algorithms available)
- Generic error messages to prevent information disclosure
- CSRF protection for form submissions
- Secure HTTP-only cookies
- Backend verification of all security-critical operations

### Demonstrated Vulnerabilities
- Client-side login attempt limiting (vulnerable to bypass)
- Account enumeration through specific error messages
- Debug information exposure in the UI
- Hardcoded credentials in the frontend
- Client-only CAPTCHA verification
- Insecure data storage in localStorage
- Hidden admin registration functionality
- Excessive password feedback information
- Password analysis logging in console

## Project Structure

```
.
├── backend/             # Django backend application
│   ├── auth_app/        # Django app for authentication logic
│   ├── backend/         # Django project settings
│   ├── manage.py        # Django management script
│   └── requirements.txt # Backend dependencies
├── frontend/            # Next.js frontend application
│   ├── public/          # Static assets
│   ├── src/             # Source code (components, pages, etc.)
│   │   ├── components/  # Reusable React components
│   │   │   ├── login/   # Login form components (secure and vulnerable versions)
│   │   │   ├── signup/  # Registration form components
│   │   │   └── common/  # Shared UI components
│   │   ├── pages/       # Next.js pages
│   │   └── utils/       # Helper functions and utilities
│   ├── next.config.js   # Next.js configuration
│   ├── package.json     # Frontend dependencies and scripts
│   └── tsconfig.json    # TypeScript configuration
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## Technology Stack

### Frontend
- [Next.js](https://nextjs.org/) (React Framework)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (for animations)
- [Lucide React](https://lucide.dev/) (for icons)
- [react-google-recaptcha](https://github.com/dozoisch/react-google-recaptcha)
- [zxcvbn](https://github.com/dropbox/zxcvbn) (for password strength estimation)

### Backend
- [Django 5.0](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/) (for JWT authentication)
- [django-cors-headers](https://github.com/adamchainz/django-cors-headers)
- [Django Axes](https://django-axes.readthedocs.io/) (for brute-force protection)
- [Argon2](https://pypi.org/project/argon2-cffi/) (for secure password hashing)

## Getting Started

### Prerequisites
- Python 3.10+ with pip
- Node.js 18+ with npm or yarn
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/secure-authentication-system.git
   cd secure-authentication-system
   ```

2. **Set up the Backend:**
   ```bash
   cd backend
   
   # Create and activate a virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Create .env file (example values)
   cat > .env << EOL
   SECRET_KEY=your_django_secret_key
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:3000
   EOL
   
   # Apply database migrations
   python manage.py migrate
   ```

3. **Set up the Frontend:**
   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   
   # Create .env.local file (example values)
   cat > .env.local << EOL
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   EOL
   ```

### Running the Application

1. **Start the Backend Server:**
   ```bash
   cd backend
   source venv/bin/activate  # If not already activated
   python manage.py runserver
   ```

2. **Start the Frontend Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application at:**
   - Frontend: http://localhost:3000
   - Backend API: http://127.0.0.1:8000

## API Endpoints

| Endpoint    | Method | Description            | Security Features                              |
|-------------|--------|------------------------|-----------------------------------------------|
| /register/  | POST   | Register a new user    | Password validation, Argon2 hashing           |
| /login/     | POST   | Authenticate users     | Rate limiting, JWT tokens, generic errors     |
| /logout/    | POST   | Revoke user session    | Token blacklisting                            |
| /profile/   | GET    | Fetch user profile     | Authentication required                       |

## Raspberry Pi Deployment

To deploy this application on a Raspberry Pi, follow these steps:

1. **Set up the Raspberry Pi:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install python3-pip python3-venv nodejs npm
   ```

2. **Deploy the Backend:**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver 0.0.0.0:8000
   ```

3. **Deploy the Frontend:**
   ```bash
   cd frontend
   npm install
   npm run build
   npm install -g serve
   serve -s build -l 3000
   ```

For production deployment, consider using Gunicorn with Nginx for the backend and PM2 for the frontend.

## Security Lessons and Best Practices

This project demonstrates several security best practices:

1. **Never rely on client-side validation alone** - All security checks must be performed on the server
2. **Use strong password hashing algorithms** (Argon2, bcrypt, or PBKDF2)
3. **Implement rate limiting** to prevent brute-force attacks
4. **Use generic error messages** to prevent account enumeration
5. **Avoid storing sensitive information** in client-accessible storage
6. **Properly secure tokens and sessions** with appropriate expiration times
7. **Use HTTPS** for all communications between client and server

## Educational Purpose

This project was created for educational purposes to demonstrate common security vulnerabilities in web authentication systems and their proper remediation. The vulnerable implementations should not be used in production environments.

## License

This project is provided as-is under the MIT License. See the LICENSE file for details.

## Acknowledgments

- BSC2420 Computer Security course instructors and classmates
- OWASP for security best practices and guidelines
