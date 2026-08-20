import { GalleryItem } from '../types';

export const galleryCategories = ['All', 'Programs', 'Events', 'Community', 'Workshops'] as const;

export const galleryItems: GalleryItem[] = [
{
  id: 'g-1',
  type: 'photo',
  title: 'Digital Literacy Cohort 11 graduation',
  category: 'Programs',
  date: '2026-07-18',
  src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=70'
},
{
  id: 'g-2',
  type: 'photo',
  title: 'Youth Leadership Lab community project day',
  category: 'Programs',
  date: '2026-07-02',
  src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=70'
},
{
  id: 'g-3',
  type: 'photo',
  title: 'English Debate Championship finals',
  category: 'Events',
  date: '2026-06-21',
  src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1400&q=70'
},
{
  id: 'g-4',
  type: 'video',
  title: 'A year at American Corner Batticaloa',
  category: 'Community',
  date: '2026-06-10',
  src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  poster:
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=70'
},
{
  id: 'g-5',
  type: 'photo',
  title: 'Design lab portfolio review',
  category: 'Workshops',
  date: '2026-05-28',
  src: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1400&q=70'
},
{
  id: 'g-6',
  type: 'photo',
  title: 'Open library study hours',
  category: 'Community',
  date: '2026-05-14',
  src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1400&q=70'
},
{
  id: 'g-7',
  type: 'photo',
  title: 'Entrepreneurship demo day pitches',
  category: 'Events',
  date: '2026-04-30',
  src: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=1400&q=70'
},
{
  id: 'g-8',
  type: 'video',
  title: 'Volunteer voices: why we serve',
  category: 'Community',
  date: '2026-04-12',
  src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  poster:
  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1400&q=70'
},
{
  id: 'g-9',
  type: 'photo',
  title: 'Women in STEM panel discussion',
  category: 'Events',
  date: '2026-03-27',
  src: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1400&q=70'
},
{
  id: 'g-10',
  type: 'photo',
  title: 'LinkedIn profile clinic',
  category: 'Workshops',
  date: '2026-03-08',
  src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=70'
},
{
  id: 'g-11',
  type: 'photo',
  title: 'Climate resilience field visit, Kallady',
  category: 'Programs',
  date: '2026-02-19',
  src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1400&q=70'
},
{
  id: 'g-12',
  type: 'photo',
  title: 'Reading corner for young learners',
  category: 'Community',
  date: '2026-01-25',
  src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=70'
}];