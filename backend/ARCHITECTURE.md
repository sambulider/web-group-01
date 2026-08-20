# System Architecture

Complete architecture overview for the American Corner Management System.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND TIER                            │
├─────────────────────────────────────────────────────────────────┤
│  React 18 + TypeScript + Vite                                   │
│  ├─ Public Site (Home, Programs, Gallery, Contact)             │
│  ├─ Student Dashboard (Enrollments, Attendance, Certificates)  │
│  ├─ Volunteer Dashboard (Assignments, Hours Logging)           │
│  └─ Admin Dashboard (CMS, Analytics, Member Management)        │
│                                                                  │
│  http://localhost:3000 (dev) → https://yourdomain.com (prod)  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/HTTPS
              ┌───────────────────────────────┐
              │   REVERSE PROXY / LOAD        │
              │   BALANCER (Nginx/CloudFront) │
              └───────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        API TIER (Backend)                       │
├─────────────────────────────────────────────────────────────────┤
│  FastAPI + Python 3.11                                          │
│  ├─ Authentication Service (JWT, RBAC)                         │
│  ├─ User Management                                             │
│  ├─ Program Management                                          │
│  ├─ Enrollment Service                                          │
│  ├─ Attendance QR Scanning                                      │
│  ├─ Volunteer Management                                        │
│  ├─ Analytics & Reporting                                       │
│  └─ Notification Service                                        │
│                                                                  │
│  http://localhost:8000 (dev) → https://api.yourdomain.com      │
└─────────────────────────────────────────────────────────────────┘
       │                    │                      │
       ↓                    ↓                      ↓
┌─────────────────┐  ┌──────────────┐  ┌─────────────────────┐
│  DATABASE TIER  │  │  CACHE TIER  │  │  STORAGE TIER       │
│  PostgreSQL     │  │  Redis       │  │  S3/Cloud Storage   │
│  (Supabase)     │  │  (Optional)  │  │  Images & Videos    │
└─────────────────┘  └──────────────┘  └─────────────────────┘
```

## Component Details

### Frontend Layer

**Technology Stack:**
- React 18.3.1 (UI framework)
- TypeScript 5.5 (type safety)
- Vite 8.2.1 (build tool)
- React Router v6 (routing)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Lucide React (icons)

**Features:**
- Responsive design (mobile-first)
- Dark mode support
- Real-time notifications (via polling)
- QR code display for attendance
- Progressive forms with validation
- Charts and analytics visualizations

**Deployment:**
- Static hosting (Vercel, Netlify, AWS S3)
- CDN for global distribution
- Automatic HTTPS

### Backend Layer

**Technology Stack:**
- FastAPI 0.104 (web framework)
- Python 3.11 (language)
- SQLAlchemy 2.0 (ORM)
- Pydantic 2.5 (data validation)
- Alembic (database migrations)
- PyJWT (authentication)
- Passlib + Bcrypt (security)

**Architecture:**
```
app/
├── main.py              # FastAPI app initialization
├── config.py            # Configuration management
├── database.py          # Database connection
├── security.py          # Authentication & RBAC
├── models/              # SQLAlchemy ORM models
├── schemas/             # Pydantic request/response schemas
├── api/v1/              # API route handlers
│   ├── auth.py
│   ├── users.py
│   ├── programs.py
│   ├── enrollments.py
│   ├── attendance.py
│   ├── admin.py
│   └── ...
├── services/            # Business logic layer
├── utils/               # Helper functions
└── migrations/          # Database schema versions
```

**API Design:**
- RESTful endpoints
- Versioning (v1)
- Comprehensive error handling
- Rate limiting
- CORS security
- OpenAPI/Swagger documentation

### Database Layer

**Technology:**
- PostgreSQL 13+ (Supabase)
- Connection pooling (20 connections)
- Automated backups
- Point-in-time recovery

**Schema:**

```
users
├─ id (PK)
├─ email (unique)
├─ password_hash
├─ name
├─ role (student|volunteer|admin)
├─ member_id (unique)
└─ [relationships: enrollments, assignments, notifications]

programs
├─ id (PK)
├─ title
├─ category
├─ status (open|closed|upcoming)
├─ schedule
├─ seats
├─ mode (in_person|hybrid|online)
├─ facilitator_id (FK → users)
└─ [relationships: enrollments, attendance_records]

enrollments
├─ id (PK)
├─ user_id (FK → users)
├─ program_id (FK → programs)
├─ status (active|completed|dropped)
├─ progress
├─ attendance_percentage
├─ sessions_attended/total
└─ enrolled_at, completed_at

attendance_records
├─ id (PK)
├─ user_id (FK → users)
├─ program_id (FK → programs)
├─ result (success|duplicate|not_enrolled)
├─ scanner_id
└─ scanned_at

assignments
├─ id (PK)
├─ volunteer_id (FK → users)
├─ activity
├─ date, start_time, end_time
├─ role
├─ hours
├─ status
└─ [timestamps]

announcements, events, gallery_items, notifications
└─ [similar structure with appropriate fields]
```

**Indexes:**
- `users(role, is_active)` - Fast role-based queries
- `programs(status, category)` - Program filtering
- `enrollments(user_id, status)` - User enrollments
- `attendance_records(user_id, scanned_at)` - Quick lookups
- `events(event_date, is_published)` - Upcoming events

### Caching Layer (Optional)

**Technology:** Redis

**Use Cases:**
- Session storage (JWT token blacklisting)
- Query result caching
- Rate limiting counters
- Real-time activity feeds
- Leaderboards

### Storage Layer

**For User Uploads:**
- S3/Cloud Storage for images and videos
- File validation (type, size)
- Automatic thumbnails
- CDN distribution
- Access control

## Data Flow

### Authentication Flow

```
1. User submits login credentials
2. Backend validates credentials against password hash
3. Backend generates JWT tokens (access + refresh)
4. Frontend stores tokens in secure storage
5. Frontend sends access token with each request
6. Backend validates token expiration and signature
7. Backend extracts user info from token claims
```

### QR Attendance Flow

```
1. Student opens dashboard and displays QR code
   └─ QR Code contains member_id + program_id
2. Admin scans QR code with phone/device
   └─ Scanner software decodes QR
3. Frontend sends attendance/scan endpoint
   └─ POST /api/v1/attendance/scan
4. Backend validates:
   ├─ User exists and is active
   ├─ User is enrolled in program
   └─ User hasn't been scanned today
5. Backend creates AttendanceRecord
6. Backend updates Enrollment progress/attendance
7. Frontend displays result (✓ success, ⚠ duplicate, ✗ not enrolled)
8. Audio feedback (beep) confirms scan
```

### Program Enrollment Flow

```
1. Student browses programs
2. Student clicks "Apply" → redirects to Google Form
3. Admin manually adds student to program OR
4. Student navigates to dashboard after enrollment
   └─ Creates Enrollment record
5. Frontend displays enrolled programs
6. Attendance is tracked for this program
7. Progress is calculated based on sessions attended
8. Completion generates certificate
```

### Analytics Flow

```
1. Admin requests dashboard analytics
2. Backend aggregates data:
   ├─ Query users count grouped by role
   ├─ Query enrollments by status
   ├─ Query attendance statistics by program
   ├─ Calculate volunteer hours by month
   └─ Trend analysis
3. Backend caches results (1 hour)
4. Frontend displays charts and metrics
5. Admin can export as CSV/Excel
```

## Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────────────┐
│ Frontend                                    │
│ ├─ User enters credentials                 │
│ └─ POST /auth/login                        │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ Backend Authentication                      │
│ ├─ Verify email exists                     │
│ ├─ Hash password & compare                 │
│ ├─ Generate JWT tokens                     │
│ │  ├─ Access token (30 min expiry)        │
│ │  └─ Refresh token (7 day expiry)        │
│ └─ Return tokens to frontend               │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ Frontend Storage                            │
│ ├─ Store access token in memory/sessionStorage
│ ├─ Store refresh token in secure HttpOnly cookie
│ └─ Include access token in Authorization header
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ Subsequent Requests                         │
│ ├─ Include token in Authorization header   │
│ └─ Backend validates token                 │
│    ├─ Check signature                      │
│    ├─ Check expiration                     │
│    └─ Extract user info from claims       │
└─────────────────────────────────────────────┘
```

### Role-Based Access Control (RBAC)

```
Student Role:
├─ View own profile
├─ View available programs
├─ Enroll in programs
├─ View own enrollments & progress
├─ View own attendance
└─ Display QR pass for scanning

Volunteer Role:
├─ All Student permissions +
├─ View assigned activities
├─ Log volunteer hours
├─ View personal schedule
└─ View volunteer statistics

Admin Role:
├─ All permissions
├─ Manage users
├─ CRUD programs
├─ Manage enrollments
├─ Operate QR scanner
├─ Manage content (announcements, gallery)
├─ View analytics & reports
└─ Export data
```

### Security Best Practices

1. **Password Security**
   - Bcrypt hashing with salt
   - Minimum 8 characters enforced
   - No plaintext storage

2. **Token Security**
   - JWT with HS256 algorithm
   - Unique SECRET_KEY per environment
   - Short access token expiry (30 min)
   - Refresh token rotation

3. **HTTPS/TLS**
   - Enforced in production
   - Certificate auto-renewal
   - HSTS headers

4. **Input Validation**
   - Pydantic schemas validate all input
   - SQL injection prevention (ORM)
   - XSS prevention (no eval)
   - CSRF tokens for state-changing operations

5. **Rate Limiting**
   - 100 requests/minute per user
   - Prevents brute force attacks
   - Progressive delays for repeated failures

6. **Audit Logging**
   - Track sensitive operations
   - Login attempts
   - Admin changes
   - Data exports

## Performance Architecture

### Query Optimization

```
Program Listing:
├─ Index on (status, category)
├─ Pagination (20 items default)
├─ Lazy load relationships
└─ Cache popular categories

Attendance Reports:
├─ Index on (user_id, scanned_at)
├─ Batch date range queries
├─ Aggregate in application
└─ Cache daily summaries

User Enrollments:
├─ Eager load program relationship
├─ Index on (user_id, status)
└─ Filter in database
```

### Caching Strategy

```
Cache Layer:
├─ User profiles (5 minutes)
├─ Program list (10 minutes)
├─ Analytics dashboard (1 hour)
├─ Attendance statistics (1 day)
└─ Session tokens (duration of token)

Cache Invalidation:
├─ On every write operation
├─ Time-based expiry
├─ Manual invalidation for important data
└─ Cascading invalidation for related data
```

### Response Optimization

```
API Responses:
├─ Gzip compression enabled
├─ Minimal JSON payloads
├─ Pagination for large datasets
└─ HTTP caching headers

Frontend Optimization:
├─ Code splitting by route
├─ Lazy loading components
├─ Image optimization
└─ Service worker for offline support
```

## Deployment Architecture

### Development Environment

```
docker-compose.yml
├─ FastAPI backend (port 8000)
├─ PostgreSQL database (port 5432)
├─ Redis cache (port 6379)
├─ pgAdmin UI (port 5050)
└─ Frontend dev server (port 5173)

Volumes:
├─ postgres_data
└─ redis_data
```

### Production Environment

```
Option 1: AWS
├─ Application Load Balancer
├─ ECS Fargate (for backend)
├─ RDS PostgreSQL
├─ ElastiCache Redis
├─ S3 for uploads
├─ CloudFront CDN
└─ Route 53 DNS

Option 2: Vercel
├─ Edge functions
├─ Supabase for database
├─ Vercel Analytics
└─ Automatic scaling

Option 3: DigitalOcean
├─ App Platform
├─ Managed Database
├─ Spaces for storage
└─ CDN integration
```

## Monitoring & Observability

### Metrics Collected

```
Application Metrics:
├─ Request count & latency
├─ Error rate & types
├─ Database query performance
├─ Cache hit/miss ratios
└─ Worker queue depth

Infrastructure Metrics:
├─ CPU & Memory usage
├─ Disk I/O
├─ Network throughput
├─ Database connections
└─ Container health

Business Metrics:
├─ Active users
├─ Enrollments per program
├─ Attendance rate
├─ Volunteer hours logged
└─ Certificate completions
```

### Logging Strategy

```
Log Levels:
├─ ERROR: Application errors, exceptions
├─ WARN: Deprecated endpoints, resource warnings
├─ INFO: Major events (login, enrollment, creation)
└─ DEBUG: Detailed request/response data

Log Destinations:
├─ Console (development)
├─ CloudWatch (AWS)
├─ ELK Stack (on-premise)
└─ Sentry (error tracking)
```

## Scalability Considerations

### Horizontal Scaling

```
Load Balancer
├─ Backend Instance 1
├─ Backend Instance 2
├─ Backend Instance 3
└─ Backend Instance N

Database
├─ Single RDS with read replicas
├─ Connection pooling
└─ Sharding if needed (future)
```

### Vertical Scaling

```
Database: t3.medium → t3.large → r5.xlarge
Backend: 0.5 CPU → 1 CPU → 2 CPU
Cache: 512MB → 1GB → 5GB
```

### Caching Layer

```
Redis Cluster
├─ High availability
├─ Automatic failover
├─ Data persistence
└─ Keyspace sharding
```

## Disaster Recovery

### Backup Strategy

```
Daily Automated Backups
├─ Time: 2:00 AM UTC
├─ Retention: 30 days
├─ Storage: S3 with versioning
└─ Encryption: AES-256

Monthly Manual Backups
├─ Full database dumps
├─ Application configuration
└─ Separate secure storage

RTO: 1 hour (Recovery Time Objective)
RPO: 1 hour (Recovery Point Objective)
```

### High Availability

```
Active-Active Setup:
├─ Multiple backend instances
├─ Load balancer health checks
├─ Database replication
├─ Automatic failover
└─ DNS failover (secondary domain)
```

## Technology Justification

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Frontend | React | Large ecosystem, community support, performance |
| Build | Vite | Fast development, modern ES modules |
| Backend | FastAPI | High performance, async support, auto-docs |
| Database | PostgreSQL | ACID compliance, powerful features, scalability |
| ORM | SQLAlchemy | Type-safe, flexible, widely adopted |
| Auth | JWT | Stateless, scalable, industry standard |
| Caching | Redis | In-memory speed, session management, pub/sub |
| Deployment | Docker | Consistency, portability, isolation |
| Monitoring | CloudWatch/DataDog | Comprehensive, real-time, alerting |

## Future Enhancements

```
Phase 2 (Q2 2024):
├─ Real-time notifications (WebSocket)
├─ Video conferencing (Jitsi/Zoom integration)
├─ Mobile app (React Native)
└─ Advanced analytics (ML recommendations)

Phase 3 (Q3 2024):
├─ Microservices architecture
├─ Event sourcing
├─ GraphQL API
├─ Offline-first sync
└─ Blockchain certificates

Phase 4 (Q4 2024):
├─ Multi-language support
├─ AI chatbot (customer support)
├─ Gamification (badges, leaderboards)
└─ Social network features
```
