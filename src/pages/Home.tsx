import React from 'react';
import { Hero } from '../components/home/Hero';
import { Welcome } from '../components/home/Welcome';
import { FeaturedPrograms } from '../components/home/FeaturedPrograms';
import { EventsAndNews } from '../components/home/EventsAndNews';
import { Stats } from '../components/home/Stats';
import { Voices } from '../components/home/Voices';
import { CallToAction } from '../components/home/CallToAction';

export function Home() {
  return (
    <>
      <Hero />
      <Welcome />
      <FeaturedPrograms />
      <EventsAndNews />
      <Stats />
      <Voices />
      <CallToAction />
    </>);

}