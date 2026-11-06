import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { profile } from '../data/content';

const links = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-ink-900/90 backdrop-blur border-b border-ink-700' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <motion.button
          onClick={() => handleClick('top')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 font-display font-semibold text-lg focus-ring rounded"
        >
          <motion.span
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
            className="w-8 h-8 grid place-items-center border border-brass-500 text-brass-500 font-mono text-sm bg-ink-800/60 shadow-sm"
          >
            MI
          </motion.span>
          <span className="hidden sm:inline text-paper">{profile.name}</span>
        </motion.button>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <motion.button
              key={l.id}
              onClick={() => handleClick(l.id)}
              whileHover={{ y: -2, color: '#C99A4A' }}
              whileTap={{ y: 0 }}
              transition={{ duration: 0.2 }}
              className="relative font-mono text-xs tracking-widest uppercase text-muted hover:text-brass-500 transition-colors focus-ring rounded py-1"
            >
              {l.label}
            </motion.button>
          ))}
          <motion.a
            href={profile.resume}
            download
            whileHover={{ scale: 1.04, y: -2, boxShadow: '0 4px 20px rgba(201, 154, 74, 0.25)' }}
            whileTap={{ scale: 0.96 }}
            className="font-mono text-xs tracking-widest uppercase border border-brass-500 text-brass-500 px-4 py-2 hover:bg-brass-500 hover:text-ink-900 transition-colors focus-ring"
          >
            Resume
          </motion.a>
        </div>

        <motion.button
          onClick={() => setOpen(!open)}
          whileTap={{ scale: 0.9 }}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="md:hidden text-2xl text-paper p-2 focus-ring rounded"
        >
          {open ? <HiX /> : <HiMenu />}
        </motion.button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-b border-ink-700 bg-ink-900/95 backdrop-blur px-5 py-6 space-y-4"
          >
            {links.map((l, i) => (
              <motion.button
                key={l.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleClick(l.id)}
                className="block w-full text-left font-mono text-xs tracking-widest uppercase text-paper hover:text-brass-500 py-2"
              >
                {l.label}
              </motion.button>
            ))}
            <motion.a
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: links.length * 0.05 }}
              href={profile.resume}
              download
              className="block text-center font-mono text-xs tracking-widest uppercase border border-brass-500 text-brass-500 py-3 mt-4 hover:bg-brass-500 hover:text-ink-900 transition-colors"
            >
              Download Resume
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
