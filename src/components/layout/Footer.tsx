import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { contact, operationalHours } from '../../data/site';

const columns = [
{
  title: 'Explore',
  links: [
  { label: 'About the Corner', to: '/about' },
  { label: 'Programs', to: '/programs' },
  { label: 'Apply now', to: '/apply' },
  { label: 'Gallery', to: '/gallery' }]

},
{
  title: 'Members',
  links: [
  { label: 'Member sign in', to: '/login' },
  { label: 'Student dashboard', to: '/dashboard/student' },
  { label: 'Volunteer dashboard', to: '/dashboard/volunteer' },
  { label: 'Attendance scanner', to: '/scanner' }]

}];


export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-page px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary font-display text-sm font-extrabold text-white">
                AC
              </span>
              <span className="font-display text-base font-bold text-ink">
                American Corner Batticaloa
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              A public resource centre run in partnership with the U.S. Embassy Colombo and Eastern
              University, Sri Lanka — offering free access to learning, technology and community
              programming for the Eastern Province.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href={contact.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="grid h-10 w-10 place-items-center rounded-xl border border-line text-muted transition-colors duration-150 ease-out hover:text-primary">
                
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href={contact.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-xl border border-line text-muted transition-colors duration-150 ease-out hover:text-secondary">
                
                <InstagramIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {columns.map((col) =>
          <div key={col.title}>
              <h3 className="font-display text-sm font-bold text-ink">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) =>
              <li key={link.label}>
                    <Link
                  to={link.to}
                  className="text-sm text-muted transition-colors duration-150 ease-out hover:text-primary">
                  
                      {link.label}
                    </Link>
                  </li>
              )}
              </ul>
            </div>
          )}

          <div>
            <h3 className="font-display text-sm font-bold text-ink">Visit us</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex gap-2.5">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{contact.address}</span>
              </li>
              <li className="flex gap-2.5">
                <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
              </li>
              <li className="flex gap-2.5">
                <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href={`mailto:${contact.email}`} className="break-all">
                  {contact.email}
                </a>
              </li>
            </ul>
            <dl className="mt-5 space-y-1.5 border-t border-line pt-4 text-xs text-muted">
              {operationalHours.map((row) =>
              <div key={row.day} className="flex justify-between gap-3">
                  <dt>{row.day}</dt>
                  <dd className="font-medium text-ink">{row.hours}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} American Corner Batticaloa. All rights reserved.</p>
          <p>
            Views expressed on this site do not necessarily reflect those of the U.S. Government.
          </p>
        </div>
      </div>
    </footer>);

}