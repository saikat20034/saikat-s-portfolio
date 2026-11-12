export const profile = {
  name: 'Mazharul Islam',
  title: 'ICT Graduate & Full-Stack (MERN) Developer',
  tagline:
    'B.Sc in Information & Communication Technology, building reliable, well-structured web systems — and ready to bring that same rigor to operations, administration and analytical roles.',
  location: 'Manikganj, Dhaka, Bangladesh',
  email: 'mazharulislamsaikat2000@gmail.com',
  phone: '+8801630496007',
  whatsapp: 'https://wa.me/8801630496007',
  github: 'https://github.com/saikat20034',
  linkedin: 'https://www.linkedin.com/in/md-mazharul-islam-saikat-65bab2299/',
  facebook: 'https://www.facebook.com/mdmazharulislam.saikat.7/',
  resume: '/resume/Mazharul_Islam_Resume.pdf',
  heroPhoto: '/images/hero-photo.jpg',
  aboutPhoto: '/images/about-photo.jpg',
  photo: '/images/hero-photo.jpg',
};

export const about = {
  paragraphs: [
    "I'm an ICT graduate from Mawlana Bhashani Science and Technology University (MBSTU), currently pursuing an M.Sc. in ICT at the same institution. My academic foundation is paired with hands-on experience building full-stack web applications — from database design to deployed, working products.",
    'I specialize in the MERN stack (MongoDB, Express.js, React, Node.js) alongside HTML5, CSS3, JavaScript and Tailwind CSS, and I have formal training in relational database systems (MySQL/Oracle/SQL). I care about writing code that is structured, documented and maintainable — the same discipline I bring to any process I own.',
    "I'm currently exploring roles across banking operations, university administration, and e-commerce/dropshipping operations, where analytical thinking, attention to detail, and technical fluency add real value.",
  ],
  facts: [
    { label: 'Based in', value: 'Manikganj, Dhaka, Bangladesh' },
    { label: 'Education', value: 'M.Sc. ICT (ongoing), MBSTU' },
    { label: 'Core stack', value: 'React · Node.js · Express · MongoDB' },
    { label: 'Open to', value: 'Banking · Admin · E-commerce Ops' },
  ],
};

export const education = [
  {
    level: 'M.Sc. in ICT',
    code: 'EDU.04',
    institution: 'Mawlana Bhashani Science and Technology University',
    program: 'Information and Communication Technology',
    result: 'Ongoing',
    year: '2025 – Present',
  },
  {
    level: 'Honours (B.Sc.)',
    code: 'EDU.03',
    institution: 'Mawlana Bhashani Science and Technology University',
    program: 'Information and Communication Technology',
    result: 'CGPA 3.07 / 4.00',
    year: '2020 – 2025',
  },
  {
    level: 'H.S.C.',
    code: 'EDU.02',
    institution: 'Govt. Debendra College',
    program: 'Science',
    result: 'GPA 4.25 / 5.00',
    year: '2018',
  },
  {
    level: 'S.S.C.',
    code: 'EDU.01',
    institution: 'Daragram High School',
    program: 'Science',
    result: 'GPA 4.89 / 5.00',
    year: '2016',
  },
];

export const skillGroups = [
  {
    group: 'Frontend',
    items: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React', 'Tailwind CSS'],
  },
  {
    group: 'Backend',
    items: ['Node.js', 'Express.js', 'REST APIs', 'JWT Authentication'],
  },
  {
    group: 'Data & Tools',
    items: ['MongoDB', 'MySQL / Oracle SQL', 'Git & GitHub', 'Firebase'],
  },
  {
    group: 'Professional',
    items: ['Documentation', 'Data Analysis', 'Process Compliance', 'Stakeholder Communication'],
  },
];

// Flat shape mirrors the Firestore `skills` collection: { name, group, order }
export const skillsFallback = skillGroups.flatMap((g, gi) =>
  g.items.map((name, i) => ({ name, group: g.group, order: gi * 100 + i }))
);

export const certifications = [
  {
    title: 'Database (MySQL / Oracle / SQL) Training',
    issuer:
      "Dept. of ICT, MBSTU — under the EDGE Project, Bangladesh Computer Council, ICT Division",
    duration: '80 hours · Dec 2024 – Jul 2025',
  },
  {
    title: 'Full-Stack Web Development (MERN)',
    issuer: "Programming Hero — Web Development Program, Batch 10",
    duration: 'Full-stack: React · Node.js · Express · MongoDB',
  },
];

export const projects = [
  {
    name: 'ScholarSphere',
    tagline: 'Global scholarship & admissions gateway',
    description:
      'A comprehensive scholarship discovery and management platform connecting students worldwide to verified grants and university fellowships, featuring an intelligent eligibility calculator, deadline radar, and full application management.',
    highlights: [
      'Interactive scholarship finder with eligibility score calculation',
      'End-to-end applicant tracking pipeline and review dashboard',
      'Integrated Stripe checkout for processing application fees',
    ],
    stack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Stripe', 'Firebase'],
    image: '/images/scholarsphere.jpg',
    code: 'https://github.com/saikat20034/scholarsphere-client',
    live: 'https://scholarsphere.vercel.app',
  },
  {
    name: 'Smart Mess Manager',
    tagline: 'Hostel & shared apartment management system',
    description:
      'A responsive web application tailored for university hostels and shared flats across Bangladesh, automating meal tracking, daily bazar records, utility bill splits, and transparent monthly financial settlements in BDT.',
    highlights: [
      'Automated meal rate calculation with configurable meal unit weights',
      'Daily grocery & shared utility ledger with instant surplus/due balance tracking',
      'Role-based manager and resident views with bKash and Nagad deposit logging',
    ],
    stack: ['React', 'Node.js', 'Express.js', 'Supabase', 'PostgreSQL', 'Tailwind CSS'],
    image: '/images/messmanager.jpg',
    code: 'https://github.com/saikat20034/smart-mess-manager-frontend',
    live: 'https://smart-mess-manager.surge.sh',
  },
  {
    name: 'TradeNest',
    tagline: 'B2B e-commerce marketplace',
    description:
      'A modern B2B marketplace connecting businesses for seamless product trading, with role-based access for admins, sellers and buyers, complete order management, secure Stripe payments and real-time inventory control.',
    highlights: [
      'Role-based access for admin, seller and buyer accounts',
      'End-to-end order management with live inventory sync',
      'Secure checkout via Stripe payment integration',
    ],
    stack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JWT Auth', 'Stripe'],
    image: '/images/tradenest.png',
    code: 'https://github.com/saikat20034/TradeNest',
    live: '',
  },
  {
    name: 'HotelHive',
    tagline: 'Hotel booking platform',
    description:
      'A hotel booking platform for browsing, booking and managing reservations, with secure authentication, payment integration, dynamic search filters and an admin dashboard for listings and bookings.',
    highlights: [
      'Dynamic search & filtering across live room listings',
      'Secure auth with payment integration at checkout',
      'Admin dashboard for managing listings and bookings',
    ],
    stack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JWT Auth', 'Payments'],
    image: '/images/hotelhive.png',
    code: 'https://github.com/saikat20034',
    live: '',
  },
  {
    name: 'VisaLand',
    tagline: 'Visa navigation portal',
    description:
      'A visa navigation portal that simplifies checking visa requirements, applying online and tracking applications, with role-based access and real-time status updates.',
    highlights: [
      'Requirement lookup across multiple destinations',
      'Online application flow with document handling',
      'Real-time status tracking with role-based dashboards',
    ],
    stack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JWT Auth'],
    image: '/images/visaland.png',
    code: 'https://github.com/saikat20034',
    live: '',
  },
];

export const stats = [
  { label: 'Full-Stack Projects', value: 5, suffix: '+' },
  { label: 'Technologies Used', value: 14, suffix: '+' },
  { label: 'Training Hours (DB)', value: 80, suffix: '' },
  { label: 'CGPA', value: 3.07, suffix: '/4.00', decimals: 2 },
];

export const services = [
  {
    title: 'Full-Stack Web Development',
    description:
      'Building complete web applications end-to-end — from database schema to a deployed, responsive interface — using the MERN stack.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
  },
  {
    title: 'Database Design & Management',
    description:
      'Structuring relational and NoSQL data models for integrity and performance, backed by formal training in MySQL/Oracle/SQL.',
    tags: ['MySQL', 'Oracle SQL', 'MongoDB'],
  },
  {
    title: 'REST API Development',
    description:
      'Designing and building secure, well-documented APIs with authentication, validation, and clean route architecture.',
    tags: ['Express.js', 'JWT', 'REST'],
  },
  {
    title: 'Technical Documentation & Ops',
    description:
      'Bringing the same structure and precision to documentation, records and compliance-driven processes as I do to code.',
    tags: ['Documentation', 'Process Compliance', 'Data Analysis'],
  },
];

// icon field maps to a component name exported from react-icons/si or react-icons/fa,
// resolved in TechMarquee.jsx
export const techStack = [
  { name: 'React', icon: 'SiReact' },
  { name: 'Node.js', icon: 'SiNodedotjs' },
  { name: 'Express.js', icon: 'SiExpress' },
  { name: 'MongoDB', icon: 'SiMongodb' },
  { name: 'Tailwind CSS', icon: 'SiTailwindcss' },
  { name: 'JavaScript', icon: 'SiJavascript' },
  { name: 'HTML5', icon: 'SiHtml5' },
  { name: 'CSS3', icon: 'SiCss' },
  { name: 'MySQL', icon: 'SiMysql' },
  { name: 'Git', icon: 'SiGit' },
  { name: 'GitHub', icon: 'SiGithub' },
  { name: 'Firebase', icon: 'SiFirebase' },
];

export const CONTACT_ENDPOINT =
  'https://portfolio-server-sigma-mocha.vercel.app/send-email';
