# Backend Setup and Deployment Guide

## Prerequisites

- Python 3.11+
- PostgreSQL 13+ (or Supabase)
- Git
- Docker (optional, for containerized deployment)

## Local Development Setup

### 1. Clone and Install

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Database (Supabase example)
DATABASE_URL=postgresql://postgres:password@db.project.supabase.co:5432/postgres

# Generate a secure SECRET_KEY
SECRET_KEY=your-very-secure-random-key-here

# Allow frontend URLs
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Email settings (optional)
SMTP_SERVER=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### 3. Initialize Database

```bash
# Create tables using Alembic
alembic upgrade head

# Or using SQLAlchemy (one-time, use Alembic for production)
python -c "from app.database import Base, engine; from app.models import *; Base.metadata.create_all(bind=engine)"
```

### 4. Run Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Visit:
- API: http://localhost:8000
- Swagger docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Docker Development

### Quick Start

```bash
docker-compose up -d
```

Containers will be available:
- Backend API: http://localhost:8000
- PostgreSQL: localhost:5432
- pgAdmin: http://localhost:5050
- Redis: localhost:6379

### Database Migrations in Docker

```bash
docker-compose exec backend alembic upgrade head
docker-compose exec backend alembic current  # Check current version
```

### Logs

```bash
docker-compose logs -f backend
docker-compose logs -f postgres
```

### Cleanup

```bash
docker-compose down --volumes  # Remove volumes too
```

## Database Management

### Alembic Migrations

```bash
# Check current schema version
alembic current

# See migration history
alembic history

# Create new migration (auto-detect changes)
alembic revision --autogenerate -m "Add new feature"

# Apply migration
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# Downgrade to specific revision
alembic downgrade <revision_id>
```

### Seed Sample Data

```bash
python scripts/seed_data.py
```

## Testing

### Run Tests

```bash
pytest tests/ -v
pytest tests/ -v --cov=app  # With coverage
pytest tests/ -x  # Stop on first failure
pytest tests/test_auth.py  # Specific test file
```

### Run with Coverage Report

```bash
pytest --cov=app --cov-report=html
# Open htmlcov/index.html in browser
```

## API Development

### Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app
│   ├── config.py            # Configuration
│   ├── database.py          # DB connection
│   ├── security.py          # JWT, RBAC
│   ├── models/              # SQLAlchemy ORM
│   ├── schemas/             # Pydantic models
│   ├── api/v1/              # API endpoints
│   └── services/            # Business logic
├── alembic/                 # Database migrations
├── tests/                   # Test suite
└── scripts/                 # Utility scripts
```

### Adding New Endpoints

1. **Create schema** in `app/schemas/`:
   ```python
   class ItemCreate(BaseModel):
       name: str
       description: Optional[str] = None
   ```

2. **Create model** in `app/models/`:
   ```python
   class Item(Base):
       __tablename__ = "items"
       id = Column(String(36), primary_key=True)
       name = Column(String(255), nullable=False)
   ```

3. **Create route** in `app/api/v1/`:
   ```python
   @router.post("/items", response_model=Item)
   async def create_item(item: ItemCreate, db: Session = Depends(get_db)):
       db_item = Item(**item.dict())
       db.add(db_item)
       db.commit()
       return db_item
   ```

4. **Register router** in `app/main.py`:
   ```python
   app.include_router(items.router, prefix=settings.API_V1_PREFIX)
   ```

## Production Deployment

### 1. Supabase Database Setup

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Project Settings → Database
4. Add to `.env`:
   ```
   DATABASE_URL=postgresql://user:password@db.XXX.supabase.co:5432/postgres
   ```

### 2. Environment Configuration

```bash
# Generate secure SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Update .env for production
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=<secure-key-from-above>
ALLOWED_ORIGINS=https://yourdomain.com
```

### 3. Build Docker Image

```bash
docker build -t american-corner-api:latest .

# Tag for registry
docker tag american-corner-api:latest your-registry/american-corner-api:latest
docker push your-registry/american-corner-api:latest
```

### 4. Deploy to Cloud

#### AWS ECR + ECS

```bash
# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
docker tag american-corner-api:latest your-account.dkr.ecr.us-east-1.amazonaws.com/american-corner-api:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/american-corner-api:latest

# Create ECS task definition and service using AWS console or CLI
```

#### Docker Swarm

```bash
docker stack deploy -c docker-compose.prod.yml american-corner
```

#### Kubernetes

```bash
# Create ConfigMap for environment
kubectl create configmap api-config --from-file=.env.prod

# Deploy
kubectl apply -f k8s/deployment.yaml
```

### 5. Run Database Migrations in Production

```bash
# Using Docker
docker run --env-file .env.prod your-registry/american-corner-api alembic upgrade head

# Or connect to container
docker exec <container-id> alembic upgrade head
```

### 6. Setup Monitoring & Logging

- Enable CloudWatch, DataDog, or ELK
- Configure Sentry for error tracking
- Set up health checks
- Configure backup strategy

## Troubleshooting

### Database Connection Issues

```bash
# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT version();"

# Test in app
python -c "from app.database import engine; print(engine.execute('SELECT 1'))"
```

### Migration Issues

```bash
# See current state
alembic current
alembic branches
alembic downgrade -1  # Rollback last migration

# Stamp to specific version (use carefully!)
alembic stamp <revision_id>
```

### Port Already in Use

```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9  # Linux/Mac
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process  # PowerShell
```

## Performance Optimization

### Database
- Add appropriate indexes
- Use pagination for large datasets
- Implement connection pooling (default: 20 connections)
- Regular ANALYZE and VACUUM

### Caching
- Redis for session storage
- Query result caching
- HTTP response caching headers

### API
- Compress responses (gzip)
- Implement rate limiting
- Batch operations
- Async operations for long tasks

## Security Checklist

- [ ] SECRET_KEY is strong and unique
- [ ] Database credentials are stored in .env
- [ ] CORS origins are properly restricted
- [ ] Passwords are hashed with bcrypt
- [ ] HTTPS enforced in production
- [ ] JWT expiration times are reasonable
- [ ] Sensitive data is not logged
- [ ] SQL injection prevention (using ORM)
- [ ] Input validation on all endpoints
- [ ] CSRF protection for state-changing operations
- [ ] Rate limiting enabled
- [ ] Regular security updates

## Getting Help

1. Check logs: `docker-compose logs -f backend`
2. Test endpoints: Use Swagger UI at `/docs`
3. Check .env configuration
4. Review database schema: `\dt` in psql
5. Run tests: `pytest -v`

## Resources

- FastAPI: https://fastapi.tiangolo.com/
- SQLAlchemy: https://docs.sqlalchemy.org/
- Alembic: https://alembic.sqlalchemy.org/
- Pydantic: https://docs.pydantic.dev/
- PostgreSQL: https://www.postgresql.org/docs/
- Supabase: https://supabase.com/docs
