import { motion } from 'framer-motion';
import {
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiTailwindcss,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiMysql,
  SiGit,
  SiGithub,
  SiFirebase,
} from 'react-icons/si';
import { techStack } from '../data/content';
import Reveal from './Reveal';

const ICONS = {
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiTailwindcss,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiMysql,
  SiGit,
  SiGithub,
  SiFirebase,
};

const track = [...techStack, ...techStack];

export default function TechMarquee() {
  return (
    <section className="border-y border-ink-700 bg-ink-950 overflow-hidden py-10 relative">
      <Reveal>
        <p className="section-eyebrow text-center mb-6">// Tech Stack — Tools I Work With</p>
      </Reveal>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-ink-950 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-ink-950 to-transparent z-10" />

        <div className="flex w-max animate-marquee">
          {track.map((t, i) => {
            const Icon = ICONS[t.icon];
            return (
              <motion.div
                key={`${t.name}-${i}`}
                whileHover={{ scale: 1.1, y: -4, borderColor: '#C99A4A' }}
                className="flex items-center gap-3 mx-4 px-4 py-2 border border-ink-700 bg-ink-900/60 transition-colors cursor-pointer group"
              >
                {Icon && (
                  <Icon className="text-xl text-muted group-hover:text-brass-500 transition-colors" />
                )}
                <span className="font-mono text-xs text-paper group-hover:text-brass-400 font-medium whitespace-nowrap">
                  {t.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
