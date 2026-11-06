import { motion } from 'framer-motion';
import {
  FaGithub,
  FaLinkedinIn,
  FaFacebookF,
  FaWhatsapp,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { HiOutlineArrowUp } from 'react-icons/hi';
import { profile, projects } from '../data/content';

const navLinks = [
  { id: 'about', label: 'About Me' },
  { id: 'services', label: 'Capabilities' },
  { id: 'education', label: 'Academic Timeline' },
  { id: 'skills', label: 'Skills & Tools' },
  { id: 'projects', label: 'Featured Projects' },
  { id: 'contact', label: 'Contact & Hire' },
];

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const socials = [
    { href: profile.github, icon: FaGithub, label: 'GitHub', username: 'saikat20034' },
    { href: profile.linkedin, icon: FaLinkedinIn, label: 'LinkedIn', username: 'md-mazharul-islam' },
    { href: profile.facebook, icon: FaFacebookF, label: 'Facebook', username: 'mazharulislam.saikat' },
    { href: profile.whatsapp, icon: FaWhatsapp, label: 'WhatsApp', username: '+8801630496007' },
  ];

  return (
    <footer className="border-t border-ink-700 bg-ink-950 relative z-10 text-paper">
      {/* Top CTA Banner */}
      <div className="border-b border-ink-800 bg-ink-900/40">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-brass-500 mb-2 font-semibold">
              // Available for hire &amp; collaboration
            </p>
            <h3 className="font-display font-semibold text-2xl sm:text-3xl text-paper">
              Looking for a dedicated Full-Stack Developer?
            </h3>
            <p className="text-muted text-sm mt-1 max-w-xl">
              I am open to full-time software engineering roles, tech operations, and freelance web projects. Let’s create something impactful.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <motion.button
              onClick={() => scrollTo('contact')}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="bg-brass-500 text-ink-900 font-semibold px-6 py-3 hover:bg-brass-400 transition-colors focus-ring cursor-pointer text-sm"
            >
              Get in Touch
            </motion.button>
            <motion.a
              href={profile.resume}
              download
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="border border-ink-600 text-paper px-6 py-3 hover:border-brass-500 hover:text-brass-500 transition-colors focus-ring text-sm font-medium"
            >
              Download CV
            </motion.a>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer Grid */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 grid place-items-center border border-brass-500 text-brass-500 font-mono text-sm font-bold bg-ink-900">
                MI
              </span>
              <div>
                <h4 className="font-display font-semibold text-lg text-paper leading-tight">
                  {profile.name}
                </h4>
                <p className="font-mono text-xs text-brass-500 font-medium">Full-Stack MERN Developer</p>
              </div>
            </div>

            <p className="text-muted text-sm leading-relaxed">
              B.Sc. in ICT graduate from MBSTU. Architecting reliable, structured web systems with React, Node.js, Express, MongoDB, and Tailwind CSS.
            </p>

            <div className="pt-2 space-y-2 text-xs font-mono text-muted">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-signal" />
                </span>
                <span className="text-signal font-semibold">Available for Opportunities</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-brass-500 shrink-0" />
                <span>Manikganj, Dhaka · UTC+6</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-brass-500 mb-4 font-semibold">
              // Navigation
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => scrollTo(l.id)}
                    className="text-muted text-sm hover:text-brass-400 hover:translate-x-1 transition-all inline-block focus-ring rounded"
                  >
                    → {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Featured Projects */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-brass-500 mb-4 font-semibold">
              // Selected Work
            </h4>
            <ul className="space-y-3">
              {projects.map((p) => (
                <li key={p.name} className="group">
                  <button
                    onClick={() => scrollTo('projects')}
                    className="text-left block w-full focus-ring rounded"
                  >
                    <span className="text-sm text-paper group-hover:text-brass-400 transition-colors font-medium block">
                      {p.name}
                    </span>
                    <span className="text-xs text-muted font-mono block truncate">
                      {p.tagline}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Socials */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-widest text-brass-500 mb-4 font-semibold">
              // Connect Directly
            </h4>

            <div className="space-y-2.5 text-sm">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 text-muted hover:text-paper transition-colors group"
              >
                <div className="w-8 h-8 grid place-items-center border border-ink-700 bg-ink-900 text-brass-500 group-hover:border-brass-500 transition-colors shrink-0">
                  <FaEnvelope className="text-xs" />
                </div>
                <span className="truncate text-xs font-mono">{profile.email}</span>
              </a>

              <a
                href={`tel:${profile.phone}`}
                className="flex items-center gap-3 text-muted hover:text-paper transition-colors group"
              >
                <div className="w-8 h-8 grid place-items-center border border-ink-700 bg-ink-900 text-brass-500 group-hover:border-brass-500 transition-colors shrink-0">
                  <FaPhoneAlt className="text-xs" />
                </div>
                <span className="text-xs font-mono">{profile.phone}</span>
              </a>
            </div>

            <div className="pt-3">
              <p className="font-mono text-xs text-muted mb-2.5">Find me online:</p>
              <div className="flex flex-wrap gap-2">
                {socials.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    whileHover={{ scale: 1.1, y: -2, borderColor: '#C99A4A', color: '#C99A4A' }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 grid place-items-center border border-ink-700 bg-ink-900/80 text-muted transition-colors focus-ring"
                    title={s.label}
                  >
                    <s.icon className="text-sm" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal / Copyright Bar */}
      <div className="border-t border-ink-800 bg-ink-950">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
          <div>
            <p>
              © {new Date().getFullYear()} <span className="text-paper font-semibold">{profile.name}</span>. All rights reserved.
            </p>
            <p className="text-[11px] text-muted/70 mt-0.5">
              Built with React 19, Tailwind CSS &amp; Framer Motion
            </p>
          </div>

          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.05, color: '#C99A4A' }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 text-muted hover:text-brass-500 transition-colors focus-ring py-1 px-2 rounded"
          >
            <span>Back to top</span>
            <HiOutlineArrowUp />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
