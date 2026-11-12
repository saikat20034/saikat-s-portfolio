import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight, FaCheckCircle } from 'react-icons/fa';
import { projects } from '../data/content';
import Reveal, { SectionHeading } from './Reveal';

export default function Projects() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const count = projects.length;

  useEffect(() => {
    if (index >= count && count > 0) setIndex(0);
  }, [count, index]);

  const go = (dir) => {
    setDirection(dir);
    setIndex((i) => (i + dir + count) % count);
  };

  const jump = (i) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  };

  const p = projects[index];
  if (!p) return null;

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80, scale: 0.98 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80, scale: 0.98 }),
  };

  return (
    <section id="projects" className="bg-ink-800/60 border-y border-ink-700">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
            <SectionHeading eyebrow="// 05 — Selected Work" title="Featured" accent="Projects" />
            <div className="hidden sm:flex items-center gap-2 mb-12">
              <motion.button
                onClick={() => go(-1)}
                whileHover={{ scale: 1.1, borderColor: '#C99A4A', color: '#C99A4A' }}
                whileTap={{ scale: 0.9 }}
                aria-label="Previous project"
                className="w-11 h-11 grid place-items-center border border-ink-600 text-paper transition-colors focus-ring bg-ink-900/60"
              >
                <FaChevronLeft />
              </motion.button>
              <motion.button
                onClick={() => go(1)}
                whileHover={{ scale: 1.1, borderColor: '#C99A4A', color: '#C99A4A' }}
                whileTap={{ scale: 0.9 }}
                aria-label="Next project"
                className="w-11 h-11 grid place-items-center border border-ink-600 text-paper transition-colors focus-ring bg-ink-900/60"
              >
                <FaChevronRight />
              </motion.button>
            </div>
          </div>
        </Reveal>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.article
              key={p.id || p.name}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70) go(1);
                else if (info.offset.x > 70) go(-1);
              }}
              className="grid md:grid-cols-2 border border-ink-700 bg-ink-900/70 shadow-2xl cursor-grab active:cursor-grabbing group"
            >
              <div className="aspect-video md:aspect-auto overflow-hidden border-b md:border-b-0 md:border-r border-ink-700 bg-ink-950 relative">
                <motion.img
                  src={p.image}
                  alt={p.name}
                  draggable={false}
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-full h-full object-cover select-none"
                />
              </div>
              
              <div className="p-7 sm:p-9 flex flex-col justify-between">
                <div>
                  <p className="font-mono text-xs text-brass-500 uppercase tracking-widest mb-1.5 font-semibold">
                    {p.tagline}
                  </p>
                  <h3 className="font-display font-semibold text-2xl sm:text-3xl text-paper mb-3">
                    {p.name}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">{p.description}</p>

                  <ul className="mt-5 space-y-2">
                    {p.highlights.map((h, hi) => (
                      <motion.li
                        key={h}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + hi * 0.06 }}
                        className="flex items-start gap-2.5 text-sm text-paper/90"
                      >
                        <FaCheckCircle className="text-signal mt-1 shrink-0 text-xs" />
                        <span>{h}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 mt-6">
                    {p.stack.map((t) => (
                      <motion.span
                        key={t}
                        whileHover={{ scale: 1.07, borderColor: '#C99A4A', color: '#F3EFE6' }}
                        className="text-xs font-mono text-muted border border-ink-600 px-2.5 py-1 bg-ink-950/40 transition-colors cursor-default"
                      >
                        {t}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-5 border-t border-ink-700">
                  {p.code && (
                    <motion.a
                      href={p.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, x: 2, color: '#C99A4A' }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 text-sm text-paper font-medium transition-colors focus-ring"
                    >
                      <FaGithub className="text-base" /> Code
                    </motion.a>
                  )}
                  {p.live && (
                    <motion.a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, x: 2, color: '#C99A4A' }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 text-sm text-paper font-medium transition-colors focus-ring"
                    >
                      <FaExternalLinkAlt className="text-xs" /> Live Demo
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2.5 mt-8">
          {projects.map((proj, i) => (
            <motion.button
              key={proj.id || proj.name}
              onClick={() => jump(i)}
              aria-label={`Go to ${proj.name}`}
              animate={{
                width: i === index ? 32 : 8,
                backgroundColor: i === index ? '#C99A4A' : '#293554',
              }}
              whileHover={{ scale: 1.25 }}
              transition={{ duration: 0.3 }}
              className="h-2 rounded-full focus-ring"
            />
          ))}
        </div>

        {/* Mobile arrows */}
        <div className="flex sm:hidden items-center justify-center gap-4 mt-6">
          <motion.button
            onClick={() => go(-1)}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous project"
            className="w-10 h-10 grid place-items-center border border-ink-600 text-paper"
          >
            <FaChevronLeft />
          </motion.button>
          <span className="font-mono text-xs text-muted">
            {index + 1} / {count}
          </span>
          <motion.button
            onClick={() => go(1)}
            whileTap={{ scale: 0.9 }}
            aria-label="Next project"
            className="w-10 h-10 grid place-items-center border border-ink-600 text-paper"
          >
            <FaChevronRight />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
