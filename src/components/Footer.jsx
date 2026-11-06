import { motion } from 'framer-motion';
import { FaGithub, FaLinkedinIn, FaFacebookF } from 'react-icons/fa';
import { profile } from '../data/content';

export default function Footer() {
  const socials = [
    { href: profile.github, icon: FaGithub, label: 'GitHub' },
    { href: profile.linkedin, icon: FaLinkedinIn, label: 'LinkedIn' },
    { href: profile.facebook, icon: FaFacebookF, label: 'Facebook' },
  ];

  return (
    <footer className="border-t border-ink-700 bg-ink-950 relative z-10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {socials.map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              whileHover={{ scale: 1.2, y: -3, color: '#C99A4A' }}
              whileTap={{ scale: 0.9 }}
              className="text-muted text-base p-2 transition-colors"
            >
              <s.icon />
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  );
}
