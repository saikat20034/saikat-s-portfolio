import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

function Counter({ value, decimals = 0, suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 24, stiffness: 60 });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (v) => {
      setDisplay(decimals ? v.toFixed(decimals) : Math.round(v).toString());
    });
    return unsubscribe;
  }, [springValue, decimals]);

  return (
    <motion.span
      ref={ref}
      initial={{ scale: 0.8 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="font-display font-semibold text-4xl sm:text-5xl text-paper block"
    >
      {display}
      <span className="text-brass-500">{suffix}</span>
    </motion.span>
  );
}

export default function Stats({ items }) {
  return (
    <section className="max-w-6xl mx-auto px-5 sm:px-8 -mt-10 sm:-mt-14 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-ink-700 border border-ink-700 bg-ink-800/80 backdrop-blur shadow-2xl overflow-hidden"
      >
        {items.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -4, backgroundColor: 'rgba(26, 37, 64, 0.95)' }}
            className="p-6 sm:p-8 text-center transition-colors cursor-default"
          >
            <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
              {s.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
