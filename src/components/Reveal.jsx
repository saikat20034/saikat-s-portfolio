import { motion } from 'framer-motion';

export default function Reveal({
  children,
  delay = 0,
  duration = 0.55,
  direction = 'up',
  className = '',
}) {
  const directionOffset = {
    up: { y: 28, x: 0 },
    down: { y: -28, x: 0 },
    left: { x: 32, y: 0 },
    right: { x: -32, y: 0 },
    none: { x: 0, y: 0 },
  }[direction] || { y: 28, x: 0 };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...directionOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, accent }) {
  return (
    <div className="mb-12">
      <motion.p
        className="section-eyebrow mb-3 flex items-center gap-2"
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <span className="inline-block w-4 h-px bg-brass-500" />
        {eyebrow}
      </motion.p>
      
      <motion.h2
        className="font-display font-semibold text-3xl sm:text-4xl text-paper relative inline-block"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
      >
        {title} {accent && <span className="text-brass-500">{accent}</span>}
        <motion.span
          className="absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-brass-500 via-brass-400 to-transparent"
          initial={{ width: 0 }}
          whileInView={{ width: '60%' }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeInOut' }}
        />
      </motion.h2>
    </div>
  );
}
