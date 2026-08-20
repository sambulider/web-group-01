import React from 'react';
import { Link } from 'react-router-dom';
import { btnPrimary } from '../components/ui/Primitives';

export function NotFound() {
  return (
    <section className="mx-auto flex max-w-page flex-col items-center justify-center px-4 py-28 text-center sm:px-6 lg:px-8">
      <p className="font-display text-sm font-bold text-primary">404</p>
      <h1 className="mt-3 max-w-xl font-display text-4xl font-extrabold tracking-tight text-ink">
        We could not find that page.
      </h1>
      <p className="mt-4 max-w-md text-base text-muted">
        The link may be out of date. Try the programmes list, or ask the assistant for help finding
        what you need.
      </p>
      <Link to="/" className={`${btnPrimary} mt-8 h-12 px-6 text-base`}>
        Back to home
      </Link>
    </section>);

}