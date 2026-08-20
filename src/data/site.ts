import { Announcement, Branch, EventItem, Testimonial } from '../types';

export const contact = {
  address: 'Eastern University Library Complex, Vantharumoolai, Batticaloa 30350, Sri Lanka',
  phone: '+94 65 224 0071',
  altPhone: '+94 77 412 8890',
  email: 'americancorner.batticaloa@gmail.com',
  facebook: 'https://www.facebook.com/share/1JeR5TsH4V/',
  instagram: 'https://www.instagram.com/americancornerbatti',
  mapEmbed:
  'https://www.google.com/maps?q=Eastern+University+Sri+Lanka+Vantharumoolai+Batticaloa&output=embed'
};

export const operationalHours = [
{ day: 'Monday – Thursday', hours: '9:00 AM – 5:00 PM' },
{ day: 'Friday', hours: '9:00 AM – 4:30 PM' },
{ day: 'Saturday', hours: '9:30 AM – 1:00 PM' },
{ day: 'Sunday & Public Holidays', hours: 'Closed' }];


export const events: EventItem[] = [
{
  id: 'ev-1',
  title: 'Tech Talk: Careers in Artificial Intelligence',
  date: '2026-08-22',
  time: '4:00 PM – 6:00 PM',
  location: 'American Corner Hall',
  category: 'Tech Talk',
  seatsLeft: 24
},
{
  id: 'ev-2',
  title: 'English Debate Championship — District Round',
  date: '2026-08-29',
  time: '9:00 AM – 3:00 PM',
  location: 'EUSL Auditorium',
  category: 'Competition',
  seatsLeft: 8
},
{
  id: 'ev-3',
  title: 'Alumni Networking Evening',
  date: '2026-09-05',
  time: '5:30 PM – 8:00 PM',
  location: 'American Corner Lounge',
  category: 'Networking',
  seatsLeft: 40
},
{
  id: 'ev-4',
  title: 'Women in STEM Panel Discussion',
  date: '2026-09-12',
  time: '3:00 PM – 5:00 PM',
  location: 'American Corner Hall',
  category: 'Panel',
  seatsLeft: 15
}];


export const announcements: Announcement[] = [
{
  id: 'an-1',
  title: 'Applications open for Digital Literacy Foundations — Cohort 12',
  body: 'Seats are limited to 40 learners. Applications close once the cohort is filled, and shortlisted applicants receive an SMS confirmation.',
  date: '2026-08-11',
  tag: 'Deadline'
},
{
  id: 'an-2',
  title: 'Attendance now recorded through digital QR passes',
  body: 'All students and volunteers should present the QR pass from their dashboard at the front desk scanner before each session.',
  date: '2026-08-06',
  tag: 'Update'
},
{
  id: 'an-3',
  title: 'Youth Leadership Lab Cohort 9 results published',
  body: 'Selected participants can view their placement and orientation date inside their student dashboard notifications.',
  date: '2026-07-30',
  tag: 'Result'
},
{
  id: 'an-4',
  title: 'Library closed on 19 August for annual stock verification',
  body: 'Study hours resume the following morning at 9:00 AM. Online reference support remains available by email.',
  date: '2026-07-24',
  tag: 'Notice'
}];


export const testimonials: Testimonial[] = [
{
  id: 't-1',
  quote:
  'I joined the Spoken English Circle barely able to introduce myself. Eight months later I presented my research at a national symposium — the facilitators never let anyone fall behind.',
  name: 'Sathya Kumaran',
  role: 'Undergraduate, Eastern University',
  avatar: 'https://i.pravatar.cc/160?img=47'
},
{
  id: 't-2',
  quote:
  'The Entrepreneurship Bootcamp gave my tailoring business a real plan. I now employ four women from my village and keep proper books for the first time.',
  name: 'Fathima Nusrath',
  role: 'Founder, Nusra Textiles',
  avatar: 'https://i.pravatar.cc/160?img=32'
},
{
  id: 't-3',
  quote:
  'As a volunteer I have logged over 200 hours here. The dashboard makes scheduling simple, so I can focus on the students instead of paperwork.',
  name: 'Ravindran Jeyakumar',
  role: 'Lead Volunteer',
  avatar: 'https://i.pravatar.cc/160?img=12'
}];


export const partners = [
'U.S. Embassy Colombo',
'Eastern University, Sri Lanka',
'Batticaloa District Secretariat',
'Sri Lanka Youth Council',
'IREX',
'EdUSA Sri Lanka'];


export const branches: Branch[] = [
{
  id: 'br-1',
  city: 'Batticaloa',
  venue: 'Eastern University Library Complex',
  hours: 'Mon–Sat',
  phone: '+94 65 224 0071'
},
{
  id: 'br-2',
  city: 'Colombo',
  venue: 'U.S. Embassy Public Affairs Section',
  hours: 'Mon–Fri',
  phone: '+94 11 249 8500'
},
{
  id: 'br-3',
  city: 'Kandy',
  venue: 'Kandy Public Library',
  hours: 'Mon–Fri',
  phone: '+94 81 222 3456'
},
{
  id: 'br-4',
  city: 'Jaffna',
  venue: 'Jaffna Public Library',
  hours: 'Mon–Sat',
  phone: '+94 21 222 2374'
},
{
  id: 'br-5',
  city: 'Galle',
  venue: 'Southern Provincial Library',
  hours: 'Tue–Sat',
  phone: '+94 91 223 4567'
},
{
  id: 'br-6',
  city: 'Kurunegala',
  venue: 'Wayamba Cultural Centre',
  hours: 'Mon–Fri',
  phone: '+94 37 222 8899'
}];


export const history = [
{
  year: '2012',
  title: 'American Corner Batticaloa opens',
  body: 'Established in partnership with the U.S. Embassy Colombo and Eastern University, Sri Lanka with a reference collection of 1,200 titles.'
},
{
  year: '2016',
  title: 'Digital lab commissioned',
  body: 'A 20-station computer lab and high-speed connectivity brought digital literacy programming to school leavers across the district.'
},
{
  year: '2019',
  title: 'Youth leadership network formed',
  body: 'Alumni from early cohorts returned as volunteer facilitators, creating the mentorship model still used across every programme today.'
},
{
  year: '2023',
  title: 'Regional programming hub',
  body: 'Thematic series on climate resilience, entrepreneurship and civic participation extended to Ampara and Trincomalee districts.'
},
{
  year: '2026',
  title: 'Digital member platform',
  body: 'QR-based attendance, learner dashboards and volunteer scheduling replaced paper registers for more than 4,800 active members.'
}];