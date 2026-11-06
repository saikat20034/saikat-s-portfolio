import { motion } from 'framer-motion';
import { skillsFallback, certifications as certificationsFallback } from '../data/content';
import { useLiveCollection } from '../firebase/useLiveCollection';
import Reveal, { SectionHeading } from './Reveal';
import { HiOutlineBadgeCheck } from 'react-icons/hi';

function groupSkills(flat) {
  const groups = [];
  const index = {};
  for (const s of flat) {
    if (!(s.group in index)) {
      index[s.group] = groups.length;
      groups.push({ group: s.group, items: [] });
    }
    groups[index[s.group]].items.push(s.name);
  }
  return groups;
}

export default function Skills() {
  const { items: skillsFlat } = useLiveCollection('skills', skillsFallback);
  const { items: certifications } = useLiveCollection('certifications', certificationsFallback);
  const skillGroups = groupSkills(skillsFlat);

  return (
    <section id="skills" className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
      <Reveal>
        <SectionHeading eyebrow="// 04 — Technical Skills" title="Skills &" accent="Training" />
      </Reveal>

      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {skillGroups.map((g, gi) => (
          <motion.div
            key={g.group}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: gi * 0.1, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="border border-ink-700 bg-ink-800/40 p-6 h-full shadow-lg transition-colors hover:border-ink-600"
          >
            <h3 className="font-mono text-xs uppercase tracking-widest text-brass-500 mb-4 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brass-500" />
              {g.group}
            </h3>
            <ul className="flex flex-wrap gap-2.5">
              {g.items.map((item, ii) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: gi * 0.08 + ii * 0.03, duration: 0.3 }}
                  whileHover={{ scale: 1.07, y: -2, borderColor: '#C99A4A', color: '#F3EFE6' }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-paper border border-ink-600 px-3 py-1.5 bg-ink-900/50 cursor-pointer transition-colors shadow-sm"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <Reveal>
        <h3 className="font-display font-semibold text-2xl text-paper mb-6 flex items-center gap-2">
          Certifications &amp; Training
        </h3>
      </Reveal>
      
      <div className="grid sm:grid-cols-2 gap-6">
        {certifications.map((c, i) => (
          <motion.div
            key={c.id || c.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            whileHover={{ y: -6, borderColor: 'rgba(201, 154, 74, 0.7)' }}
            className="group border border-ink-700 p-6 flex gap-4 bg-ink-900/40 transition-colors shadow-md"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.15 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 shrink-0 grid place-items-center border border-ink-600 text-brass-500 group-hover:border-brass-500 transition-colors bg-ink-800"
            >
              <HiOutlineBadgeCheck className="text-xl" />
            </motion.div>
            <div>
              <h4 className="font-display font-semibold text-base text-paper group-hover:text-brass-400 transition-colors">
                {c.title}
              </h4>
              <p className="text-muted text-xs mt-1 leading-relaxed">{c.issuer}</p>
              <p className="text-brass-500/90 font-mono text-xs mt-3">{c.duration}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
