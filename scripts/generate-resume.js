/**
 * Single-Page, ATS-Friendly, Production-Grade PDF Resume Generator
 * for Md. Mazharul Islam (Saikat)
 * 
 * Strict Specs:
 * - Exactly 1 Page (A4)
 * - Pure standard ASCII text (code points 32..126) — ZERO garbled Unicode artifacts
 * - Single-column linear layout for maximum ATS compatibility
 * - Clean clickable names: Gmail | GitHub | LinkedIn | Portfolio
 * - No WhatsApp
 * - No em-dash/en-dash signs (replaced with clean standard commas/hyphens)
 */

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Standard Helvetica glyph width approximations (per 1000 units)
const HELVETICA_WIDTHS = {
  ' ': 278, '!': 278, '"': 355, '#': 556, '$': 556, '%': 889, '&': 667, "'": 191,
  '(': 333, ')': 333, '*': 389, '+': 584, ',': 278, '-': 333, '.': 278, '/': 278,
  '0': 556, '1': 556, '2': 556, '3': 556, '4': 556, '5': 556, '6': 556, '7': 556,
  '8': 556, '9': 556, ':': 278, ';': 278, '<': 584, '=': 584, '>': 584, '?': 556,
  '@': 1015, 'A': 667, 'B': 667, 'C': 722, 'D': 722, 'E': 667, 'F': 611, 'G': 778,
  'H': 722, 'I': 278, 'J': 500, 'K': 667, 'L': 556, 'M': 833, 'N': 722, 'O': 778,
  'P': 667, 'Q': 778, 'R': 722, 'S': 667, 'T': 611, 'U': 722, 'V': 667, 'W': 944,
  'X': 667, 'Y': 667, 'Z': 611, '[': 278, '\\': 278, ']': 278, '^': 469, '_': 556,
  'a': 556, 'b': 556, 'c': 500, 'd': 556, 'e': 556, 'f': 278, 'g': 556, 'h': 556,
  'i': 222, 'j': 222, 'k': 500, 'l': 222, 'm': 833, 'n': 556, 'o': 556, 'p': 556,
  'q': 556, 'r': 333, 's': 500, 't': 278, 'u': 556, 'v': 500, 'w': 722, 'x': 500,
  'y': 500, 'z': 500, '{': 334, '|': 260, '}': 334, '~': 584
};

function getTextWidth(text, size, isBold = false) {
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const w = HELVETICA_WIDTHS[ch] || 556;
    width += (w * (isBold ? 1.05 : 1.0) * size) / 1000;
  }
  return width;
}

function escapePdfString(str) {
  // Ensure pure ASCII only
  let clean = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 32 && code <= 126) {
      clean += str[i];
    } else if (code === 8211 || code === 8212) {
      clean += '-';
    } else if (code === 8226) {
      clean += '*';
    } else {
      clean += ' ';
    }
  }
  return clean.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

class SinglePagePdf {
  constructor() {
    this.width = 595.28;  // A4 Width in pt
    this.height = 841.89; // A4 Height in pt
    this.stream = [];
    this.annots = [];
  }

  setFillColor(r, g, b) {
    this.stream.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`);
  }

  setStrokeColor(r, g, b) {
    this.stream.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG`);
  }

  setLineWidth(w) {
    this.stream.push(`${w.toFixed(2)} w`);
  }

  line(x1, y1, x2, y2) {
    this.stream.push(`${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
  }

  rect(x, y, w, h, fill = true, stroke = false) {
    const op = fill && stroke ? 'B' : fill ? 'f' : 'S';
    this.stream.push(`${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re ${op}`);
  }

  roundedRect(x, y, w, h, r, fill = true, stroke = false) {
    const k = 0.5522847498;
    const kr = r * k;
    const x0 = x, x1 = x + r, x2 = x + w - r, x3 = x + w;
    const y0 = y, y1 = y + r, y2 = y + h - r, y3 = y + h;
    const cmds = [
      `${x1.toFixed(2)} ${y0.toFixed(2)} m`,
      `${x2.toFixed(2)} ${y0.toFixed(2)} l`,
      `${(x3 - r + kr).toFixed(2)} ${y0.toFixed(2)} ${x3.toFixed(2)} ${(y1 - kr).toFixed(2)} ${x3.toFixed(2)} ${y1.toFixed(2)} c`,
      `${x3.toFixed(2)} ${y2.toFixed(2)} l`,
      `${x3.toFixed(2)} ${(y3 - r + kr).toFixed(2)} ${(x2 + kr).toFixed(2)} ${y3.toFixed(2)} ${x2.toFixed(2)} ${y3.toFixed(2)} c`,
      `${x1.toFixed(2)} ${y3.toFixed(2)} l`,
      `${(x1 - kr).toFixed(2)} ${y3.toFixed(2)} ${x0.toFixed(2)} ${(y2 + kr).toFixed(2)} ${x0.toFixed(2)} ${y2.toFixed(2)} c`,
      `${x0.toFixed(2)} ${y1.toFixed(2)} l`,
      `${x0.toFixed(2)} ${(y0 + r - kr).toFixed(2)} ${(x1 - kr).toFixed(2)} ${y0.toFixed(2)} ${x1.toFixed(2)} ${y0.toFixed(2)} c`,
      fill && stroke ? 'B' : fill ? 'f' : 'S'
    ];
    this.stream.push(cmds.join(' '));
  }

  addLink(x, y, w, h, url) {
    this.annots.push({
      rect: [x, y, x + w, y + h],
      url,
    });
  }

  text(str, x, y, options = {}) {
    const {
      font = 'F1',
      size = 9.5,
      color = [0, 0, 0],
      link = null,
    } = options;

    const [r, g, b] = color;
    const escaped = escapePdfString(str);
    this.stream.push(
      `BT /${font} ${size} Tf ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${escaped}) Tj ET`
    );

    const isBold = font === 'F2' || font === 'F4';
    const textW = getTextWidth(str, size, isBold);

    if (link) {
      this.addLink(x, y - 2, textW, size + 3, link);
    }

    return textW;
  }

  wrappedText(str, x, y, maxWidth, options = {}) {
    const { font = 'F1', size = 8.8, lineHeight = 12.2, color = [0.15, 0.15, 0.15] } = options;
    const isBold = font === 'F2' || font === 'F4';
    const words = str.split(' ');
    let currentLine = '';
    let currY = y;
    let linesDrawn = 0;

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
      const testWidth = getTextWidth(testLine, size, isBold);

      if (testWidth > maxWidth && currentLine) {
        this.text(currentLine, x, currY, { font, size, color });
        currY -= lineHeight;
        linesDrawn++;
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      this.text(currentLine, x, currY, { font, size, color });
      currY -= lineHeight;
      linesDrawn++;
    }

    return { endY: currY, totalHeight: linesDrawn * lineHeight };
  }

  compile() {
    let objCounter = 1;
    const catalogObjId = objCounter++;
    const pagesObjId = objCounter++;
    const pageObjId = objCounter++;
    const contentObjId = objCounter++;
    const font1Id = objCounter++;
    const font2Id = objCounter++;
    const font3Id = objCounter++;
    const font4Id = objCounter++;

    const annotIds = [];
    for (let i = 0; i < this.annots.length; i++) {
      annotIds.push(objCounter++);
    }

    const objects = new Map();

    objects.set(catalogObjId, `<< /Type /Catalog /Pages ${pagesObjId} 0 R >>`);
    objects.set(pagesObjId, `<< /Type /Pages /Kids [${pageObjId} 0 R] /Count 1 >>`);

    objects.set(font1Id, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`);
    objects.set(font2Id, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`);
    objects.set(font3Id, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>`);
    objects.set(font4Id, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-BoldOblique /Encoding /WinAnsiEncoding >>`);

    const annotsEntry =
      annotIds.length > 0 ? `/Annots [${annotIds.map((id) => `${id} 0 R`).join(' ')}]` : '';

    objects.set(
      pageObjId,
      `<< /Type /Page /Parent ${pagesObjId} 0 R /MediaBox [0 0 ${this.width.toFixed(2)} ${this.height.toFixed(2)}] /Contents ${contentObjId} 0 R /Resources << /Font << /F1 ${font1Id} 0 R /F2 ${font2Id} 0 R /F3 ${font3Id} 0 R /F4 ${font4Id} 0 R >> >> ${annotsEntry} >>`
    );

    const streamText = this.stream.join('\n');
    const streamBuffer = Buffer.from(streamText, 'utf8');
    const compressed = zlib.deflateSync(streamBuffer);

    objects.set(
      contentObjId,
      `<< /Length ${compressed.length} /Filter /FlateDecode >>\nstream\n` +
        compressed.toString('latin1') +
        '\nendstream'
    );

    for (let j = 0; j < this.annots.length; j++) {
      const annotId = annotIds[j];
      const annot = this.annots[j];
      const [x1, y1, x2, y2] = annot.rect;
      const uriEscaped = escapePdfString(annot.url);
      objects.set(
        annotId,
        `<< /Type /Annot /Subtype /Link /Rect [${x1.toFixed(2)} ${y1.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}] /Border [0 0 0] /A << /S /URI /URI (${uriEscaped}) >> >>`
      );
    }

    let body = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
    const offsets = new Map();

    for (let id = 1; id < objCounter; id++) {
      offsets.set(id, Buffer.byteLength(body, 'latin1'));
      const objData = objects.get(id);
      body += `${id} 0 obj\n${objData}\nendobj\n`;
    }

    const startxref = Buffer.byteLength(body, 'latin1');
    body += `xref\n0 ${objCounter}\n`;
    body += '0000000000 65535 f \n';
    for (let id = 1; id < objCounter; id++) {
      const offset = offsets.get(id);
      body += `${String(offset).padStart(10, '0')} 00000 n \n`;
    }

    body += `trailer\n<< /Size ${objCounter} /Root ${catalogObjId} 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;

    return Buffer.from(body, 'latin1');
  }
}

// -----------------------------------------------------------------------------------------
// Build Clean 1-Page ATS-Friendly Resume
// -----------------------------------------------------------------------------------------
export function buildSinglePageResume() {
  const doc = new SinglePagePdf();
  const leftX = 36;
  const contentWidth = 523.28;
  const rightX = leftX + contentWidth;

  // Modern ATS-Friendly Colors
  const PRIMARY = [0.07, 0.13, 0.22];      // #122137 Dark Slate Navy for headings
  const BODY = [0.12, 0.15, 0.20];         // #1F2633 Charcoal for readability
  const MUTED = [0.38, 0.44, 0.52];        // #617085 Dates & metadata
  const LINK = [0.10, 0.38, 0.78];         // #1A61C7 Clean Link Blue
  const LINE = [0.82, 0.85, 0.90];         // #D1D9E6 Subtle Divider
  const BADGE_GREEN = [0.05, 0.52, 0.30];  // Emerald for "Appeared"

  let y = doc.height - 34;

  // -------------------------------------------------------------------------
  // 1. HEADER (Minimalist, ATS-Standard, Pure Names with Clickable Links)
  // -------------------------------------------------------------------------
  // Full Name
  doc.text('MD. MAZHARUL ISLAM (SAIKAT)', leftX, y, {
    font: 'F2',
    size: 20,
    color: PRIMARY,
  });
  y -= 16;

  // Subtitle (No em-dash / en-dash, clean comma)
  doc.text('Full-Stack (MERN) Developer | ICT Graduate, MBSTU', leftX, y, {
    font: 'F2',
    size: 10.5,
    color: MUTED,
  });
  y -= 14;

  // Contact Row: Location, Phone, and Clickable Names for Gmail, GitHub, LinkedIn, Portfolio
  // Zero WhatsApp, clean name labels with active hyperlinks
  let curX = leftX;

  curX += doc.text('Manikganj, Dhaka, Bangladesh', curX, y, { font: 'F1', size: 9, color: BODY }) + 8;
  curX += doc.text('|', curX, y, { font: 'F1', size: 9, color: LINE }) + 8;

  curX += doc.text('+880 1630 496007', curX, y, {
    font: 'F1',
    size: 9,
    color: BODY,
    link: 'tel:+8801630496007',
  }) + 8;
  curX += doc.text('|', curX, y, { font: 'F1', size: 9, color: LINE }) + 8;

  curX += doc.text('Gmail', curX, y, {
    font: 'F2',
    size: 9,
    color: LINK,
    link: 'mailto:mazharulislamsaikat2000@gmail.com',
  }) + 8;
  curX += doc.text('|', curX, y, { font: 'F1', size: 9, color: LINE }) + 8;

  curX += doc.text('GitHub', curX, y, {
    font: 'F2',
    size: 9,
    color: LINK,
    link: 'https://github.com/saikat20034',
  }) + 8;
  curX += doc.text('|', curX, y, { font: 'F1', size: 9, color: LINE }) + 8;

  curX += doc.text('LinkedIn', curX, y, {
    font: 'F2',
    size: 9,
    color: LINK,
    link: 'https://www.linkedin.com/in/md-mazharul-islam-saikat-65bab2299/',
  }) + 8;
  curX += doc.text('|', curX, y, { font: 'F1', size: 9, color: LINE }) + 8;

  curX += doc.text('Portfolio', curX, y, {
    font: 'F2',
    size: 9,
    color: LINK,
    link: 'https://saikat20034.github.io/saikat-s-portfolio',
  });

  y -= 11;
  doc.setStrokeColor(...LINE);
  doc.setLineWidth(0.75);
  doc.line(leftX, y, rightX, y);
  y -= 14;

  // Section Heading Helper
  function drawSectionHeading(heading) {
    doc.text(heading.toUpperCase(), leftX, y, { font: 'F2', size: 10, color: PRIMARY });
    doc.setStrokeColor(...PRIMARY);
    doc.setLineWidth(1.0);
    doc.line(leftX, y - 2.5, rightX, y - 2.5);
    y -= 12.5;
  }

  // -------------------------------------------------------------------------
  // 2. PROFESSIONAL SUMMARY
  // -------------------------------------------------------------------------
  drawSectionHeading('Professional Summary');
  const summary =
    'ICT graduate from Mawlana Bhashani Science and Technology University (MBSTU), having appeared for an M.Sc. in ICT at the same institution. Dedicated Full-Stack Developer specializing in the MERN stack (MongoDB, Express.js, React, Node.js), JavaScript (ES6+), and Tailwind CSS, backed by 80 hours of formal professional relational database training (MySQL/Oracle/SQL) under the EDGE Project, Bangladesh Computer Council. Proven track record designing and deploying production-ready web applications with role-based access control, Stripe payment integrations, and responsive architectures. Prepared to bring analytical rigor and technical precision to fast-paced software engineering and technology operations.';

  const { endY: sumY } = doc.wrappedText(summary, leftX, y, contentWidth, {
    font: 'F1',
    size: 8.7,
    lineHeight: 12.2,
    color: BODY,
  });
  y = sumY - 7;

  // -------------------------------------------------------------------------
  // 3. TECHNICAL SKILLS
  // -------------------------------------------------------------------------
  drawSectionHeading('Technical Skills');

  const skillLines = [
    { label: 'Frontend Technologies', items: 'React.js, JavaScript (ES6+), Tailwind CSS, HTML5, CSS3, Vite, Framer Motion, Axios' },
    { label: 'Backend & APIs', items: 'Node.js, Express.js, RESTful APIs, JWT Authentication, Role-Based Access Control (RBAC)' },
    { label: 'Databases & Cloud', items: 'MongoDB (Mongoose), MySQL, Oracle SQL, Supabase, PostgreSQL, Firebase (Auth & Firestore)' },
    { label: 'Payments & Developer Tools', items: 'Stripe Integration, Git, GitHub, VS Code, Postman, Vercel, Netlify, Surge, npm' },
    { label: 'Core Competencies', items: 'Full-Stack Architecture, Database Schema Modeling, Technical Documentation, Process Compliance' },
  ];

  for (const sk of skillLines) {
    doc.setFillColor(...LINK);
    doc.rect(leftX + 2, y - 5.5, 2.2, 2.2, true, false);

    doc.text(`${sk.label}:`, leftX + 8, y - 6.5, { font: 'F2', size: 8.7, color: PRIMARY });
    const lblW = getTextWidth(`${sk.label}:`, 8.7, true);
    doc.text(sk.items, leftX + 12 + lblW, y - 6.5, { font: 'F1', size: 8.5, color: BODY });
    y -= 12;
  }
  y -= 5;

  // -------------------------------------------------------------------------
  // 4. FEATURED PROJECTS
  // -------------------------------------------------------------------------
  drawSectionHeading('Featured Technical Projects');

  function drawProject(name, subtitle, techStack, bullets, liveUrl, codeUrl) {
    // Project title & subtitle (standard ASCII hyphen instead of em-dash)
    doc.text(name, leftX, y, { font: 'F2', size: 9.8, color: PRIMARY });
    const nameW = getTextWidth(name, 9.8, true);
    doc.text(`- ${subtitle}`, leftX + nameW + 5, y, { font: 'F1', size: 8.6, color: MUTED });

    // Clickable Links right-aligned
    let curR = rightX;
    if (codeUrl) {
      const codeLabel = 'GitHub';
      const cW = getTextWidth(codeLabel, 8.2, true);
      curR -= cW;
      doc.text(codeLabel, curR, y, { font: 'F2', size: 8.2, color: LINK, link: codeUrl });
      curR -= 7;
      doc.text('|', curR, y, { font: 'F1', size: 8.2, color: LINE });
      curR -= 7;
    }
    if (liveUrl) {
      const liveLabel = 'Live Demo';
      const lW = getTextWidth(liveLabel, 8.2, true);
      curR -= lW;
      doc.text(liveLabel, curR, y, { font: 'F2', size: 8.2, color: LINK, link: liveUrl });
    }
    y -= 10;

    // Tech Stack Line
    doc.text('Technologies:', leftX + 8, y, { font: 'F2', size: 8.2, color: MUTED });
    doc.text(techStack, leftX + 72, y, { font: 'F1', size: 8.2, color: PRIMARY });
    y -= 10;

    // Bullets with aligned wrapping
    for (const b of bullets) {
      doc.setFillColor(...PRIMARY);
      doc.rect(leftX + 4, y - 4.5, 2, 2, true, false);

      const indent = leftX + 11;
      const prefixW = b.prefix ? getTextWidth(b.prefix, 8.5, true) : 0;
      if (b.prefix) {
        doc.text(b.prefix, indent, y - 5, { font: 'F2', size: 8.5, color: PRIMARY });
      }

      const words = b.text.split(' ');
      let line1 = '';
      let wIdx = 0;
      const firstLineWidth = contentWidth - 13 - prefixW;

      while (wIdx < words.length) {
        const test = line1 ? line1 + ' ' + words[wIdx] : words[wIdx];
        if (getTextWidth(test, 8.5, false) > firstLineWidth && line1) {
          break;
        }
        line1 = test;
        wIdx++;
      }
      doc.text(line1, indent + prefixW, y - 5, { font: 'F1', size: 8.5, color: BODY });
      y -= 11;

      let restLine = '';
      const fullLineWidth = contentWidth - 13;
      while (wIdx < words.length) {
        const test = restLine ? restLine + ' ' + words[wIdx] : words[wIdx];
        if (getTextWidth(test, 8.5, false) > fullLineWidth && restLine) {
          doc.text(restLine, indent, y - 5, { font: 'F1', size: 8.5, color: BODY });
          y -= 11;
          restLine = words[wIdx];
        } else {
          restLine = test;
        }
        wIdx++;
      }
      if (restLine) {
        doc.text(restLine, indent, y - 5, { font: 'F1', size: 8.5, color: BODY });
        y -= 11;
      }
    }
    y -= 3;
  }

  // Project 1: ScholarSphere
  drawProject(
    'ScholarSphere',
    'Global Scholarship & Admissions Gateway',
    'React, Node.js, Express.js, MongoDB, Tailwind CSS, Stripe, Firebase Auth',
    [
      {
        prefix: 'Scholarship Engine: ',
        text: 'Engineered scholarship discovery platform with an eligibility calculator surfacing match scores based on GPA and test metrics.'
      },
      {
        prefix: 'Payments & RBAC: ',
        text: 'Integrated Stripe checkout for processing application fees and implemented role-based workflows for Students, Reviewers, and Admins.'
      }
    ],
    'https://scholarsphere.vercel.app',
    'https://github.com/saikat20034/scholarsphere-client'
  );

  // Project 2: Smart Mess Manager
  drawProject(
    'Smart Mess Manager',
    'Hostel & Shared Living Expense ERP',
    'React, Node.js, Express.js, Supabase, PostgreSQL, Tailwind CSS',
    [
      {
        prefix: 'Automated Ledger: ',
        text: 'Automated meal scheduling and dynamic meal rate computation eliminating manual calculation errors for university flat residents.'
      },
      {
        prefix: 'Financial Audit: ',
        text: 'Implemented transparent dual-column grocery/utility ledger with bKash and Nagad deposit logging requiring manager audit approval.'
      }
    ],
    'https://smart-mess-manager.surge.sh',
    'https://github.com/saikat20034/smart-mess-manager-frontend'
  );

  // Project 3: TradeNest
  drawProject(
    'TradeNest',
    'B2B E-Commerce Marketplace',
    'React, Node.js, Express.js, MongoDB, Tailwind CSS, JWT Auth, Stripe',
    [
      {
        prefix: 'B2B Marketplace: ',
        text: 'Architected multi-vendor trading platform with live inventory synchronization, order management, and secure Stripe checkout.'
      },
      {
        prefix: 'Security Architecture: ',
        text: 'Enforced stateless JWT authentication and role-based guards protecting vendor endpoints and sensitive commercial transactions.'
      }
    ],
    null,
    'https://github.com/saikat20034/TradeNest'
  );

  // Additional projects one-liner (clean commas and parentheses)
  doc.text('Other Projects:', leftX + 8, y - 1, { font: 'F2', size: 8.3, color: MUTED });
  doc.text(
    'HotelHive (hotel booking & room reservation system), VisaLand (international visa guidance and application tracking portal)',
    leftX + 76,
    y - 1,
    { font: 'F1', size: 8.3, color: BODY }
  );
  y -= 15;

  // -------------------------------------------------------------------------
  // 5. EDUCATION
  // -------------------------------------------------------------------------
  drawSectionHeading('Education');

  function drawEducation(degree, institute, resultOrStatus, year, isAppeared = false) {
    doc.text(degree, leftX, y, { font: 'F2', size: 9.4, color: PRIMARY });
    const degW = getTextWidth(degree, 9.4, true);

    if (isAppeared) {
      doc.setFillColor(0.92, 0.98, 0.94);
      doc.setStrokeColor(...BADGE_GREEN);
      doc.setLineWidth(0.5);
      doc.roundedRect(leftX + degW + 5, y - 6.5, 48, 9.5, 2, true, true);
      doc.text('APPEARED', leftX + degW + 8, y - 4.8, { font: 'F2', size: 7.0, color: BADGE_GREEN });
    }

    doc.text(year, rightX - getTextWidth(year, 8.6, true), y, { font: 'F2', size: 8.6, color: MUTED });
    y -= 10;

    doc.text(institute, leftX, y, { font: 'F1', size: 8.6, color: BODY });
    const resText = isAppeared ? 'Result Awaiting (Final Exams Appeared)' : `Result: ${resultOrStatus}`;
    doc.text(resText, rightX - getTextWidth(resText, 8.5, false), y, {
      font: isAppeared ? 'F2' : 'F1',
      size: 8.5,
      color: isAppeared ? BADGE_GREEN : PRIMARY,
    });
    y -= 12;
  }

  drawEducation(
    'M.Sc. in Information and Communication Technology',
    'Mawlana Bhashani Science and Technology University (MBSTU), Tangail, Bangladesh',
    'Appeared',
    '2025 - Present',
    true
  );

  drawEducation(
    'B.Sc. (Honours) in Information and Communication Technology',
    'Mawlana Bhashani Science and Technology University (MBSTU), Tangail, Bangladesh',
    'CGPA 3.07 / 4.00',
    '2020 - 2025',
    false
  );

  drawEducation(
    'Higher Secondary Certificate (H.S.C.) - Science Group',
    'Govt. Debendra College, Manikganj, Dhaka Board',
    'GPA 4.25 / 5.00',
    '2018',
    false
  );

  drawEducation(
    'Secondary School Certificate (S.S.C.) - Science Group',
    'Daragram High School, Manikganj, Dhaka Board',
    'GPA 4.89 / 5.00',
    '2016',
    false
  );
  y -= 4;

  // -------------------------------------------------------------------------
  // 6. TRAINING & CERTIFICATIONS
  // -------------------------------------------------------------------------
  drawSectionHeading('Professional Training & Certifications');

  function drawCertification(title, issuer, date, desc) {
    doc.text(title, leftX, y, { font: 'F2', size: 9.3, color: PRIMARY });
    doc.text(date, rightX - getTextWidth(date, 8.5, true), y, { font: 'F2', size: 8.5, color: LINK });
    y -= 9.5;

    doc.text(issuer, leftX, y, { font: 'F2', size: 8.4, color: MUTED });
    y -= 9;

    doc.text(desc, leftX, y, { font: 'F1', size: 8.3, color: BODY });
    y -= 12;
  }

  drawCertification(
    'Database (MySQL / Oracle / SQL) Professional Training (80 Hours)',
    'Dept. of ICT, MBSTU (EDGE Project, Bangladesh Computer Council, ICT Division)',
    'Dec 2024 - Jul 2025',
    'Advanced relational modeling, 3NF normalization, index optimization, complex joins, triggers, stored procedures, and ACID transactions.'
  );

  drawCertification(
    'Complete Web Development Course (MERN Stack)',
    'Programming Hero (Batch 10)',
    'Dec 2023 - Jun 2024',
    'Intensive training in MongoDB, Express.js, React, Node.js, RESTful APIs, Firebase Authentication, and production deployments.'
  );
  y -= 4;

  // -------------------------------------------------------------------------
  // 7. CORE COMPETENCIES & PROFESSIONAL ATTRIBUTES
  // -------------------------------------------------------------------------
  drawSectionHeading('Core Competencies & Professional Attributes');

  const competencies = [
    { name: 'Analytical Problem Solving', desc: 'Translating complex operational workflows into maintainable, modular software solutions.' },
    { name: 'Database Architecture', desc: 'Relational schema normalization, NoSQL document modeling, indexing, and data integrity.' },
    { name: 'Documentation & Compliance', desc: 'Rigorous attention to detail in technical documentation, API specifications, and process audits.' },
  ];

  for (const c of competencies) {
    doc.setFillColor(...LINK);
    doc.rect(leftX + 2, y - 5.5, 2.2, 2.2, true, false);

    doc.text(`${c.name}:`, leftX + 8, y - 6.5, { font: 'F2', size: 8.6, color: PRIMARY });
    const nW = getTextWidth(`${c.name}:`, 8.6, true);
    doc.text(c.desc, leftX + 12 + nW, y - 6.5, { font: 'F1', size: 8.4, color: BODY });
    y -= 11.5;
  }

  // Bottom Footer
  y -= 2;
  doc.setStrokeColor(...LINE);
  doc.setLineWidth(0.5);
  doc.line(leftX, 26, rightX, 26);
  doc.text('Md. Mazharul Islam | Full-Stack Developer Resume | Single-Page ATS Edition', leftX, 17, { font: 'F1', size: 7.8, color: MUTED });
  doc.text('Verified & Updated November 2026', rightX - 138, 17, { font: 'F1', size: 7.8, color: MUTED });

  return doc.compile();
}

// CLI Execution
const pdfBuffer = buildSinglePageResume();
const rootDir = path.resolve(__dirname, '..');
const publicPath = path.resolve(rootDir, 'public/resume/Mazharul_Islam_Resume.pdf');
const distPath = path.resolve(rootDir, 'dist/resume/Mazharul_Islam_Resume.pdf');

fs.mkdirSync(path.dirname(publicPath), { recursive: true });
fs.writeFileSync(publicPath, pdfBuffer);
console.log(`Successfully generated 1-page ATS resume: ${publicPath} (${pdfBuffer.length} bytes)`);

if (fs.existsSync(path.dirname(distPath))) {
  fs.writeFileSync(distPath, pdfBuffer);
  console.log(`Successfully synced dist resume: ${distPath} (${pdfBuffer.length} bytes)`);
}
