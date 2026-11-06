import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { CONTACT_ENDPOINT, profile } from '../data/content';
import Reveal, { SectionHeading } from './Reveal';

const initialForm = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus('sending');
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        setForm(initialForm);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const contactItems = [
    { icon: FaEnvelope, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: FaPhoneAlt, label: 'Phone', value: profile.phone, href: `tel:${profile.phone}` },
    { icon: FaMapMarkerAlt, label: 'Location', value: profile.location },
  ];

  return (
    <section id="contact" className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
      <Reveal>
        <SectionHeading eyebrow="// 06 — Connect" title="Get in" accent="Touch" />
      </Reveal>

      <div className="grid md:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
        {/* Contact info cards */}
        <Reveal delay={0.05} direction="right">
          <div className="space-y-6">
            <p className="text-muted leading-relaxed">
              Whether you have an upcoming project, open role, or just want to connect, feel free to reach out. I am always open to new conversations.
            </p>

            <div className="space-y-4 pt-4">
              {contactItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  whileHover={{ x: 6, borderColor: 'rgba(201, 154, 74, 0.7)' }}
                  className="border border-ink-700 bg-ink-800/40 p-5 flex items-center gap-4 transition-colors shadow-sm"
                >
                  <div className="w-10 h-10 grid place-items-center border border-ink-600 text-brass-500 shrink-0 bg-ink-900/60">
                    <item.icon />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-mono text-xs uppercase tracking-widest text-brass-500">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-paper text-sm hover:text-brass-400 transition-colors truncate block"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-paper text-sm truncate">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Contact Form */}
        <Reveal delay={0.1} direction="left">
          <form
            onSubmit={onSubmit}
            className="border border-ink-700 bg-ink-800/30 p-7 sm:p-9 space-y-6 shadow-2xl relative"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block font-mono text-xs uppercase tracking-widest text-muted mb-2">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={onChange}
                  className="w-full bg-ink-900 border border-ink-600 px-4 py-3 text-sm text-paper focus-ring transition-colors focus:border-brass-500"
                  placeholder="Your Name"
                />
                {errors.name && <p className="text-xs text-red-400 mt-1 font-mono">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block font-mono text-xs uppercase tracking-widest text-muted mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  className="w-full bg-ink-900 border border-ink-600 px-4 py-3 text-sm text-paper focus-ring transition-colors focus:border-brass-500"
                  placeholder="name@example.com"
                />
                {errors.email && <p className="text-xs text-red-400 mt-1 font-mono">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block font-mono text-xs uppercase tracking-widest text-muted mb-2">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={onChange}
                className="w-full bg-ink-900 border border-ink-600 px-4 py-3 text-sm text-paper focus-ring transition-colors focus:border-brass-500"
                placeholder="How can I help you?"
              />
              {errors.subject && <p className="text-xs text-red-400 mt-1 font-mono">{errors.subject}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block font-mono text-xs uppercase tracking-widest text-muted mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={onChange}
                className="w-full bg-ink-900 border border-ink-600 px-4 py-3 text-sm text-paper focus-ring transition-colors focus:border-brass-500 resize-none"
                placeholder="Write your message here..."
              />
              {errors.message && <p className="text-xs text-red-400 mt-1 font-mono">{errors.message}</p>}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileHover={{ scale: 1.03, y: -2, boxShadow: '0 8px 24px rgba(201, 154, 74, 0.3)' }}
                whileTap={{ scale: 0.97 }}
                className="bg-brass-500 text-ink-900 font-semibold px-8 py-3.5 hover:bg-brass-400 transition-colors focus-ring disabled:opacity-60 flex items-center gap-2 cursor-pointer"
              >
                {status === 'sending' && <FaSpinner className="animate-spin" />}
                {status === 'sending' ? 'Sending Message...' : 'Send Message'}
              </motion.button>

              <AnimatePresence>
                {status === 'sent' && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-signal flex items-center gap-2 font-mono font-medium"
                  >
                    <FaCheckCircle /> Message sent successfully!
                  </motion.p>
                )}
                {status === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-red-400 font-mono"
                  >
                    Failed to send. Please email me directly.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
