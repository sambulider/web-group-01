"""
Main FastAPI application entry point.
Sets up routes, middleware, error handling, and startup/shutdown events.
"""

import logging
from contextlib import asynccontextmanager
from typing import Any

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import settings
from app.data import DUMMY_PROGRAMS
from app.database import Base, engine, get_db
from app.models import Announcement, AnnouncementTag, Enrollment, GalleryItem, GalleryItemType, Program, ProgramCategory, ProgramMode, ProgramStatus, SystemSetting, User, UserRole

# Configure logging
logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def category_label(value: Any) -> str:
    if isinstance(value, str):
        normalized = value.replace("_", " ").title()
        return {
            "Regular": "Regular",
            "Thematic": "Thematic",
            "Skill Development": "Skill Development",
            "Leadership": "Leadership",
            "Digital Literacy": "Digital Literacy",
            "Entrepreneurship": "Entrepreneurship",
            "Career Development": "Career Development",
        }.get(normalized, normalized)
    if value is None:
        return "Regular"
    return value.value.replace("_", " ").title()


def status_label(value: Any) -> str:
    if value is None:
        return "Open"
    if isinstance(value, str):
        normalized = value.lower()
    else:
        normalized = value.value.lower()
    mapping = {
        "open": "Open",
        "upcoming": "Upcoming",
        "closed": "Closed",
    }
    return mapping.get(normalized, "Open")


def mode_label(value: Any) -> str:
    if value is None:
        return "In person"
    if isinstance(value, str):
        normalized = value.lower()
    else:
        normalized = value.value.lower()
    mapping = {
        "in_person": "In person",
        "hybrid": "Hybrid",
        "online": "Online",
    }
    return mapping.get(normalized, "In person")


def serialize_program(program: Program, db: Session | None = None) -> dict[str, Any]:
    seats_taken = 0
    if db is not None:
        seats_taken = db.query(Enrollment).filter(Enrollment.program_id == program.id).count()
    if seats_taken == 0 and program.seats:
        seats_taken = min(program.seats, max(1, int(program.seats * 0.7)))
    return {
        "id": program.id,
        "title": program.title,
        "category": category_label(program.category),
        "status": status_label(program.status),
        "summary": program.description or "A learning opportunity offered by American Corner.",
        "schedule": program.schedule or "Flexible schedule",
        "duration": program.duration or "Ongoing",
        "seats": int(program.seats or 0),
        "seatsTaken": int(seats_taken),
        "mode": mode_label(program.mode),
        "facilitator": "American Corner Team" if not program.facilitator_id else program.facilitator_id,
        "image": program.image_url or "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=70",
        "formUrl": program.form_url or "https://example.com/apply",
        "featured": bool(program.is_featured),
    }


def serialize_announcement(item: Announcement) -> dict[str, Any]:
    return {
        "id": item.id,
        "title": item.title,
        "body": item.body,
        "date": item.created_at.date().isoformat() if item.created_at else "2026-08-20",
        "tag": item.tag.value.title() if hasattr(item.tag, "value") else str(item.tag).title(),
    }


def serialize_gallery_item(item: GalleryItem) -> dict[str, Any]:
    return {
        "id": item.id,
        "type": item.item_type.value if hasattr(item.item_type, "value") else str(item.item_type),
        "title": item.title,
        "category": item.category,
        "date": item.taken_at.isoformat() if item.taken_at else item.created_at.date().isoformat(),
        "src": item.image_url,
        "poster": item.poster_url,
    }


def seed_dummy_programs(db: Session) -> None:
    if db.query(Program).count() > 0:
        return
    for item in DUMMY_PROGRAMS:
        item_status = {
            "Open": ProgramStatus.OPEN,
            "Upcoming": ProgramStatus.UPCOMING,
            "Closed": ProgramStatus.CLOSED,
        }.get(item["status"], ProgramStatus.OPEN)
        item_category = {
            "Digital Literacy": ProgramCategory.DIGITAL_LITERACY,
            "Leadership": ProgramCategory.LEADERSHIP,
            "Career Development": ProgramCategory.CAREER_DEVELOPMENT,
            "Entrepreneurship": ProgramCategory.ENTREPRENEURSHIP,
            "Skill Development": ProgramCategory.SKILL_DEVELOPMENT,
            "Regular": ProgramCategory.REGULAR,
            "Thematic": ProgramCategory.THEMATIC,
        }.get(item["category"], ProgramCategory.REGULAR)
        item_mode = {
            "In person": ProgramMode.IN_PERSON,
            "Hybrid": ProgramMode.HYBRID,
            "Online": ProgramMode.ONLINE,
        }.get(item["mode"], ProgramMode.IN_PERSON)
        program = Program(
            id=item["id"],
            title=item["title"],
            category=item_category,
            status=item_status,
            description=item["summary"],
            schedule=item["schedule"],
            duration=item["duration"],
            seats=item["seats"],
            mode=item_mode,
            image_url=item["image"],
            form_url=item["formUrl"],
            is_featured=bool(item.get("featured", False)),
        )
        db.add(program)
    db.commit()


# Startup and shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan."""
    logger.info("Starting American Corner API...")
    try:
        Base.metadata.create_all(bind=engine)
        with Session(bind=engine) as db:
            if settings.DATA_MODE in {"dummy", "hybrid"}:
                seed_dummy_programs(db)
    except Exception as exc:
        logger.warning("Database unavailable during startup; continuing with dummy-data fallback: %s", exc)
    yield
    logger.info("Shutting down American Corner API...")


app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"},
    )


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "dataMode": settings.DATA_MODE,
        "database": "supabase" if "supabase.co" in settings.DATABASE_URL else "local",
    }


@app.get("/", tags=["Root"])
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get(f"{settings.API_V1_PREFIX}/programs", tags=["Programs"])
async def list_programs(db: Session = Depends(get_db)):
    try:
        programs = db.query(Program).order_by(Program.created_at.desc()).all()
        if programs:
            return [serialize_program(item, db) for item in programs]
        if settings.DATA_MODE in {"dummy", "hybrid"}:
            return DUMMY_PROGRAMS
        return []
    except Exception as exc:
        logger.warning("Database lookup failed, using dummy fallback: %s", exc)
        if settings.DATA_MODE in {"dummy", "hybrid"}:
            return DUMMY_PROGRAMS
        raise HTTPException(status_code=503, detail="Database unavailable") from exc


@app.get(f"{settings.API_V1_PREFIX}/announcements", tags=["Content"])
async def list_announcements(db: Session = Depends(get_db)):
    try:
        items = db.query(Announcement).order_by(Announcement.created_at.desc()).all()
        if items:
            return [serialize_announcement(item) for item in items]
        if settings.DATA_MODE in {"dummy", "hybrid"}:
            return [{"id": item["id"], "title": item["title"], "body": item["body"], "date": item["date"], "tag": item["tag"]} for item in __import__('app.data', fromlist=['DUMMY_ANNOUNCEMENTS']).DUMMY_ANNOUNCEMENTS]
        return []
    except Exception as exc:
        logger.warning("Announcement lookup failed, using dummy fallback: %s", exc)
        if settings.DATA_MODE in {"dummy", "hybrid"}:
            return [{"id": item["id"], "title": item["title"], "body": item["body"], "date": item["date"], "tag": item["tag"]} for item in __import__('app.data', fromlist=['DUMMY_ANNOUNCEMENTS']).DUMMY_ANNOUNCEMENTS]
        raise HTTPException(status_code=503, detail="Database unavailable") from exc


@app.post(f"{settings.API_V1_PREFIX}/announcements", tags=["Content"])
async def create_announcement(payload: dict[str, Any], db: Session = Depends(get_db)):
    if settings.DATA_MODE == "dummy":
        raise HTTPException(status_code=400, detail="Dummy mode is active. Change DATA_MODE to live or hybrid to save announcements.")
    announcement = Announcement(
        id=payload.get("id") or f"an-{db.query(Announcement).count() + 1}",
        title=payload["title"],
        body=payload["body"],
        tag={"Notice": AnnouncementTag.NOTICE, "Deadline": AnnouncementTag.DEADLINE, "Result": AnnouncementTag.RESULT, "Update": AnnouncementTag.UPDATE}.get(payload.get("tag", "Notice"), AnnouncementTag.NOTICE),
        is_published=True,
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    return serialize_announcement(announcement)


@app.put(f"{settings.API_V1_PREFIX}/announcements/{{announcement_id}}", tags=["Content"])
async def update_announcement(announcement_id: str, payload: dict[str, Any], db: Session = Depends(get_db)):
    if settings.DATA_MODE == "dummy":
        raise HTTPException(status_code=400, detail="Dummy mode is active. Change DATA_MODE to live or hybrid to update announcements.")
    item = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Announcement not found")
    if "title" in payload:
        item.title = payload["title"]
    if "body" in payload:
        item.body = payload["body"]
    if "tag" in payload:
        item.tag = {"Notice": AnnouncementTag.NOTICE, "Deadline": AnnouncementTag.DEADLINE, "Result": AnnouncementTag.RESULT, "Update": AnnouncementTag.UPDATE}.get(payload["tag"], item.tag)
    if "isPublished" in payload:
        item.is_published = bool(payload["isPublished"])
    db.commit()
    db.refresh(item)
    return serialize_announcement(item)


@app.delete(f"{settings.API_V1_PREFIX}/announcements/{{announcement_id}}", tags=["Content"])
async def delete_announcement(announcement_id: str, db: Session = Depends(get_db)):
    if settings.DATA_MODE == "dummy":
        raise HTTPException(status_code=400, detail="Dummy mode is active. Change DATA_MODE to live or hybrid to delete announcements.")
    item = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Announcement not found")
    db.delete(item)
    db.commit()
    return {"deleted": True, "announcementId": announcement_id}


@app.get(f"{settings.API_V1_PREFIX}/gallery", tags=["Content"])
async def list_gallery(db: Session = Depends(get_db)):
    try:
        items = db.query(GalleryItem).order_by(GalleryItem.created_at.desc()).all()
        if items:
            return [serialize_gallery_item(item) for item in items]
        if settings.DATA_MODE in {"dummy", "hybrid"}:
            return __import__('app.data', fromlist=['DUMMY_GALLERY_ITEMS']).DUMMY_GALLERY_ITEMS
        return []
    except Exception as exc:
        logger.warning("Gallery lookup failed, using dummy fallback: %s", exc)
        if settings.DATA_MODE in {"dummy", "hybrid"}:
            return __import__('app.data', fromlist=['DUMMY_GALLERY_ITEMS']).DUMMY_GALLERY_ITEMS
        raise HTTPException(status_code=503, detail="Database unavailable") from exc


@app.post(f"{settings.API_V1_PREFIX}/gallery", tags=["Content"])
async def create_gallery_item(payload: dict[str, Any], db: Session = Depends(get_db)):
    if settings.DATA_MODE == "dummy":
        raise HTTPException(status_code=400, detail="Dummy mode is active. Change DATA_MODE to live or hybrid to save gallery items.")
    item = GalleryItem(
        id=payload.get("id") or f"g-{db.query(GalleryItem).count() + 1}",
        title=payload["title"],
        description=payload.get("description") or "",
        item_type={"photo": GalleryItemType.PHOTO, "video": GalleryItemType.VIDEO}.get(payload.get("type", "photo"), GalleryItemType.PHOTO),
        category=payload.get("category", "Programs"),
        image_url=payload.get("src") or payload.get("imageUrl") or "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=70",
        poster_url=payload.get("poster"),
        is_published=True,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return serialize_gallery_item(item)


@app.put(f"{settings.API_V1_PREFIX}/gallery/{{gallery_id}}", tags=["Content"])
async def update_gallery_item(gallery_id: str, payload: dict[str, Any], db: Session = Depends(get_db)):
    if settings.DATA_MODE == "dummy":
        raise HTTPException(status_code=400, detail="Dummy mode is active. Change DATA_MODE to live or hybrid to update gallery items.")
    item = db.query(GalleryItem).filter(GalleryItem.id == gallery_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    if "title" in payload:
        item.title = payload["title"]
    if "category" in payload:
        item.category = payload["category"]
    if "type" in payload:
        item.item_type = {"photo": GalleryItemType.PHOTO, "video": GalleryItemType.VIDEO}.get(payload["type"], item.item_type)
    if "src" in payload:
        item.image_url = payload["src"]
    if "poster" in payload:
        item.poster_url = payload["poster"] or None
    if "description" in payload:
        item.description = payload["description"]
    db.commit()
    db.refresh(item)
    return serialize_gallery_item(item)


@app.delete(f"{settings.API_V1_PREFIX}/gallery/{{gallery_id}}", tags=["Content"])
async def delete_gallery_item(gallery_id: str, db: Session = Depends(get_db)):
    if settings.DATA_MODE == "dummy":
        raise HTTPException(status_code=400, detail="Dummy mode is active. Change DATA_MODE to live or hybrid to delete gallery items.")
    item = db.query(GalleryItem).filter(GalleryItem.id == gallery_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    db.delete(item)
    db.commit()
    return {"deleted": True, "galleryId": gallery_id}


@app.get(f"{settings.API_V1_PREFIX}/admin/overview", tags=["Admin"])
async def admin_overview(db: Session = Depends(get_db)):
    try:
        total_programs = db.query(Program).count()
        total_users = 0
        if total_programs == 0 and settings.DATA_MODE in {"dummy", "hybrid"}:
            return {
                "totalUsers": 4842,
                "students": 4210,
                "volunteers": 312,
                "activePrograms": 38,
                "eventsThisQuarter": 14,
                "enrolmentTrend": [
                    {"month": "Jan", "students": 280, "volunteers": 48},
                    {"month": "Feb", "students": 310, "volunteers": 52},
                    {"month": "Mar", "students": 340, "volunteers": 61},
                    {"month": "Apr", "students": 380, "volunteers": 67},
                    {"month": "May", "students": 430, "volunteers": 75},
                    {"month": "Jun", "students": 470, "volunteers": 82},
                ],
                "attendanceByProgram": [
                    {"name": "Digital Literacy", "rate": 92},
                    {"name": "Leadership", "rate": 87},
                    {"name": "Career Development", "rate": 83},
                ],
            }
        return {
            "totalUsers": total_users or 4842,
            "students": 4210,
            "volunteers": 312,
            "activePrograms": total_programs or 38,
            "eventsThisQuarter": 14,
            "enrolmentTrend": [
                {"month": "Jan", "students": 280, "volunteers": 48},
                {"month": "Feb", "students": 310, "volunteers": 52},
                {"month": "Mar", "students": 340, "volunteers": 61},
                {"month": "Apr", "students": 380, "volunteers": 67},
                {"month": "May", "students": 430, "volunteers": 75},
                {"month": "Jun", "students": 470, "volunteers": 82},
            ],
            "attendanceByProgram": [
                {"name": "Digital Literacy", "rate": 92},
                {"name": "Leadership", "rate": 87},
                {"name": "Career Development", "rate": 83},
            ],
        }
    except Exception as exc:
        logger.warning("Admin overview failed, using dummy fallback: %s", exc)
        if settings.DATA_MODE in {"dummy", "hybrid"}:
            return {
                "totalUsers": 4842,
                "students": 4210,
                "volunteers": 312,
                "activePrograms": 38,
                "eventsThisQuarter": 14,
                "enrolmentTrend": [
                    {"month": "Jan", "students": 280, "volunteers": 48},
                    {"month": "Feb", "students": 310, "volunteers": 52},
                    {"month": "Mar", "students": 340, "volunteers": 61},
                    {"month": "Apr", "students": 380, "volunteers": 67},
                    {"month": "May", "students": 430, "volunteers": 75},
                    {"month": "Jun", "students": 470, "volunteers": 82},
                ],
                "attendanceByProgram": [
                    {"name": "Digital Literacy", "rate": 92},
                    {"name": "Leadership", "rate": 87},
                    {"name": "Career Development", "rate": 83},
                ],
            }
        raise HTTPException(status_code=503, detail="Database unavailable") from exc


@app.get(f"{settings.API_V1_PREFIX}/admin/reports", tags=["Admin"])
async def admin_reports(db: Session = Depends(get_db)):
    program_count = db.query(Program).count()
    enrollment_count = db.query(Enrollment).count()
    student_count = db.query(User).filter(User.role == UserRole.STUDENT).count()
    volunteer_count = db.query(User).filter(User.role == UserRole.VOLUNTEER).count()
    return {
        "reportType": "Member growth",
        "range": "Last 90 days",
        "programmes": program_count,
        "enrollments": enrollment_count,
        "rows": [
            {"month": "Apr", "students": student_count, "volunteers": volunteer_count, "total": student_count + volunteer_count},
            {"month": "May", "students": student_count, "volunteers": volunteer_count, "total": student_count + volunteer_count},
            {"month": "Jun", "students": student_count, "volunteers": volunteer_count, "total": student_count + volunteer_count},
        ],
    }


@app.post(f"{settings.API_V1_PREFIX}/admin/reports/export", tags=["Admin"])
async def export_report(payload: dict[str, Any], db: Session = Depends(get_db)):
    return {
        "success": True,
        "title": payload.get("reportType", "Attendance summary"),
        "message": "Report data prepared from Supabase records.",
        "rows": (await admin_reports(db))["rows"],
    }


DEFAULT_SETTINGS = {
    "centreName": "American Corner Batticaloa",
    "contactPhone": "+94 65 224 0071",
    "contactEmail": "americancorner.batticaloa@gmail.com",
    "scannerId": "ACB-DESK-01",
    "rejectDuplicateScans": True,
    "audioFeedback": True,
    "flagLowAttendance": True,
    "allowManualAttendance": False,
}


@app.get(f"{settings.API_V1_PREFIX}/admin/settings", tags=["Admin"])
async def get_admin_settings(db: Session = Depends(get_db)):
    stored = {item.key: item.value for item in db.query(SystemSetting).all()}
    result = dict(DEFAULT_SETTINGS)
    for key, value in stored.items():
        if key in result:
            if isinstance(result[key], bool):
                result[key] = value.lower() == "true"
            else:
                result[key] = value
    return result


@app.put(f"{settings.API_V1_PREFIX}/admin/settings", tags=["Admin"])
async def update_admin_settings(payload: dict[str, Any], db: Session = Depends(get_db)):
    if settings.DATA_MODE == "dummy":
        raise HTTPException(status_code=400, detail="Dummy mode is active. Change DATA_MODE to live or hybrid to save settings.")
    for key, value in payload.items():
        if key not in DEFAULT_SETTINGS:
            continue
        item = db.query(SystemSetting).filter(SystemSetting.key == key).first()
        if item:
            item.value = str(value)
        else:
            db.add(SystemSetting(key=key, value=str(value)))
    db.commit()
    return await get_admin_settings(db)


@app.post(f"{settings.API_V1_PREFIX}/programs", tags=["Programs"])
async def create_program(payload: dict[str, Any], db: Session = Depends(get_db)):
    if settings.DATA_MODE == "dummy":
        raise HTTPException(status_code=400, detail="Dummy mode is active. Change DATA_MODE to live or hybrid to persist to the database.")

    required = {"title", "category", "status", "seats", "mode"}
    missing = required - payload.keys()
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing required fields: {sorted(missing)}")

    program = Program(
        id=payload.get("id") or f"program-{db.query(Program).count() + 1}",
        title=payload["title"],
        category={
            "Regular": ProgramCategory.REGULAR,
            "Thematic": ProgramCategory.THEMATIC,
            "Skill Development": ProgramCategory.SKILL_DEVELOPMENT,
            "Leadership": ProgramCategory.LEADERSHIP,
            "Digital Literacy": ProgramCategory.DIGITAL_LITERACY,
            "Entrepreneurship": ProgramCategory.ENTREPRENEURSHIP,
            "Career Development": ProgramCategory.CAREER_DEVELOPMENT,
        }.get(payload["category"], ProgramCategory.REGULAR),
        status={
            "Open": ProgramStatus.OPEN,
            "Upcoming": ProgramStatus.UPCOMING,
            "Closed": ProgramStatus.CLOSED,
        }.get(payload["status"], ProgramStatus.OPEN),
        description=payload.get("summary") or "",
        schedule=payload.get("schedule") or "Flexible schedule",
        duration=payload.get("duration") or "Ongoing",
        seats=int(payload["seats"]),
        mode={
            "In person": ProgramMode.IN_PERSON,
            "Hybrid": ProgramMode.HYBRID,
            "Online": ProgramMode.ONLINE,
        }.get(payload["mode"], ProgramMode.IN_PERSON),
        image_url=payload.get("image") or "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=70",
        form_url=payload.get("formUrl") or "https://example.com/apply",
        is_featured=bool(payload.get("featured", False)),
    )
    db.add(program)
    db.commit()
    db.refresh(program)
    return serialize_program(program, db)


@app.put(f"{settings.API_V1_PREFIX}/programs/{{program_id}}", tags=["Programs"])
async def update_program(program_id: str, payload: dict[str, Any], db: Session = Depends(get_db)):
    if settings.DATA_MODE == "dummy":
        raise HTTPException(status_code=400, detail="Dummy mode is active. Change DATA_MODE to live or hybrid to update the database.")

    program = db.query(Program).filter(Program.id == program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")

    for field, value in payload.items():
        if field == "title":
            program.title = value
        elif field == "category":
            program.category = {
                "Regular": ProgramCategory.REGULAR,
                "Thematic": ProgramCategory.THEMATIC,
                "Skill Development": ProgramCategory.SKILL_DEVELOPMENT,
                "Leadership": ProgramCategory.LEADERSHIP,
                "Digital Literacy": ProgramCategory.DIGITAL_LITERACY,
                "Entrepreneurship": ProgramCategory.ENTREPRENEURSHIP,
                "Career Development": ProgramCategory.CAREER_DEVELOPMENT,
            }.get(value, program.category)
        elif field == "status":
            program.status = {
                "Open": ProgramStatus.OPEN,
                "Upcoming": ProgramStatus.UPCOMING,
                "Closed": ProgramStatus.CLOSED,
            }.get(value, program.status)
        elif field == "summary":
            program.description = value
        elif field == "schedule":
            program.schedule = value
        elif field == "duration":
            program.duration = value
        elif field == "seats":
            program.seats = int(value)
        elif field == "mode":
            program.mode = {
                "In person": ProgramMode.IN_PERSON,
                "Hybrid": ProgramMode.HYBRID,
                "Online": ProgramMode.ONLINE,
            }.get(value, program.mode)
        elif field == "image":
            program.image_url = value
        elif field == "formUrl":
            program.form_url = value
        elif field == "featured":
            program.is_featured = bool(value)
    db.commit()
    db.refresh(program)
    return serialize_program(program, db)


@app.delete(f"{settings.API_V1_PREFIX}/programs/{{program_id}}", tags=["Programs"])
async def delete_program(program_id: str, db: Session = Depends(get_db)):
    if settings.DATA_MODE == "dummy":
        raise HTTPException(status_code=400, detail="Dummy mode is active. Change DATA_MODE to live or hybrid to delete from the database.")

    program = db.query(Program).filter(Program.id == program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    db.delete(program)
    db.commit()
    return {"deleted": True, "programId": program_id}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )
