import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article';
}

const EASE = [0.23, 1, 0.32, 1] as const;

export function Reveal({ children, delay = 0, y = 18, className, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={reduce ? undefined : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.28, ease: EASE, delay }}>
      
      {children}
    </MotionTag>);

}

export function StaggerList({
  children,
  className,
  step = 0.05




}: {children: React.ReactNode[];className?: string;step?: number;}) {
  return (
    <div className={className}>
      {children.map((child, i) =>
      <Reveal key={i} delay={Math.min(i * step, 0.3)}>
          {child}
        </Reveal>
      )}
    </div>);

}