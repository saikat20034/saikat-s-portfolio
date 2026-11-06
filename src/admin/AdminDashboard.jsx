import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../firebase/AdminAuthContext';
import CollectionManager from './CollectionManager';

const tabs = [
  {
    id: 'skills',
    label: 'Skills',
    itemLabel: 'skill',
    collectionName: 'skills',
    fields: [
      { key: 'name', label: 'Skill name', type: 'text' },
      { key: 'group', label: 'Group (e.g. Frontend, Backend)', type: 'text' },
    ],
  },
  {
    id: 'education',
    label: 'Education',
    itemLabel: 'education entry',
    collectionName: 'education',
    fields: [
      { key: 'level', label: 'Level (e.g. B.Sc., H.S.C.)', type: 'text' },
      { key: 'institution', label: 'Institution', type: 'text' },
      { key: 'program', label: 'Program / Subject', type: 'text' },
      { key: 'result', label: 'Result (e.g. CGPA 3.07/4.00)', type: 'text' },
      { key: 'year', label: 'Year(s)', type: 'text' },
    ],
  },
  {
    id: 'certifications',
    label: 'Certifications',
    itemLabel: 'certification',
    collectionName: 'certifications',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'issuer', label: 'Issuer', type: 'text' },
      { key: 'duration', label: 'Duration / dates', type: 'text' },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    itemLabel: 'project',
    collectionName: 'projects',
    fields: [
      { key: 'name', label: 'Project name', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'highlights', label: 'Highlights', type: 'array' },
      { key: 'stack', label: 'Tech stack', type: 'array' },
      { key: 'image', label: 'Image URL', type: 'text' },
      { key: 'code', label: 'Code (GitHub) URL', type: 'text' },
      { key: 'live', label: 'Live URL', type: 'text' },
    ],
  },
];

export default function AdminDashboard() {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('skills');

  const onLogout = async () => {
    await logout();
    navigate('/admin', { replace: true });
  };

  const activeTab = tabs.find((t) => t.id === active);

  return (
    <div className="min-h-screen bg-ink-900">
      <header className="border-b border-ink-700 bg-ink-800/60">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 grid place-items-center border border-brass-500 text-brass-500 font-mono text-sm">
              MI
            </span>
            <span className="font-mono text-xs tracking-widest uppercase text-muted">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs text-muted">{user?.email}</span>
            <a
              href="/"
              className="font-mono text-xs uppercase tracking-widest border border-ink-600 px-3 py-2 text-paper hover:border-brass-500 hover:text-brass-500 transition-colors"
            >
              View Site
            </a>
            <button
              onClick={onLogout}
              className="font-mono text-xs uppercase tracking-widest border border-ink-600 px-3 py-2 text-paper hover:border-red-400 hover:text-red-400 transition-colors focus-ring"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex flex-wrap gap-2 mb-10 border-b border-ink-700 pb-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`font-mono text-xs uppercase tracking-widest px-4 py-2 border transition-colors focus-ring ${
                active === t.id
                  ? 'border-brass-500 text-brass-500 bg-brass-500/10'
                  : 'border-ink-600 text-muted hover:text-paper'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <CollectionManager
          key={activeTab.id}
          collectionName={activeTab.collectionName}
          title={activeTab.label}
          fields={activeTab.fields}
          itemLabel={activeTab.itemLabel}
        />
      </div>
    </div>
  );
}
