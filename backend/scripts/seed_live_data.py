from app.database import Base, engine
from app.models import (
    Announcement,
    AnnouncementTag,
    GalleryItem,
    GalleryItemType,
    Program,
    ProgramCategory,
    ProgramMode,
    ProgramStatus,
)
from sqlalchemy.orm import Session


Base.metadata.create_all(bind=engine)

with Session(bind=engine) as db:
    if db.query(Program).count() == 0:
        db.add_all([
            Program(
                id='prg-digital',
                title='Digital Literacy Foundations',
                category=ProgramCategory.DIGITAL_LITERACY,
                status=ProgramStatus.OPEN,
                description='Practical digital skills for first-time learners.',
                schedule='Mon & Wed · 4:00 PM',
                duration='6 weeks',
                seats=40,
                mode=ProgramMode.IN_PERSON,
                image_url='https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=70',
                form_url='https://example.com/forms/digital',
                is_featured=True,
            ),
            Program(
                id='prg-leadership',
                title='Youth Leadership Lab',
                category=ProgramCategory.LEADERSHIP,
                status=ProgramStatus.OPEN,
                description='Leadership development with community projects.',
                schedule='Saturdays · 9:30 AM',
                duration='8 weeks',
                seats=30,
                mode=ProgramMode.IN_PERSON,
                image_url='https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=70',
                form_url='https://example.com/forms/leadership',
                is_featured=True,
            ),
        ])

    if db.query(Announcement).count() == 0:
        db.add_all([
            Announcement(
                id='ann-001',
                title='Applications open for Digital Literacy Foundations',
                body='Applications are now open for the next digital literacy cohort. Priority is given to first-time users and youth volunteers.',
                tag=AnnouncementTag.DEADLINE,
                is_published=True,
            ),
            Announcement(
                id='ann-002',
                title='Attendance now recorded through QR passes',
                body='Members should bring their QR pass for attendance tracking at the front desk scanner.',
                tag=AnnouncementTag.UPDATE,
                is_published=True,
            ),
        ])

    if db.query(GalleryItem).count() == 0:
        db.add_all([
            GalleryItem(
                id='gal-001',
                title='Digital Literacy Cohort 11 graduation',
                description='Graduation ceremony celebration',
                item_type=GalleryItemType.PHOTO,
                category='Programs',
                image_url='https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=70',
                is_published=True,
            ),
            GalleryItem(
                id='gal-002',
                title='Volunteer voices: why we serve',
                description='Volunteer sharing stories',
                item_type=GalleryItemType.VIDEO,
                category='Community',
                image_url='https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1400&q=70',
                poster_url='https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1400&q=70',
                is_published=True,
            ),
        ])

    db.commit()
    print('PROGRAMS', db.query(Program).count())
    print('ANNOUNCEMENTS', db.query(Announcement).count())
    print('GALLERY', db.query(GalleryItem).count())
