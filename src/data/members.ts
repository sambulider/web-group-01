import {
  Assignment,
  AttendanceRecord,
  Enrollment,
  Notification,
  User } from
'../types';

export const demoAccounts: Record<string, User> = {
  student: {
    id: 'u-1024',
    name: 'Sanjana Mahendran',
    email: 'student@americancornerbatti.lk',
    role: 'student',
    memberId: 'ACB-STU-1024',
    avatar: 'https://i.pravatar.cc/200?img=45',
    joined: '2025-11-04',
    phone: '+94 76 331 2210',
    institution: 'Eastern University, Sri Lanka'
  },
  volunteer: {
    id: 'u-2087',
    name: 'Ravindran Jeyakumar',
    email: 'volunteer@americancornerbatti.lk',
    role: 'volunteer',
    memberId: 'ACB-VOL-2087',
    avatar: 'https://i.pravatar.cc/200?img=12',
    joined: '2024-06-17',
    phone: '+94 77 908 4415',
    institution: 'Batticaloa Youth Network'
  },
  admin: {
    id: 'u-0001',
    name: 'Nirmala Rajendran',
    email: 'admin@americancornerbatti.lk',
    role: 'admin',
    memberId: 'ACB-ADM-0001',
    avatar: 'https://i.pravatar.cc/200?img=26',
    joined: '2019-02-01',
    phone: '+94 65 224 0071',
    institution: 'American Corner Batticaloa'
  }
};

export const enrollments: Enrollment[] = [
{
  programId: 'dl-101',
  title: 'Digital Literacy Foundations',
  progress: 72,
  attendance: 92,
  sessionsAttended: 11,
  sessionsTotal: 12,
  nextSession: 'Mon 17 Aug · 4:00 PM'
},
{
  programId: 'sk-402',
  title: 'Spoken English Circle',
  progress: 45,
  attendance: 78,
  sessionsAttended: 14,
  sessionsTotal: 18,
  nextSession: 'Wed 19 Aug · 3:00 PM'
},
{
  programId: 'li-310',
  title: 'LinkedIn Profile Management',
  progress: 100,
  attendance: 100,
  sessionsAttended: 2,
  sessionsTotal: 2,
  nextSession: 'Completed'
}];


export const assignments: Assignment[] = [
{
  id: 'as-1',
  activity: 'Digital Literacy Foundations — Session 12',
  date: '2026-08-17',
  time: '4:00 PM – 6:00 PM',
  role: 'Lab assistant',
  hours: 2,
  status: 'Confirmed'
},
{
  id: 'as-2',
  activity: 'Tech Talk: Careers in AI',
  date: '2026-08-22',
  time: '3:30 PM – 6:30 PM',
  role: 'Registration desk',
  hours: 3,
  status: 'Confirmed'
},
{
  id: 'as-3',
  activity: 'English Debate Championship',
  date: '2026-08-29',
  time: '8:30 AM – 3:30 PM',
  role: 'Floor coordinator',
  hours: 7,
  status: 'Pending'
},
{
  id: 'as-4',
  activity: 'Open Library & Study Hours',
  date: '2026-08-09',
  time: '9:00 AM – 1:00 PM',
  role: 'Reference support',
  hours: 4,
  status: 'Completed'
}];


export const volunteerHoursByMonth = [
{ month: 'Mar', hours: 14 },
{ month: 'Apr', hours: 21 },
{ month: 'May', hours: 18 },
{ month: 'Jun', hours: 26 },
{ month: 'Jul', hours: 31 },
{ month: 'Aug', hours: 19 }];


export const notifications: Notification[] = [
{
  id: 'n-1',
  title: 'Session moved to Lab 2',
  body: 'Digital Literacy Foundations Session 12 will be held in Lab 2 due to maintenance.',
  time: '2 hours ago',
  unread: true
},
{
  id: 'n-2',
  title: 'Attendance recorded',
  body: 'Your QR pass was scanned for Spoken English Circle on 12 August at 3:04 PM.',
  time: 'Yesterday',
  unread: true
},
{
  id: 'n-3',
  title: 'Certificate ready',
  body: 'Your LinkedIn Profile Management certificate is available for download at the front desk.',
  time: '4 days ago',
  unread: false
},
{
  id: 'n-4',
  title: 'New programme announced',
  body: 'Entrepreneurship Bootcamp applications open on 25 August. Members get priority review.',
  time: '1 week ago',
  unread: false
}];


export const attendanceFeed: AttendanceRecord[] = [
{
  id: 'ar-1',
  memberId: 'ACB-STU-1024',
  name: 'Sanjana Mahendran',
  program: 'Digital Literacy Foundations',
  time: '4:02 PM',
  result: 'success'
},
{
  id: 'ar-2',
  memberId: 'ACB-STU-1188',
  name: 'Thivyan Selvarajah',
  program: 'Digital Literacy Foundations',
  time: '4:03 PM',
  result: 'success'
},
{
  id: 'ar-3',
  memberId: 'ACB-STU-0912',
  name: 'Nuska Rifhana',
  program: 'Digital Literacy Foundations',
  time: '4:05 PM',
  result: 'duplicate'
},
{
  id: 'ar-4',
  memberId: 'ACB-STU-1450',
  name: 'Kokila Vasanthan',
  program: '—',
  time: '4:07 PM',
  result: 'not-enrolled'
}];


export const enrolmentTrend = [
{ month: 'Feb', students: 210, volunteers: 26 },
{ month: 'Mar', students: 268, volunteers: 31 },
{ month: 'Apr', students: 305, volunteers: 34 },
{ month: 'May', students: 352, volunteers: 38 },
{ month: 'Jun', students: 418, volunteers: 41 },
{ month: 'Jul', students: 476, volunteers: 47 },
{ month: 'Aug', students: 512, volunteers: 52 }];


export const attendanceByProgram = [
{ name: 'Digital Literacy', rate: 92 },
{ name: 'Leadership', rate: 87 },
{ name: 'Spoken English', rate: 78 },
{ name: 'Career Dev.', rate: 84 },
{ name: 'Entrepreneurship', rate: 71 }];


export const memberSplit = [
{ name: 'Students', value: 4210 },
{ name: 'Volunteers', value: 312 },
{ name: 'Facilitators', value: 48 },
{ name: 'Partners', value: 26 }];


export const adminMembers = [
{
  id: 'ACB-STU-1024',
  name: 'Sanjana Mahendran',
  role: 'Student',
  program: 'Digital Literacy Foundations',
  attendance: 92,
  status: 'Active'
},
{
  id: 'ACB-VOL-2087',
  name: 'Ravindran Jeyakumar',
  role: 'Volunteer',
  program: 'Multiple assignments',
  attendance: 96,
  status: 'Active'
},
{
  id: 'ACB-STU-1188',
  name: 'Thivyan Selvarajah',
  role: 'Student',
  program: 'Youth Leadership Lab',
  attendance: 88,
  status: 'Active'
},
{
  id: 'ACB-STU-0912',
  name: 'Nuska Rifhana',
  role: 'Student',
  program: 'Spoken English Circle',
  attendance: 64,
  status: 'At risk'
},
{
  id: 'ACB-VOL-2201',
  name: 'Iromi Fernando',
  role: 'Volunteer',
  program: 'Graphic Design Lab',
  attendance: 91,
  status: 'Active'
},
{
  id: 'ACB-STU-1450',
  name: 'Kokila Vasanthan',
  role: 'Student',
  program: 'Awaiting placement',
  attendance: 0,
  status: 'Pending'
}];