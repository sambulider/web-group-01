import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const REEDS = Array.from({ length: 31 }, (_, index) => index);

export function ReededGlassHero() {
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const targetSpeed = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 32, damping: 30, mass: 1.3 });
  const y = useSpring(targetY, { stiffness: 32, damping: 30, mass: 1.3 });
  const speed = useSpring(targetSpeed, { stiffness: 22, damping: 30, mass: 1.4 });
  const rotateY = useTransform(x, [-1, 1], [-1.6, 1.6]);
  const rotateX = useTransform(y, [-1, 1], [1.2, -1.2]);
  const direction = useTransform(x, [-1, 1], [-0.65, 0.65]);
  const duration = useTransform(speed, [0, 0.45], [11, 5.5]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const lastPointer = useRef<{ x: number; time: number } | null>(null);

  const updatePointer = (clientX: number, clientY: number) => {
    const bounds = sectionRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const normalizedX = (clientX - bounds.left) / bounds.width * 2 - 1;
    const normalizedY = (clientY - bounds.top) / bounds.height * 2 - 1;
    const now = performance.now();
    const previous = lastPointer.current;
    const pointerVelocity = previous ? Math.abs(clientX - previous.x) / Math.max(now - previous.time, 16) * 16 : 0;

    targetX.set(normalizedX);
    targetY.set(normalizedY);
    targetSpeed.set(Math.min(0.45, Math.abs(normalizedX) * 0.08 + pointerVelocity * 0.08));
    lastPointer.current = { x: clientX, time: now };
  };

  const resetPointer = () => {
    targetX.set(0);
    targetY.set(0);
    targetSpeed.set(0);
    lastPointer.current = null;
  };

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const bounds = sectionRef.current?.getBoundingClientRect();
      if (!bounds) return;
      const inside = event.clientX >= bounds.left && event.clientX <= bounds.right &&
        event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      if (inside) {
        updatePointer(event.clientX, event.clientY);
      } else {
        resetPointer();
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <div
      ref={sectionRef}
      className="reeded-glass pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
      onPointerMove={(event) => updatePointer(event.clientX, event.clientY)}
      onPointerLeave={resetPointer}
    >
      <motion.div
        className="reeded-glass__scene absolute inset-[-10%]"
        style={{
          x: useTransform(x, (value) => value * 8),
          y: useTransform(y, (value) => value * 6),
          rotateX,
          rotateY,
          '--reed-direction': direction,
          '--reed-duration': duration
        } as React.CSSProperties}
      >
        <div className="reeded-glass__halo absolute left-1/2 top-1/2" />
        <div className="reeded-glass__core absolute inset-0">
          {REEDS.map((reed) => (
            <span key={reed} className="reeded-glass__reed absolute" style={{ '--reed-index': reed } as React.CSSProperties} />
          ))}
        </div>
      </motion.div>
      <div className="reeded-glass__shade pointer-events-none absolute inset-0" />
    </div>
  );
}