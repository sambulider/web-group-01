export type ProgramStatus = 'Open' | 'Closed' | 'Upcoming';

export type ProgramCategory =
'Regular' |
'Thematic' |
'Skill Development' |
'Leadership' |
'Digital Literacy' |
'Entrepreneurship' |
'Career Development';

export interface Program {
  id: string;
  title: string;
  category: ProgramCategory;
  status: ProgramStatus;
  summary: string;
  schedule: string;
  duration: string;
  seats: number;
  seatsTaken: number;
  mode: 'In person' | 'Hybrid' | 'Online';
  facilitator: string;
  image: string;
  formUrl: string;
  featured?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  seatsLeft: number;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  tag: 'Notice' | 'Deadline' | 'Result' | 'Update';
}

export interface GalleryItem {
  id: string;
  type: 'photo' | 'video';
  title: string;
  category: string;
  date: string;
  src: string;
  poster?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Branch {
  id: string;
  city: string;
  venue: string;
  hours: string;
  phone: string;
}

export type Role = 'student' | 'volunteer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  memberId: string;
  avatar: string;
  joined: string;
  phone: string;
  institution?: string;
}

export interface Enrollment {
  programId: string;
  title: string;
  progress: number;
  attendance: number;
  sessionsAttended: number;
  sessionsTotal: number;
  nextSession: string;
}

export interface Assignment {
  id: string;
  activity: string;
  date: string;
  time: string;
  role: string;
  hours: number;
  status: 'Confirmed' | 'Pending' | 'Completed';
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  name: string;
  program: string;
  time: string;
  result: 'success' | 'not-enrolled' | 'duplicate';
}