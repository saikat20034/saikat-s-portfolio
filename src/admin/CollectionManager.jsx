import { useState } from 'react';
import { FaTrash, FaPencilAlt, FaPlus, FaTimes } from 'react-icons/fa';
import { useAdminCollection } from '../firebase/useAdminCollection';
import { addItem, updateItem, deleteItem } from '../firebase/firestoreService';

const emptyFromFields = (fields) =>
  Object.fromEntries(fields.map((f) => [f.key, f.type === 'array' ? '' : '']));

/**
 * fields: [{ key, label, type: 'text' | 'textarea' | 'array' }]
 *   'array' fields are edited as one line per item, split on submit.
 */
export default function CollectionManager({ collectionName, title, fields, itemLabel }) {
  const { items, loading, error } = useAdminCollection(collectionName);
  const [form, setForm] = useState(emptyFromFields(fields));
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setForm(emptyFromFields(fields));
    setEditingId(null);
    setFormError('');
  };

  const startEdit = (item) => {
    const next = {};
    for (const f of fields) {
      const val = item[f.key];
      next[f.key] = f.type === 'array' ? (Array.isArray(val) ? val.join('\n') : '') : val || '';
    }
    setForm(next);
    setEditingId(item.id);
    setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toPayload = () => {
    const payload = {};
    for (const f of fields) {
      if (f.type === 'array') {
        payload[f.key] = form[f.key]
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean);
      } else {
        payload[f.key] = form[f.key].trim();
      }
    }
    return payload;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const requiredMissing = fields.some(
      (f) => f.required !== false && f.type !== 'array' && !form[f.key]?.trim()
    );
    if (requiredMissing) {
      setFormError('Please fill in all required fields.');
      return;
    }
    setSaving(true);
    try {
      const payload = toPayload();
      if (editingId) {
        await updateItem(collectionName, editingId, payload);
      } else {
        await addItem(collectionName, payload, items.length);
      }
      resetForm();
    } catch (err) {
      setFormError(err.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm(`Delete this ${itemLabel}?`)) return;
    await deleteItem(collectionName, id);
    if (editingId === id) resetForm();
  };

  return (
    <div>
      <h2 className="font-display font-semibold text-2xl text-paper mb-6">{title}</h2>

      <form
        onSubmit={onSubmit}
        className="border border-ink-700 bg-ink-800/40 p-6 mb-8 space-y-4"
      >
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-widest text-brass-500">
            {editingId ? `Edit ${itemLabel}` : `Add ${itemLabel}`}
          </p>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-muted hover:text-paper text-xs inline-flex items-center gap-1 focus-ring"
            >
              <FaTimes /> Cancel edit
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.key} className={f.type !== 'text' ? 'sm:col-span-2' : ''}>
              <label className="block font-mono text-xs uppercase tracking-widest text-muted mb-2">
                {f.label} {f.type === 'array' && <span className="normal-case">(one per line)</span>}
              </label>
              {f.type === 'textarea' || f.type === 'array' ? (
                <textarea
                  rows={f.type === 'array' ? 4 : 3}
                  value={form[f.key]}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className="w-full bg-ink-900 border border-ink-600 px-3 py-2 text-sm text-paper focus-ring"
                />
              ) : (
                <input
                  type="text"
                  value={form[f.key]}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className="w-full bg-ink-900 border border-ink-600 px-3 py-2 text-sm text-paper focus-ring"
                />
              )}
            </div>
          ))}
        </div>

        {formError && <p className="text-red-400 text-sm font-mono">{formError}</p>}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-brass-500 text-ink-900 font-semibold px-5 py-2.5 hover:bg-brass-400 transition-colors focus-ring disabled:opacity-60"
        >
          <FaPlus className="text-xs" /> {saving ? 'Saving…' : editingId ? 'Save Changes' : `Add ${itemLabel}`}
        </button>
      </form>

      {loading && <p className="font-mono text-sm text-muted">Loading…</p>}
      {error && <p className="font-mono text-sm text-red-400">Error: {error}</p>}

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-ink-700 p-4 flex items-start justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="text-paper font-semibold text-sm">
                {item[fields[0].key]}
              </p>
              {fields[1] && (
                <p className="text-muted text-xs mt-1 truncate">
                  {Array.isArray(item[fields[1].key])
                    ? item[fields[1].key].join(' · ')
                    : item[fields[1].key]}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => startEdit(item)}
                aria-label="Edit"
                className="w-9 h-9 grid place-items-center border border-ink-600 text-muted hover:text-brass-500 hover:border-brass-500 transition-colors focus-ring"
              >
                <FaPencilAlt className="text-xs" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                aria-label="Delete"
                className="w-9 h-9 grid place-items-center border border-ink-600 text-muted hover:text-red-400 hover:border-red-400 transition-colors focus-ring"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className="text-muted text-sm font-mono">
            No {itemLabel} entries yet — the public site is showing default content until you add some.
          </p>
        )}
      </div>
    </div>
  );
}
