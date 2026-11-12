/**
 * Professional PDF Resume Generator for Md. Mazharul Islam
 * Produces an executive, 2-page, ATS-friendly vector PDF with clickable links,
 * modern typography, clean visual dividers, and exact metric spacing.
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
  'y': 500, 'z': 500, '{': 334, '|': 260, '}': 334, '~': 584, '•': 400, '·': 278,
  '–': 556, '—': 1000
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
  return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

class PdfDoc {
  constructor() {
    this.pages = [];
    this.currentPage = null;
    this.width = 595.28; // A4 Width in pt
    this.height = 841.89; // A4 Height in pt
    this.objects = [];
  }

  addPage() {
    const page = {
      stream: [],
      annots: [],
      cursorY: this.height - 36,
      leftMargin: 38,
      rightMargin: 38,
      usableWidth: this.width - 76,
    };
    this.pages.push(page);
    this.currentPage = page;
    return page;
  }

  // Drawing primitives
  setFillColor(r, g, b) {
    this.currentPage.stream.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`);
  }

  setStrokeColor(r, g, b) {
    this.currentPage.stream.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG`);
  }

  setLineWidth(w) {
    this.currentPage.stream.push(`${w.toFixed(2)} w`);
  }

  rect(x, y, w, h, fill = true, stroke = false) {
    const op = fill && stroke ? 'B' : fill ? 'f' : 'S';
    this.currentPage.stream.push(`${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re ${op}`);
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
    this.currentPage.stream.push(cmds.join(' '));
  }

  line(x1, y1, x2, y2) {
    this.currentPage.stream.push(`${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
  }

  addLink(x, y, w, h, url) {
    this.currentPage.annots.push({
      rect: [x, y, x + w, y + h],
      url: url,
    });
  }

  // Text rendering
  text(str, x, y, options = {}) {
    const {
      font = 'F1',
      size = 10,
      color = [0, 0, 0],
      link = null,
    } = options;

    const [r, g, b] = color;
    const escaped = escapePdfString(str);
    this.currentPage.stream.push(
      `BT /${font} ${size} Tf ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${escaped}) Tj ET`
    );

    const isBold = font === 'F2' || font === 'F4';
    const textW = getTextWidth(str, size, isBold);

    if (link) {
      this.addLink(x, y - 2, textW, size + 3, link);
    }

    return textW;
  }

  // Paragraph text wrapping
  wrappedText(str, x, y, maxWidth, options = {}) {
    const { font = 'F1', size = 8.6, lineHeight = 11.5, color = [0.15, 0.15, 0.15] } = options;
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

  // Build binary PDF
  compile() {
    let objCounter = 1;
    const catalogObjId = objCounter++;
    const pagesObjId = objCounter++;
    const font1Id = objCounter++;
    const font2Id = objCounter++;
    const font3Id = objCounter++;
    const font4Id = objCounter++;

    const pageObjIds = [];
    const contentObjIds = [];
    const annotObjMap = [];

    for (let i = 0; i < this.pages.length; i++) {
      pageObjIds.push(objCounter++);
      contentObjIds.push(objCounter++);
      const annotIds = [];
      for (let j = 0; j < this.pages[i].annots.length; j++) {
        annotIds.push(objCounter++);
      }
      annotObjMap.push(annotIds);
    }

    const objects = new Map();

    // Catalog & Pages
    objects.set(catalogObjId, `<< /Type /Catalog /Pages ${pagesObjId} 0 R >>`);
    objects.set(
      pagesObjId,
      `<< /Type /Pages /Kids [${pageObjIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${this.pages.length} >>`
    );

    // Standard Fonts
    objects.set(font1Id, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`);
    objects.set(font2Id, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`);
    objects.set(font3Id, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>`);
    objects.set(font4Id, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-BoldOblique /Encoding /WinAnsiEncoding >>`);

    // Individual Pages
    for (let i = 0; i < this.pages.length; i++) {
      const pageId = pageObjIds[i];
      const contentId = contentObjIds[i];
      const annotIds = annotObjMap[i];

      const annotsEntry =
        annotIds.length > 0 ? `/Annots [${annotIds.map((id) => `${id} 0 R`).join(' ')}]` : '';

      objects.set(
        pageId,
        `<< /Type /Page /Parent ${pagesObjId} 0 R /MediaBox [0 0 ${this.width.toFixed(2)} ${this.height.toFixed(2)}] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${font1Id} 0 R /F2 ${font2Id} 0 R /F3 ${font3Id} 0 R /F4 ${font4Id} 0 R >> >> ${annotsEntry} >>`
      );

      const streamText = this.pages[i].stream.join('\n');
      const streamBuffer = Buffer.from(streamText, 'utf8');
      const compressed = zlib.deflateSync(streamBuffer);

      objects.set(
        contentId,
        `<< /Length ${compressed.length} /Filter /FlateDecode >>\nstream\n` +
          compressed.toString('latin1') +
          '\nendstream'
      );

      for (let j = 0; j < this.pages[i].annots.length; j++) {
        const annotId = annotIds[j];
        const annot = this.pages[i].annots[j];
        const [x1, y1, x2, y2] = annot.rect;
        const uriEscaped = escapePdfString(annot.url);
        objects.set(
          annotId,
          `<< /Type /Annot /Subtype /Link /Rect [${x1.toFixed(2)} ${y1.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}] /Border [0 0 0] /A << /S /URI /URI (${uriEscaped}) >> >>`
        );
      }
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
// Build Md. Mazharul Islam's Resume
// -----------------------------------------------------------------------------------------
export function buildResumePdf() {
  const doc = new PdfDoc();
  const leftX = 38;
  const contentWidth = 519.28;
  const rightX = leftX + contentWidth;

  // Color Palette
  const NAVY = [0.06, 0.12, 0.22];         // #0F1F38 Deep Slate Navy
  const ACCENT = [0.12, 0.42, 0.85];       // #1F6BD9 Royal Tech Blue
  const DARK = [0.12, 0.16, 0.22];         // #1E293B Dark Charcoal Body
  const SLATE = [0.35, 0.42, 0.52];        // #5A6B85 Subtitle / Meta Gray
  const LIGHT_BORDER = [0.86, 0.89, 0.93]; // Border gray
  const BG_TAG = [0.93, 0.95, 0.98];       // Light blue tag background
  const TEXT_TAG = [0.09, 0.32, 0.65];     // Dark tag text
  const GREEN_BADGE = [0.05, 0.55, 0.32];  // Emerald for "Appeared"

  // =========================================================================================
  // PAGE 1
  // =========================================================================================
  doc.addPage();
  let y = doc.height - 36;

  // Header Banner Card
  doc.setFillColor(...NAVY);
  doc.roundedRect(leftX, y - 76, contentWidth, 76, 5, true, false);

  // Top Accent Line
  doc.setFillColor(...ACCENT);
  doc.roundedRect(leftX, y - 4, contentWidth, 4, 2, true, false);

  // Name
  doc.text('MD. MAZHARUL ISLAM (SAIKAT)', leftX + 16, y - 26, {
    font: 'F2',
    size: 18,
    color: [1, 1, 1],
  });

  // Title / Subtitle
  doc.text('ICT Graduate  ·  Full-Stack (MERN) Developer  ·  Database Specialist', leftX + 16, y - 41, {
    font: 'F2',
    size: 10,
    color: [0.72, 0.84, 0.98],
  });

  // Contact Strip inside Header Card
  const cY = y - 60;
  doc.text('Manikganj, Dhaka, Bangladesh', leftX + 16, cY, {
    font: 'F1',
    size: 8.5,
    color: [0.85, 0.9, 0.96],
  });

  doc.text('|', leftX + 144, cY, { font: 'F1', size: 8.5, color: [0.4, 0.5, 0.65] });

  doc.text('mazharulislamsaikat2000@gmail.com', leftX + 152, cY, {
    font: 'F1',
    size: 8.5,
    color: [0.9, 0.94, 1.0],
    link: 'mailto:mazharulislamsaikat2000@gmail.com',
  });

  doc.text('|', leftX + 307, cY, { font: 'F1', size: 8.5, color: [0.4, 0.5, 0.65] });

  doc.text('+880 1630 496007', leftX + 315, cY, {
    font: 'F1',
    size: 8.5,
    color: [0.9, 0.94, 1.0],
    link: 'tel:+8801630496007',
  });

  doc.text('|', leftX + 400, cY, { font: 'F1', size: 8.5, color: [0.4, 0.5, 0.65] });

  doc.text('WhatsApp: +880 1630 496007', leftX + 408, cY, {
    font: 'F1',
    size: 8.5,
    color: [0.9, 0.94, 1.0],
    link: 'https://wa.me/8801630496007',
  });

  y -= 90;

  // Social Links Pill Bar
  doc.setFillColor(0.97, 0.98, 1.0);
  doc.setStrokeColor(...LIGHT_BORDER);
  doc.setLineWidth(0.75);
  doc.roundedRect(leftX, y - 17, contentWidth, 19, 3, true, true);

  doc.text('GitHub:  github.com/saikat20034', leftX + 14, y - 12, {
    font: 'F2',
    size: 8.5,
    color: ACCENT,
    link: 'https://github.com/saikat20034',
  });

  doc.text('|', leftX + 158, y - 12, { font: 'F1', size: 8.5, color: LIGHT_BORDER });

  doc.text('LinkedIn:  linkedin.com/in/md-mazharul-islam-saikat-65bab2299', leftX + 170, y - 12, {
    font: 'F2',
    size: 8.5,
    color: ACCENT,
    link: 'https://www.linkedin.com/in/md-mazharul-islam-saikat-65bab2299/',
  });

  doc.text('|', leftX + 418, y - 12, { font: 'F1', size: 8.5, color: LIGHT_BORDER });

  doc.text('Portfolio:  saikat20034.github.io', leftX + 428, y - 12, {
    font: 'F2',
    size: 8.5,
    color: ACCENT,
    link: 'https://github.com/saikat20034',
  });

  y -= 26;

  // Section Header Helper
  function drawSectionHeader(title) {
    doc.setFillColor(...NAVY);
    doc.text(title.toUpperCase(), leftX, y, { font: 'F2', size: 10.5, color: NAVY });
    doc.setStrokeColor(...ACCENT);
    doc.setLineWidth(1.2);
    doc.line(leftX, y - 3, leftX + 32, y - 3);
    doc.setStrokeColor(...LIGHT_BORDER);
    doc.setLineWidth(0.6);
    doc.line(leftX + 36, y - 3, rightX, y - 3);
    y -= 13;
  }

  // Multi-line bullet helper with aligned wrapping
  function drawBullet(prefix, text) {
    doc.setFillColor(...ACCENT);
    doc.rect(leftX + 4, y - 5, 2.5, 2.5, true, false);

    const indent = leftX + 12;
    const prefixW = prefix ? getTextWidth(prefix, 8.4, true) : 0;

    if (prefix) {
      doc.text(prefix, indent, y - 6, { font: 'F2', size: 8.4, color: NAVY });
    }

    const words = text.split(' ');
    let line1 = '';
    let wordIdx = 0;
    const firstLineWidth = contentWidth - 14 - prefixW;

    while (wordIdx < words.length) {
      const test = line1 ? line1 + ' ' + words[wordIdx] : words[wordIdx];
      if (getTextWidth(test, 8.4, false) > firstLineWidth && line1) {
        break;
      }
      line1 = test;
      wordIdx++;
    }

    doc.text(line1, indent + prefixW, y - 6, { font: 'F1', size: 8.4, color: DARK });
    y -= 11;

    // Remaining lines aligned to indent
    let restLine = '';
    const fullLineWidth = contentWidth - 14;
    while (wordIdx < words.length) {
      const test = restLine ? restLine + ' ' + words[wordIdx] : words[wordIdx];
      if (getTextWidth(test, 8.4, false) > fullLineWidth && restLine) {
        doc.text(restLine, indent, y - 6, { font: 'F1', size: 8.4, color: DARK });
        y -= 11;
        restLine = words[wordIdx];
      } else {
        restLine = test;
      }
      wordIdx++;
    }
    if (restLine) {
      doc.text(restLine, indent, y - 6, { font: 'F1', size: 8.4, color: DARK });
      y -= 11;
    }
    y -= 1;
  }

  function drawProjectHeader(title, subtitle, liveUrl, liveLabel, codeUrl, codeLabel, stack) {
    doc.text(title, leftX, y, { font: 'F2', size: 9.8, color: NAVY });
    const titleW = getTextWidth(title, 9.8, true);

    doc.text(`—  ${subtitle}`, leftX + titleW + 5, y, { font: 'F1', size: 8.6, color: SLATE });

    let curRight = rightX;
    if (codeUrl) {
      const codeW = getTextWidth(codeLabel, 8.2, true);
      curRight -= codeW;
      doc.text(codeLabel, curRight, y, { font: 'F2', size: 8.2, color: ACCENT, link: codeUrl });
      curRight -= 8;
      doc.text('|', curRight, y, { font: 'F1', size: 8.2, color: LIGHT_BORDER });
      curRight -= 6;
    }
    if (liveUrl) {
      const liveW = getTextWidth(liveLabel, 8.2, true);
      curRight -= liveW;
      doc.text(liveLabel, curRight, y, { font: 'F2', size: 8.2, color: ACCENT, link: liveUrl });
    }

    y -= 10.5;

    // Tech Stack Pill Bar
    doc.setFillColor(...BG_TAG);
    doc.roundedRect(leftX, y - 8.5, contentWidth, 11.5, 2, true, false);
    doc.text(`Stack:  ${stack}`, leftX + 6, y - 5.5, { font: 'F2', size: 7.7, color: TEXT_TAG });
    y -= 13;
  }

  // 1. PROFESSIONAL SUMMARY
  drawSectionHeader('Professional Summary');
  const summaryText =
    'ICT graduate from Mawlana Bhashani Science and Technology University (MBSTU), having appeared for an M.Sc. in ICT at the same institution. Dedicated Full-Stack Developer specializing in the MERN stack (MongoDB, Express.js, React, Node.js), JavaScript (ES6+), and Tailwind CSS, backed by formal professional database training (MySQL/Oracle/SQL under the EDGE Project, BCC). Proven track record architecting and deploying end-to-end web applications featuring role-based access control, Stripe payment gateways, and responsive dashboards. Prepared to apply structured analytical problem solving and technical fluency to fast-paced software engineering, administration, and digital operations.';

  const { endY: sEndY } = doc.wrappedText(summaryText, leftX, y, contentWidth, {
    font: 'F1',
    size: 8.6,
    lineHeight: 11.8,
    color: DARK,
  });
  y = sEndY - 6;

  // 2. TECHNICAL SKILLS
  drawSectionHeader('Technical Skills');

  const skillCategories = [
    { label: 'Frontend', items: 'React.js, JavaScript (ES6+), Tailwind CSS, HTML5, CSS3, Vite, Framer Motion, Axios' },
    { label: 'Backend & APIs', items: 'Node.js, Express.js, RESTful API Architecture, JWT Authentication, Role-Based Access Control' },
    { label: 'Databases & Cloud', items: 'MongoDB (Mongoose), MySQL, Oracle SQL, Supabase, PostgreSQL, Firebase (Auth & Firestore)' },
    { label: 'Payments & Tools', items: 'Stripe Integration, Git, GitHub, VS Code, Postman, Vercel, Netlify, Surge, Chrome DevTools' },
    { label: 'Core Competencies', items: 'Full-Stack Architecture, Database Schema Design, Technical Documentation, Process Compliance' },
  ];

  for (const cat of skillCategories) {
    doc.setFillColor(...ACCENT);
    doc.rect(leftX + 2, y - 5.5, 2.5, 2.5, true, false);

    doc.text(`${cat.label}:`, leftX + 10, y - 6.5, { font: 'F2', size: 8.6, color: NAVY });
    const labelW = getTextWidth(`${cat.label}:`, 8.6, true);
    doc.text(cat.items, leftX + 14 + labelW, y - 6.5, { font: 'F1', size: 8.5, color: DARK });
    y -= 11.8;
  }

  y -= 4;

  // 3. FEATURED FULL-STACK PROJECTS (Top 3 Projects on Page 1)
  drawSectionHeader('Featured Full-Stack Projects');

  // --- 1. ScholarSphere ---
  drawProjectHeader(
    'ScholarSphere',
    'Global Scholarship & Admissions Gateway',
    'https://scholarsphere.vercel.app',
    'Live Demo',
    'https://github.com/saikat20034/scholarsphere-client',
    'GitHub Repo',
    'React · Node.js · Express.js · MongoDB · Tailwind CSS · Stripe · Firebase Auth'
  );
  drawBullet(
    'Scholarship Engine: ',
    'Global fellowship & grant discovery platform with multi-faceted search, country filters, and deadline alerts.'
  );
  drawBullet(
    'Eligibility Scoring: ',
    'Interactive calculator evaluating student GPA, test scores, and field of study to surface match probability.'
  );
  drawBullet(
    'Stripe Integration: ',
    'Seamless checkout processing international application fees with automated transaction receipt dispatch.'
  );
  drawBullet(
    'Role-Based RBAC: ',
    'Separate portals for Applicants (status tracking), Reviewers (scoring rubric), and Admins (application approvals).'
  );

  y -= 3;

  // --- 2. Smart Mess Manager ---
  drawProjectHeader(
    'Smart Mess Manager',
    'Hostel & Shared Living Expense ERP',
    'https://smart-mess-manager.surge.sh',
    'Live Demo',
    'https://github.com/saikat20034/smart-mess-manager-frontend',
    'GitHub Repo',
    'React · Node.js · Express.js · Supabase · PostgreSQL · Tailwind CSS'
  );
  drawBullet(
    'Hostel Management: ',
    'Centralized web ERP automating meal scheduling, grocery (bazar) audits, and monthly utility splits across flatmates.'
  );
  drawBullet(
    'Automated Meal Rate: ',
    'Dynamically computes individual meal costs based on weighted meal units and aggregate grocery expenditures in BDT.'
  );
  drawBullet(
    'Financial Ledger: ',
    'Dual-column ledger tracking individual deposits, running dues, and surplus balances with transparent calculation logs.'
  );
  drawBullet(
    'Payment Audit Trail: ',
    'Members log mobile financial service deposits (bKash & Nagad) which require manager confirmation before balance credit.'
  );

  y -= 3;

  // --- 3. TradeNest ---
  drawProjectHeader(
    'TradeNest',
    'B2B E-Commerce Marketplace',
    null,
    null,
    'https://github.com/saikat20034/TradeNest',
    'GitHub Repo',
    'React · Node.js · Express.js · MongoDB · Tailwind CSS · JWT Auth · Stripe'
  );
  drawBullet(
    'Marketplace Architecture: ',
    'Engineered multi-vendor B2B platform with dedicated access tiers for administrators, merchants, and wholesale buyers.'
  );
  drawBullet(
    'Payments & Orders: ',
    'Integrated Stripe checkout with automated webhook fulfillment, order tracking, and dynamic stock decrementing.'
  );
  drawBullet(
    'Security & RBAC: ',
    'Enforced stateless JWT authentication and authorization middleware protecting private vendor catalog APIs.'
  );

  // Footer Page 1
  doc.setStrokeColor(...LIGHT_BORDER);
  doc.setLineWidth(0.5);
  doc.line(leftX, 26, rightX, 26);
  doc.text('Md. Mazharul Islam  ·  Full-Stack Developer Resume', leftX, 17, { font: 'F1', size: 7.8, color: SLATE });
  doc.text('Page 1 of 2  (Continued on next page)', rightX - 120, 17, { font: 'F1', size: 7.8, color: SLATE });

  // =========================================================================================
  // PAGE 2
  // =========================================================================================
  doc.addPage();
  y = doc.height - 36;

  // Page 2 Header Strip
  doc.setFillColor(...NAVY);
  doc.text('MD. MAZHARUL ISLAM (SAIKAT)', leftX, y, { font: 'F2', size: 10, color: NAVY });
  doc.text('mazharulislamsaikat2000@gmail.com  ·  +880 1630 496007', leftX + 170, y, { font: 'F1', size: 8.5, color: SLATE });
  doc.text('Page 2 of 2', rightX - 44, y, { font: 'F2', size: 8.5, color: ACCENT });

  doc.setStrokeColor(...LIGHT_BORDER);
  doc.setLineWidth(0.6);
  doc.line(leftX, y - 6, rightX, y - 6);
  y -= 17;

  // 4. ADDITIONAL WEB APPLICATIONS
  drawSectionHeader('Additional Web Applications');

  // HotelHive
  drawProjectHeader(
    'HotelHive',
    'Hotel Room Booking & Reservation System',
    null,
    null,
    'https://github.com/saikat20034',
    'GitHub Profile',
    'React · Node.js · Express.js · MongoDB · Tailwind CSS · JWT Auth · REST APIs'
  );
  drawBullet(
    'Booking Pipeline: ',
    'Interactive booking portal with dynamic date range selectors, room availability calendars, and location filtering.'
  );
  drawBullet(
    'Guest Management: ',
    'User dashboard enabling guests to inspect booking history, cancel or reschedule reservations, and view receipts.'
  );

  y -= 2;

  // VisaLand
  drawProjectHeader(
    'VisaLand',
    'International Visa Guidance & Application Portal',
    null,
    null,
    'https://github.com/saikat20034',
    'GitHub Profile',
    'React · Node.js · Express.js · MongoDB · Tailwind CSS · JWT Auth'
  );
  drawBullet(
    'Application Portal: ',
    'Comprehensive international visa catalog outlining requirements, processing times, and online document upload workflows.'
  );
  drawBullet(
    'Status Radar: ',
    'Multi-stage visa status pipeline updating applicants across verification, embassy review, and approval phases.'
  );

  y -= 6;

  // 5. EDUCATION
  drawSectionHeader('Education');

  function drawEducationItem(degree, institute, statusOrResult, period, isAppeared = false) {
    doc.text(degree, leftX, y, { font: 'F2', size: 9.6, color: NAVY });
    const degW = getTextWidth(degree, 9.6, true);

    if (isAppeared) {
      doc.setFillColor(0.9, 0.98, 0.93);
      doc.setStrokeColor(...GREEN_BADGE);
      doc.setLineWidth(0.6);
      doc.roundedRect(leftX + degW + 6, y - 7.5, 50, 10.5, 2, true, true);
      doc.text('APPEARED', leftX + degW + 9, y - 5.5, { font: 'F2', size: 7.2, color: GREEN_BADGE });
    }

    doc.text(period, rightX - getTextWidth(period, 8.6, true), y, { font: 'F2', size: 8.6, color: SLATE });
    y -= 10;

    doc.text(institute, leftX, y, { font: 'F1', size: 8.6, color: DARK });
    const resText = isAppeared ? 'Final Examination Appeared (Result Awaiting)' : `Result: ${statusOrResult}`;
    doc.text(resText, rightX - getTextWidth(resText, 8.5, false), y, {
      font: isAppeared ? 'F2' : 'F1',
      size: 8.5,
      color: isAppeared ? GREEN_BADGE : NAVY,
    });
    y -= 12.5;
  }

  drawEducationItem(
    'Master of Science (M.Sc.) in Information and Communication Technology',
    'Mawlana Bhashani Science and Technology University (MBSTU) — Tangail, Bangladesh',
    'Appeared',
    '2025 – Present',
    true
  );

  drawEducationItem(
    'Bachelor of Science (B.Sc. Honours) in Information and Communication Technology',
    'Mawlana Bhashani Science and Technology University (MBSTU) — Tangail, Bangladesh',
    'CGPA 3.07 / 4.00',
    '2020 – 2025',
    false
  );

  drawEducationItem(
    'Higher Secondary Certificate (H.S.C.) — Science Group',
    'Govt. Debendra College, Manikganj — Board of Intermediate and Secondary Education, Dhaka',
    'GPA 4.25 / 5.00',
    '2018',
    false
  );

  drawEducationItem(
    'Secondary School Certificate (S.S.C.) — Science Group',
    'Daragram High School, Manikganj — Board of Intermediate and Secondary Education, Dhaka',
    'GPA 4.89 / 5.00',
    '2016',
    false
  );

  y -= 4;

  // 6. PROFESSIONAL TRAINING & CERTIFICATIONS
  drawSectionHeader('Professional Training & Certifications');

  function drawCertItem(title, issuer, duration, description) {
    doc.text(title, leftX, y, { font: 'F2', size: 9.4, color: NAVY });
    doc.text(duration, rightX - getTextWidth(duration, 8.5, true), y, { font: 'F2', size: 8.5, color: ACCENT });
    y -= 9.5;

    doc.text(issuer, leftX, y, { font: 'F2', size: 8.5, color: SLATE });
    y -= 9;

    const { endY } = doc.wrappedText(description, leftX, y, contentWidth, {
      font: 'F1',
      size: 8.3,
      lineHeight: 11,
      color: DARK,
    });
    y = endY - 5.5;
  }

  drawCertItem(
    'Database (MySQL / Oracle / SQL) Professional Training (80 Hours)',
    'Dept. of ICT, MBSTU  ·  EDGE Project, Bangladesh Computer Council (BCC), ICT Division',
    'Dec 2024 – Jul 2025',
    'Rigorous 80-hour advanced training covering relational schema modeling, 3NF normalization, index optimization, complex joins, triggers, stored procedures, and ACID transaction safety.'
  );

  drawCertItem(
    'Complete Web Development Course (MERN Stack)',
    'Programming Hero — Web Development Program (Batch 10)',
    'Dec 2023 – Jun 2024',
    'Comprehensive practical bootcamp on the modern MERN stack (MongoDB, Express.js, React, Node.js), Firebase authentication, Tailwind CSS, payment gateways, and production full-stack deployment.'
  );

  y -= 3;

  // 7. INTERPERSONAL & ORGANIZATIONAL STRENGTHS
  drawSectionHeader('Interpersonal & Organizational Strengths');

  const softCompetencies = [
    { title: 'Analytical Problem Solving', desc: 'Break down complex functional requirements into maintainable, modular software solutions.' },
    { title: 'Technical Documentation & Ops', desc: 'Rigorous discipline in API specifications, schema documentation, and process compliance.' },
    { title: 'Agile Collaboration', desc: 'Experienced with Git version control, branch workflows, peer code reviews, and remote coordination.' },
  ];

  for (const comp of softCompetencies) {
    doc.setFillColor(...ACCENT);
    doc.rect(leftX + 2, y - 5, 2.5, 2.5, true, false);
    doc.text(`${comp.title}:`, leftX + 10, y - 6, { font: 'F2', size: 8.5, color: NAVY });
    const cW = getTextWidth(`${comp.title}:`, 8.5, true);
    doc.text(comp.desc, leftX + 14 + cW, y - 6, { font: 'F1', size: 8.4, color: DARK });
    y -= 11.5;
  }

  // Footer Page 2
  doc.setStrokeColor(...LIGHT_BORDER);
  doc.setLineWidth(0.5);
  doc.line(leftX, 26, rightX, 26);
  doc.text('Md. Mazharul Islam  ·  Full-Stack Developer Resume', leftX, 17, { font: 'F1', size: 7.8, color: SLATE });
  doc.text('Page 2 of 2  ·  Verified & Updated November 2026', rightX - 180, 17, { font: 'F1', size: 7.8, color: SLATE });

  return doc.compile();
}

// CLI Execution
const pdfBuffer = buildResumePdf();
const rootDir = path.resolve(__dirname, '..');
const publicPath = path.resolve(rootDir, 'public/resume/Mazharul_Islam_Resume.pdf');
const distPath = path.resolve(rootDir, 'dist/resume/Mazharul_Islam_Resume.pdf');

fs.mkdirSync(path.dirname(publicPath), { recursive: true });
fs.writeFileSync(publicPath, pdfBuffer);
console.log(`Successfully generated public resume: ${publicPath} (${pdfBuffer.length} bytes)`);

if (fs.existsSync(path.dirname(distPath))) {
  fs.writeFileSync(distPath, pdfBuffer);
  console.log(`Successfully synced dist resume: ${distPath} (${pdfBuffer.length} bytes)`);
}
