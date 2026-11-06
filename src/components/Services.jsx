import { motion } from 'framer-motion';
import { HiOutlineCode, HiOutlineDatabase, HiOutlineLightningBolt, HiOutlineDocumentText } from 'react-icons/hi';
import { services } from '../data/content';
import Reveal, { SectionHeading } from './Reveal';

const icons = [HiOutlineCode, HiOutlineDatabase, HiOutlineLightningBolt, HiOutlineDocumentText];

export default function Services() {
  return (
    <section id="services" className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
      <Reveal>
        <SectionHeading eyebrow="// 02 — Capabilities" title="What I" accent="Do" />
      </Reveal>

      <div className="grid sm:grid-cols-2 gap-6">
        {services.map((s, i) => {
          const Icon = icons[i % icons.length];
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="group border border-ink-700 bg-ink-800/40 p-7 h-full hover:border-brass-500/70 transition-colors shadow-lg cursor-default relative overflow-hidden"
            >
              {/* Subtle accent hover gradient glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-brass-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="w-12 h-12 grid place-items-center border border-ink-600 text-brass-500 mb-5 group-hover:border-brass-500 transition-colors bg-ink-900/50"
              >
                <Icon className="text-2xl" />
              </motion.div>
              
              <h3 className="font-display font-semibold text-lg text-paper mb-2 group-hover:text-brass-400 transition-colors">
                {s.title}
              </h3>
              
              <p className="text-muted text-sm leading-relaxed mb-4">{s.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <motion.span
                    key={t}
                    whileHover={{ scale: 1.08, y: -2 }}
                    className="text-xs font-mono text-brass-400 border border-brass-500/30 px-2 py-1 bg-ink-900/40 cursor-default"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
