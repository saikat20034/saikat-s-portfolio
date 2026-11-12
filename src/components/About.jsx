import { motion } from 'framer-motion';
import { about, profile } from '../data/content';
import Reveal, { SectionHeading } from './Reveal';

export default function About() {
  return (
    <section id="about" className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
      <Reveal>
        <SectionHeading eyebrow="// 01 — Profile" title="About" accent="Me" />
      </Reveal>

      <div className="grid md:grid-cols-[0.85fr_1.15fr] gap-12 items-start">
        <Reveal delay={0.05} direction="right">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="corner-frame group shadow-xl overflow-hidden bg-ink-950"
          >
            <img
              src={profile.photo}
              alt={profile.name}
              className="w-full aspect-[3/4] object-cover object-top contrast-[1.03] transition-all duration-500 group-hover:scale-105"
            />
          </motion.div>
        </Reveal>

        <Reveal delay={0.1} direction="left">
          <div className="space-y-5 text-muted leading-relaxed">
            {about.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
                className={i === 0 ? 'text-paper text-lg font-medium' : ''}
              >
                {p}
              </motion.p>
            ))}
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-ink-700 pt-8">
            {about.facts.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.06, duration: 0.4 }}
                whileHover={{ x: 4 }}
                className="transition-transform border-l-2 border-transparent hover:border-brass-500 pl-2"
              >
                <dt className="font-mono text-xs uppercase tracking-widest text-brass-500 mb-1">
                  {f.label}
                </dt>
                <dd className="text-paper text-sm font-medium">{f.value}</dd>
              </motion.div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
