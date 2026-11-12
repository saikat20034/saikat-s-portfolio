import { motion } from 'framer-motion';
import { FaGithub, FaLinkedinIn, FaFacebookF, FaWhatsapp, FaReact, FaNodeJs } from 'react-icons/fa';
import { SiMongodb, SiTailwindcss } from 'react-icons/si';
import { profile } from '../data/content';

const socials = [
  { href: profile.github, icon: FaGithub, label: 'GitHub' },
  { href: profile.linkedin, icon: FaLinkedinIn, label: 'LinkedIn' },
  { href: profile.facebook, icon: FaFacebookF, label: 'Facebook' },
  { href: profile.whatsapp, icon: FaWhatsapp, label: 'WhatsApp' },
];

const badges = [
  { icon: FaReact, label: 'React', className: 'top-[8%] left-[3%]', delay: 0 },
  { icon: FaNodeJs, label: 'Node.js', className: 'top-[18%] right-[2%]', delay: 0.5 },
  { icon: SiMongodb, label: 'MongoDB', className: 'bottom-[22%] right-[6%]', delay: 1.0 },
  { icon: SiTailwindcss, label: 'Tailwind', className: 'bottom-[10%] left-[2%]', delay: 1.5 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function Hero() {
  return (
    <section id="top" className="relative bg-blueprint overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ink-900/40 via-ink-900/70 to-ink-900" />

      {/* animated circuit-trace background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.35] pointer-events-none"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {[
          'M0 120 H260 L300 80 H520 L560 120 H900 L940 160 H1200',
          'M0 400 H180 L220 440 H460 L500 400 H760 L800 360 H1200',
          'M0 580 H340 L380 620 H700 L740 580 H1200',
        ].map((d, i) => (
          <motion.path
            key={d}
            d={d}
            stroke="#C99A4A"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.2, delay: i * 0.3, ease: 'easeInOut' }}
          />
        ))}
      </svg>

      {/* floating tech badges */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        {badges.map((b) => (
          <motion.div
            key={b.label}
            className={`absolute ${b.className} flex items-center gap-2 border border-ink-600 bg-ink-900/80 backdrop-blur px-3 py-2 shadow-lg`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: [0, -12, 0] }}
            transition={{
              opacity: { duration: 0.6, delay: b.delay },
              y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: b.delay },
            }}
          >
            <b.icon className="text-brass-500 text-lg" />
            <span className="font-mono text-xs text-paper/80 font-medium">{b.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-24 md:pt-28 md:pb-32 grid md:grid-cols-[1.2fr_0.8fr] gap-14 items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Status Pill */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 border border-ink-600 px-3 py-1.5 mb-6 bg-ink-900/60 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-signal" />
            </span>
            <span className="font-mono text-xs text-muted tracking-wide">
              Open to opportunities
            </span>
          </motion.div>

          <motion.p variants={itemVariants} className="section-eyebrow mb-4">
            // Portfolio — Full-Stack Development
          </motion.p>
          
          <motion.h1
            variants={itemVariants}
            className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-paper"
          >
            {profile.name}
          </motion.h1>

          <motion.div variants={itemVariants} className="mt-4">
            <svg
              className="w-56 h-3"
              viewBox="0 0 220 12"
              fill="none"
              aria-hidden="true"
            >
              <motion.path
                d="M0 6 H80 L92 1 H140 L150 11 H220"
                stroke="#C99A4A"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, delay: 0.35, ease: 'easeInOut' }}
              />
            </svg>
          </motion.div>

          <motion.p variants={itemVariants} className="mt-6 text-lg sm:text-xl text-paper font-medium max-w-xl">
            {profile.title}
          </motion.p>
          
          <motion.p variants={itemVariants} className="mt-4 text-base text-muted max-w-xl leading-relaxed">
            {profile.tagline}
          </motion.p>

          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap items-center gap-4">
            <motion.a
              href={profile.resume}
              download
              whileHover={{ scale: 1.04, y: -2, boxShadow: '0 8px 24px rgba(201, 154, 74, 0.3)' }}
              whileTap={{ scale: 0.96 }}
              className="bg-brass-500 text-ink-900 font-semibold px-6 py-3 hover:bg-brass-400 transition-colors focus-ring cursor-pointer"
            >
              Download Resume
            </motion.a>
            <motion.a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
              whileHover={{ scale: 1.04, y: -2, borderColor: '#C99A4A', color: '#C99A4A' }}
              whileTap={{ scale: 0.96 }}
              className="border border-ink-600 text-paper px-6 py-3 transition-colors focus-ring cursor-pointer"
            >
              View Projects
            </motion.a>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-10 flex items-center gap-4">
            {socials.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                whileHover={{ scale: 1.15, y: -3, borderColor: '#C99A4A', color: '#C99A4A' }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 grid place-items-center border border-ink-600 text-muted transition-colors focus-ring bg-ink-800/40"
              >
                <s.icon />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
          className="justify-self-center md:justify-self-end"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="corner-frame w-64 h-[340px] sm:w-80 sm:h-[430px] shadow-2xl relative group cursor-pointer overflow-hidden bg-ink-950"
          >
            <img
              src={profile.heroPhoto || profile.photo}
              alt={profile.name}
              className="w-full h-full object-cover object-top contrast-[1.03] transition-all duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 border border-brass-500/20 pointer-events-none group-hover:border-brass-500/60 transition-colors" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
