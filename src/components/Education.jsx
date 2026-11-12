import { motion } from 'framer-motion';
import { education } from '../data/content';
import Reveal, { SectionHeading } from './Reveal';

export default function Education() {
  return (
    <section id="education" className="bg-ink-800/60 border-y border-ink-700">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
        <Reveal>
          <SectionHeading eyebrow="// 03 — Academic Record" title="Education" accent="Timeline" />
        </Reveal>

        <div className="relative">
          {/* Animated vertical timeline line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="hidden sm:block absolute left-[3.25rem] top-2 bottom-2 w-px bg-gradient-to-b from-brass-500 via-ink-600 to-transparent origin-top"
          />

          <div className="space-y-8">
            {education.map((e, i) => (
              <motion.div
                key={e.id || e.level + i}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.12, duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
                className="grid sm:grid-cols-[6.5rem_1fr] gap-4 sm:gap-8 group"
              >
                <div className="flex sm:flex-col sm:items-center gap-2 sm:gap-1">
                  <span className="font-mono text-xs text-brass-500 font-semibold">
                    EDU.{String(i + 1).padStart(2, '0')}
                  </span>
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: [0, 1.4, 1] }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.12, duration: 0.4 }}
                    className="hidden sm:block w-3 h-3 rounded-full bg-brass-500 ring-4 ring-ink-800 shadow-md group-hover:scale-125 transition-transform"
                  />
                  <span className="font-mono text-xs text-muted">{e.year}</span>
                </div>

                <motion.div
                  whileHover={{ x: 8, borderColor: 'rgba(201, 154, 74, 0.7)' }}
                  transition={{ duration: 0.25 }}
                  className="border border-ink-700 bg-ink-900/60 p-6 shadow-md transition-colors"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                    <h3 className="font-display font-semibold text-xl text-paper group-hover:text-brass-400 transition-colors">
                      {e.level}
                    </h3>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-signal/15 text-signal border border-signal/30">
                      {e.result}
                    </span>
                  </div>
                  <p className="text-muted text-sm font-medium">{e.institution}</p>
                  <p className="text-muted/80 text-sm mt-0.5">{e.program}</p>
                  {e.note && (
                    <p className="mt-3 text-xs font-mono text-brass-400">{e.note}</p>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
