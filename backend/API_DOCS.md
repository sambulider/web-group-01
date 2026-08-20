# American Corner Management System - API Documentation

Complete API reference for the FastAPI backend.

## Base URL

- **Development**: `http://localhost:8000/api/v1`
- **Production**: `https://api.americancornerbatti.lk/api/v1`

## Authentication

All endpoints (except `/auth/register` and `/auth/login`) require authentication via JWT token.

### Header Format

```
Authorization: Bearer <access_token>
```

### Token Structure

Access tokens expire after 30 minutes. Use refresh tokens to obtain new access tokens without re-login.

## API Endpoints

### Health & Status

#### Health Check
```http
GET /health
```

**Response** (200 OK)
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "production"
}
```

---

## Authentication Endpoints

### User Registration
```http
POST /auth/register
Content-Type: application/json
```

**Request Body**
```json
{
  "email": "student@example.com",
  "password": "securepassword123",
  "name": "Sanjana Mahendran",
  "role": "student",
  "phone": "+94763312210",
  "institution": "Eastern University"
}
```

**Response** (201 Created)
```json
{
  "id": "u-1024",
  "email": "student@example.com",
  "name": "Sanjana Mahendran",
  "role": "student",
  "member_id": "ACB-STU-1024",
  "is_active": true,
  "created_at": "2024-01-01T10:00:00Z"
}
```

**Error Response** (400 Bad Request)
```json
{
  "detail": "Email already registered"
}
```

---

### User Login
```http
POST /auth/login
Content-Type: application/json
```

**Request Body**
```json
{
  "email": "student@example.com",
  "password": "securepassword123"
}
```

**Response** (200 OK)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

---

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json
```

**Request Body**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

---

### Logout
```http
POST /auth/logout
Authorization: Bearer <access_token>
```

**Response** (204 No Content)

---

## User Endpoints

### Get Current User Profile
```http
GET /users/me
Authorization: Bearer <access_token>
```

**Response** (200 OK)
```json
{
  "id": "u-1024",
  "email": "student@example.com",
  "name": "Sanjana Mahendran",
  "role": "student",
  "member_id": "ACB-STU-1024",
  "phone": "+94763312210",
  "institution": "Eastern University",
  "avatar_url": "https://i.pravatar.cc/200?img=45",
  "is_active": true,
  "is_verified": true,
  "created_at": "2024-01-01T10:00:00Z",
  "last_login": "2024-01-15T14:30:00Z"
}
```

---

### Update User Profile
```http
PUT /users/me
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body**
```json
{
  "name": "Sanjana M.",
  "phone": "+94763312211",
  "institution": "Eastern University - Engineering"
}
```

**Response** (200 OK)
```json
{
  "id": "u-1024",
  "email": "student@example.com",
  "name": "Sanjana M.",
  "role": "student",
  "member_id": "ACB-STU-1024",
  "phone": "+94763312211",
  "institution": "Eastern University - Engineering",
  "avatar_url": "https://i.pravatar.cc/200?img=45",
  "is_active": true,
  "is_verified": true,
  "created_at": "2024-01-01T10:00:00Z",
  "last_login": "2024-01-15T14:30:00Z"
}
```

---

### List Users (Admin Only)
```http
GET /users?page=1&page_size=20&role=student
Authorization: Bearer <admin_token>
```

**Query Parameters**
- `page` (integer): Page number (default: 1)
- `page_size` (integer): Items per page (default: 20, max: 100)
- `role` (string): Filter by role (student, volunteer, admin)
- `is_active` (boolean): Filter by active status

**Response** (200 OK)
```json
{
  "items": [
    {
      "id": "u-1024",
      "email": "student@example.com",
      "name": "Sanjana Mahendran",
      "role": "student",
      "member_id": "ACB-STU-1024",
      "is_active": true,
      "created_at": "2024-01-01T10:00:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "page_size": 20,
  "total_pages": 8,
  "has_next": true,
  "has_previous": false
}
```

---

## Program Endpoints

### List Programs
```http
GET /programs?page=1&status=open&category=skill_development
Authorization: Bearer <access_token>
```

**Query Parameters**
- `page` (integer): Page number
- `status` (string): Filter by status (open, closed, upcoming)
- `category` (string): Filter by category
- `featured` (boolean): Only featured programs

**Response** (200 OK)
```json
{
  "items": [
    {
      "id": "dl-101",
      "title": "Digital Literacy Foundations",
      "category": "digital_literacy",
      "status": "open",
      "description": "A six-week practical course...",
      "schedule": "Mon & Wed · 4:00 PM",
      "duration": "6 weeks",
      "seats": 40,
      "mode": "in_person",
      "facilitator_id": "u-0001",
      "image_url": "https://images.unsplash.com/...",
      "form_url": "https://forms.google.com/...",
      "is_featured": true,
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-15T14:30:00Z"
    }
  ],
  "total": 12,
  "page": 1,
  "page_size": 20,
  "total_pages": 1,
  "has_next": false,
  "has_previous": false
}
```

---

### Get Program Details
```http
GET /programs/{program_id}
Authorization: Bearer <access_token>
```

**Response** (200 OK)
```json
{
  "id": "dl-101",
  "title": "Digital Literacy Foundations",
  "category": "digital_literacy",
  "status": "open",
  "description": "A six-week practical course...",
  "schedule": "Mon & Wed · 4:00 PM",
  "duration": "6 weeks",
  "seats": 40,
  "mode": "in_person",
  "facilitator_id": "u-0001",
  "image_url": "https://images.unsplash.com/...",
  "form_url": "https://forms.google.com/...",
  "is_featured": true,
  "seats_available": 9,
  "enrollments_count": 31,
  "attendance_records_count": 245,
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-15T14:30:00Z"
}
```

---

### Create Program (Admin Only)
```http
POST /programs
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body**
```json
{
  "title": "New Program",
  "category": "skill_development",
  "status": "upcoming",
  "description": "Program description",
  "schedule": "Mon & Wed · 4:00 PM",
  "duration": "6 weeks",
  "seats": 40,
  "mode": "in_person",
  "facilitator_id": "u-0001",
  "image_url": "https://images.unsplash.com/...",
  "form_url": "https://forms.google.com/...",
  "is_featured": false
}
```

**Response** (201 Created)
```json
{
  "id": "prog-1234",
  "title": "New Program",
  ...
}
```

---

### Update Program (Admin Only)
```http
PUT /programs/{program_id}
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body** (all fields optional)
```json
{
  "status": "closed",
  "seats": 35
}
```

**Response** (200 OK)

---

### Delete Program (Admin Only)
```http
DELETE /programs/{program_id}
Authorization: Bearer <admin_token>
```

**Response** (204 No Content)

---

## Enrollment Endpoints

### Get My Enrollments
```http
GET /enrollments/me?status=active
Authorization: Bearer <student_token>
```

**Query Parameters**
- `status` (string): Filter by status (active, completed, dropped)

**Response** (200 OK)
```json
{
  "items": [
    {
      "id": "enr-1024",
      "user_id": "u-1024",
      "program_id": "dl-101",
      "status": "active",
      "progress": 72,
      "attendance_percentage": 92.0,
      "sessions_attended": 11,
      "sessions_total": 12,
      "enrolled_at": "2024-01-01T10:00:00Z",
      "completed_at": null
    }
  ],
  ...pagination fields...
}
```

---

### Enroll in Program
```http
POST /programs/{program_id}/enroll
Authorization: Bearer <student_token>
```

**Response** (201 Created)
```json
{
  "id": "enr-1024",
  "user_id": "u-1024",
  "program_id": "dl-101",
  "status": "active",
  "progress": 0,
  "attendance_percentage": 0.0,
  "sessions_attended": 0,
  "sessions_total": 12,
  "enrolled_at": "2024-01-15T14:30:00Z",
  "completed_at": null
}
```

---

### Unenroll from Program
```http
DELETE /enrollments/{enrollment_id}
Authorization: Bearer <student_token>
```

**Response** (204 No Content)

---

### Update Enrollment Progress
```http
PUT /enrollments/{enrollment_id}/progress
Authorization: Bearer <admin_token> or <student_token>
Content-Type: application/json
```

**Request Body**
```json
{
  "progress": 85,
  "attendance_percentage": 95.0,
  "sessions_attended": 11,
  "sessions_total": 12
}
```

**Response** (200 OK)

---

## Attendance Endpoints

### Scan QR Code
```http
POST /attendance/scan
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body**
```json
{
  "member_id": "ACB-STU-1024",
  "program_id": "dl-101",
  "scanner_id": "ACB-DESK-01"
}
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "Attendance recorded",
  "result": "success",
  "user_name": "Sanjana Mahendran",
  "program_name": "Digital Literacy Foundations",
  "timestamp": "2024-01-15T16:30:00Z"
}
```

**Error Response** (400 Bad Request)
```json
{
  "success": false,
  "message": "Already scanned today",
  "result": "duplicate",
  "timestamp": "2024-01-15T16:35:00Z"
}
```

---

### Manual Attendance Entry (Admin Only)
```http
POST /attendance/manual
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body**
```json
{
  "user_id": "u-1024",
  "program_id": "dl-101",
  "scanner_id": "ACB-DESK-01"
}
```

**Response** (201 Created)

---

### Get Attendance Records (Admin Only)
```http
GET /attendance?program_id=dl-101&date=2024-01-15
Authorization: Bearer <admin_token>
```

**Query Parameters**
- `program_id` (string): Filter by program
- `user_id` (string): Filter by user
- `date` (string): Filter by date (YYYY-MM-DD)

**Response** (200 OK)
```json
{
  "items": [
    {
      "id": "att-1024",
      "user_id": "u-1024",
      "program_id": "dl-101",
      "result": "success",
      "scanned_at": "2024-01-15T16:30:00Z"
    }
  ],
  ...pagination fields...
}
```

---

### Get User Attendance History
```http
GET /users/{user_id}/attendance
Authorization: Bearer <admin_token>
```

**Response** (200 OK)
```json
{
  "items": [
    {
      "user_id": "u-1024",
      "user_name": "Sanjana Mahendran",
      "program_id": "dl-101",
      "program_name": "Digital Literacy Foundations",
      "sessions_attended": 11,
      "sessions_total": 12,
      "attendance_percentage": 91.67,
      "last_attended": "2024-01-15T16:30:00Z"
    }
  ],
  ...pagination fields...
}
```

---

## Admin Analytics Endpoints

### Get Dashboard Analytics
```http
GET /admin/analytics
Authorization: Bearer <admin_token>
```

**Response** (200 OK)
```json
{
  "summary": {
    "total_members": 450,
    "active_members": 380,
    "total_programs": 12,
    "open_programs": 8,
    "total_enrollments": 1250,
    "average_attendance": 87.5,
    "total_volunteer_hours": 3450
  },
  "enrollment_trend": [
    {
      "month": "2024-01",
      "enrollments": 125,
      "completions": 23
    }
  ],
  "program_statistics": [
    {
      "program_id": "dl-101",
      "program_name": "Digital Literacy Foundations",
      "enrollments": 31,
      "attendance_rate": 92.5,
      "capacity_used": 77.5
    }
  ],
  "member_growth": [
    {
      "month": "2024-01",
      "new_members": 45,
      "total_members": 450
    }
  ]
}
```

---

### Export Attendance Report
```http
GET /admin/reports/attendance/export?program_id=dl-101&format=csv
Authorization: Bearer <admin_token>
```

**Query Parameters**
- `program_id` (string): Filter by program
- `date_from` (string): Start date (YYYY-MM-DD)
- `date_to` (string): End date (YYYY-MM-DD)
- `format` (string): Export format (csv, xlsx, json)

**Response** (200 OK - File download)

---

## Announcement Endpoints

### List Announcements
```http
GET /announcements?published=true&tag=deadline
Authorization: Bearer <access_token>
```

**Response** (200 OK)
```json
{
  "items": [
    {
      "id": "ann-001",
      "title": "Applications open for Digital Literacy",
      "body": "Seats are limited to 40 learners...",
      "tag": "deadline",
      "is_published": true,
      "is_featured": true,
      "created_at": "2024-01-11T10:00:00Z",
      "updated_at": "2024-01-15T14:30:00Z"
    }
  ],
  ...pagination fields...
}
```

---

### Create Announcement (Admin Only)
```http
POST /announcements
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body**
```json
{
  "title": "New Announcement",
  "body": "Full announcement text here...",
  "tag": "update",
  "is_published": true,
  "is_featured": false
}
```

---

## Event Endpoints

### List Events
```http
GET /events?date_from=2024-01-01&date_to=2024-12-31
Authorization: Bearer <access_token>
```

**Response** (200 OK)
```json
{
  "items": [
    {
      "id": "ev-1",
      "title": "Tech Talk: Careers in AI",
      "category": "tech_talk",
      "event_date": "2024-08-22",
      "start_time": "16:00:00",
      "end_time": "18:00:00",
      "location": "American Corner Hall",
      "capacity": 100,
      "registered": 76,
      "is_published": true,
      "created_at": "2024-01-01T10:00:00Z"
    }
  ],
  ...pagination fields...
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "detail": "Descriptive error message",
  "error_code": "SPECIFIC_ERROR_CODE",
  "timestamp": "2024-01-15T14:30:00Z"
}
```

### Common HTTP Status Codes

- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **422 Unprocessable Entity**: Validation error
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

---

## Rate Limiting

All endpoints are rate-limited to 100 requests per minute per user.

**Response Headers**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705339800
```

---

## Pagination

Endpoints that return lists support pagination:

**Query Parameters**
- `page` (integer, default: 1): Page number
- `page_size` (integer, default: 20, max: 100): Items per page

**Response Fields**
```json
{
  "items": [...],
  "total": 150,
  "page": 1,
  "page_size": 20,
  "total_pages": 8,
  "has_next": true,
  "has_previous": false
}
```

---

## Interactive API Exploration

- **Swagger UI**: `/docs`
- **ReDoc**: `/redoc`
- **OpenAPI JSON**: `/openapi.json`

Visit these in your browser when the API is running to explore and test endpoints interactively.

---

## Frontend Integration

### Example: Login and Fetch User

```javascript
// 1. Register
const registerResponse = await fetch('/api/v1/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    name: 'User Name',
    role: 'student'
  })
});

// 2. Login
const loginResponse = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const { access_token } = await loginResponse.json();

// 3. Fetch user profile
const profileResponse = await fetch('/api/v1/users/me', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
const profile = await profileResponse.json();
```

---

## Support

For API support and issues:
1. Check the logs: `docker-compose logs -f backend`
2. Review Swagger documentation: `/docs`
3. Check error responses for detailed messages
4. Contact: team@americancornerbatti.lk
