# American Corner Management System - Backend API

Production-grade FastAPI backend with PostgreSQL (Supabase) integration.

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization
│   ├── config.py               # Configuration management
│   ├── dependencies.py         # Dependency injection
│   ├── database.py             # Database connection & session
│   ├── security.py             # JWT, password hashing, RBAC
│   ├── middleware.py           # CORS, error handling, logging
│   ├── models/                 # SQLAlchemy ORM models
│   ├── schemas/                # Pydantic request/response schemas
│   ├── api/
│   │   ├── v1/
│   │   │   ├── auth.py         # Authentication endpoints
│   │   │   ├── users.py        # User management
│   │   │   ├── programs.py     # Program CRUD
│   │   │   ├── enrollments.py  # Enrollment management
│   │   │   ├── attendance.py   # QR scanning & attendance
│   │   │   ├── announcements.py# Announcements
│   │   │   ├── events.py       # Events
│   │   │   ├── gallery.py      # Gallery management
│   │   │   ├── assignments.py  # Volunteer assignments
│   │   │   ├── admin.py        # Admin analytics & reports
│   │   │   └── health.py       # Health checks
│   ├── services/               # Business logic
│   ├── utils/                  # Helper functions
│   └── migrations/             # Alembic database migrations
├── tests/
│   ├── conftest.py            # Pytest fixtures
│   ├── test_auth.py
│   ├── test_users.py
│   └── ...
├── .env.example               # Environment variables template
├── requirements.txt           # Python dependencies
├── pyproject.toml            # Project metadata
├── Dockerfile                # Docker configuration
├── docker-compose.yml        # Local development setup
└── run.sh                    # Quick start script
```

## Quick Start

1. **Clone and setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase connection string
   ```

3. **Run migrations**
   ```bash
   alembic upgrade head
   ```

4. **Start development server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **API Documentation**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Features

### Authentication & Security
- JWT token-based authentication (access + refresh tokens)
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Rate limiting
- CORS security
- SQL injection protection via ORM
- Input validation & sanitization

### Core Functionality
- User management with role assignment
- Program & enrollment management
- QR code attendance scanning
- Volunteer assignment & hour tracking
- Announcement & event management
- Gallery with image/video support
- Advanced analytics & reporting
- Audit logging for compliance

### Database
- PostgreSQL (Supabase) with connection pooling
- Alembic migrations for version control
- Properly indexed tables for performance
- Foreign key relationships & constraints
- Soft deletes for data integrity

### Testing & Documentation
- Unit & integration tests
- API documentation (OpenAPI/Swagger)
- Comprehensive docstrings
- Error handling with meaningful messages

## API Endpoints Overview

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - Login (returns tokens)
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout & revoke tokens

### Users
- `GET /api/v1/users/me` - Current user profile
- `PUT /api/v1/users/me` - Update profile
- `GET /api/v1/users` - List users (admin only)
- `POST /api/v1/users` - Create user (admin only)
- `PUT /api/v1/users/{id}` - Update user (admin only)
- `DELETE /api/v1/users/{id}` - Delete user (admin only)

### Programs
- `GET /api/v1/programs` - List programs (with filters)
- `POST /api/v1/programs` - Create program (admin only)
- `GET /api/v1/programs/{id}` - Get program details
- `PUT /api/v1/programs/{id}` - Update program (admin only)
- `DELETE /api/v1/programs/{id}` - Delete program (admin only)

### Enrollments
- `GET /api/v1/enrollments/me` - My enrollments (student)
- `POST /api/v1/programs/{id}/enroll` - Enroll in program
- `DELETE /api/v1/enrollments/{id}` - Unenroll from program
- `PUT /api/v1/enrollments/{id}/progress` - Update progress

### Attendance
- `POST /api/v1/attendance/scan` - QR code scan (returns result)
- `GET /api/v1/attendance` - Attendance history (admin)
- `GET /api/v1/attendance/{user_id}` - User attendance records
- `POST /api/v1/attendance/manual` - Manual attendance entry (admin)

### Admin Features
- `GET /api/v1/admin/analytics` - Dashboard metrics
- `GET /api/v1/admin/reports/enrollment` - Enrollment reports
- `GET /api/v1/admin/reports/attendance` - Attendance reports
- `GET /api/v1/admin/exports/{type}` - Export data (CSV/Excel)

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/dbname

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://example.com

# Email (optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Logging
LOG_LEVEL=INFO
```

## Development

### Running Tests
```bash
pytest tests/ -v --cov=app
```

### Database Migrations
```bash
# Create migration
alembic revision --autogenerate -m "Add new feature"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

### Docker Development
```bash
docker-compose up -d
docker-compose exec backend alembic upgrade head
# Access at http://localhost:8000
```

## Production Deployment

1. **Build Docker image**
   ```bash
   docker build -t american-corner-api:latest .
   ```

2. **Push to registry** (Docker Hub, AWS ECR, etc.)
   ```bash
   docker tag american-corner-api:latest your-registry/american-corner-api:latest
   docker push your-registry/american-corner-api:latest
   ```

3. **Deploy to cloud** (using docker-compose or Kubernetes)
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Run migrations**
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

## Performance Optimization

- Database query optimization with eager loading
- Redis caching layer (optional)
- Request logging & monitoring
- Database connection pooling
- Pagination for large datasets
- Compressed API responses

## Monitoring & Logging

- Structured JSON logging
- Request/response logging
- Error tracking (Sentry integration optional)
- Performance metrics via Prometheus
- Health check endpoints

## Security Checklist

- [x] HTTPS enforced in production
- [x] CORS properly configured
- [x] JWT tokens with expiration
- [x] Password hashing (bcrypt)
- [x] Input validation
- [x] SQL injection prevention (ORM)
- [x] Rate limiting
- [x] Audit logging
- [x] Environment variables for secrets
- [x] CSRF protection ready

## License

Proprietary - American Corner Batticaloa
