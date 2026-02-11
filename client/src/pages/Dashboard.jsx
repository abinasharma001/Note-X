import { useEffect, useMemo, useState } from 'react';
import http from '../api/http';
import { useAuth } from '../context/AuthContext';
import ReminderToast from '../components/ReminderToast';

const blankNote = {
  title: '',
  content: '',
  links: '',
  pinned: false,
  reminderAt: '',
  theme: { bgColor: '#ffffff', textColor: '#111827', fontSize: '16px' },
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [sort, setSort] = useState('updated');
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState([]);
  const [bin, setBin] = useState([]);
  const [form, setForm] = useState(blankNote);
  const [editingId, setEditingId] = useState(null);
  const [tasksByNote, setTasksByNote] = useState({});
  const [taskText, setTaskText] = useState({});
  const [toasts, setToasts] = useState([]);

  const themeClass = darkMode ? 'dark' : '';

  const fetchNotes = async () => {
    const { data } = await http.get('/notes', { params: { q: search, sort } });
    setNotes(data);
  };

  const fetchBin = async () => {
    const { data } = await http.get('/notes/recycle/bin');
    setBin(data);
  };

  const checkReminders = async () => {
    const { data } = await http.get('/reminders/due');
    setToasts(data);
  };

  useEffect(() => {
    fetchNotes();
    fetchBin();
    checkReminders();
  }, [sort, search]);

  const saveNote = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      links: form.links.split(',').map((l) => l.trim()).filter(Boolean),
      reminderAt: form.reminderAt || null,
    };

    if (editingId) await http.patch(`/notes/${editingId}`, payload);
    else await http.post('/notes', payload);

    setForm(blankNote);
    setEditingId(null);
    fetchNotes();
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setForm({
      ...note,
      links: (note.links || []).join(', '),
      reminderAt: note.reminderAt ? note.reminderAt.slice(0, 16) : '',
    });
  };

  const loadTasks = async (noteId) => {
    const { data } = await http.get(`/notes/${noteId}/tasks`);
    setTasksByNote((prev) => ({ ...prev, [noteId]: data }));
  };

  const addTask = async (noteId) => {
    const text = taskText[noteId];
    if (!text?.trim()) return;
    await http.post(`/notes/${noteId}/tasks`, { text });
    setTaskText((prev) => ({ ...prev, [noteId]: '' }));
    loadTasks(noteId);
  };

  const toggleTask = async (noteId, task) => {
    await http.patch(`/notes/${noteId}/tasks/${task._id}`, { completed: !task.completed });
    loadTasks(noteId);
  };

  const sortedNotes = useMemo(() => [...notes].sort((a, b) => Number(b.pinned) - Number(a.pinned)), [notes]);

  return (
    <div className={`layout ${themeClass}`}>
      <header>
        <h2>Welcome, {user.username}</h2>
        <div className="actions">
          <button onClick={() => setDarkMode((v) => !v)} type="button">{darkMode ? 'Light' : 'Dark'} mode</button>
          <button onClick={logout} type="button">Logout</button>
        </div>
      </header>

      <section className="panel">
        <h3>{editingId ? 'Edit Note' : 'New Note'}</h3>
        <form onSubmit={saveNote} className="grid-form">
          <input placeholder="Title" value={form.title} required onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Links (comma separated)" value={form.links} onChange={(e) => setForm({ ...form, links: e.target.value })} />
          <input type="datetime-local" value={form.reminderAt} onChange={(e) => setForm({ ...form, reminderAt: e.target.value })} />
          <label>
            <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} /> Pin note
          </label>
          <div className="theme-row">
            <input type="color" value={form.theme.bgColor} onChange={(e) => setForm({ ...form, theme: { ...form.theme, bgColor: e.target.value } })} />
            <input type="color" value={form.theme.textColor} onChange={(e) => setForm({ ...form, theme: { ...form.theme, textColor: e.target.value } })} />
            <input value={form.theme.fontSize} onChange={(e) => setForm({ ...form, theme: { ...form.theme, fontSize: e.target.value } })} placeholder="16px" />
          </div>
          <textarea
            placeholder="Rich text (supports safe HTML)"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={5}
          />
          <button type="submit">Save Note</button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(blankNote); }}>
              Cancel
            </button>
          )}
        </form>
      </section>

      <section className="panel">
        <div className="toolbar">
          <input placeholder="Search notes" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="updated">Latest edited</option>
            <option value="pinned">Pinned first</option>
          </select>
        </div>

        <div className="note-grid">
          {sortedNotes.map((note) => (
            <article key={note._id} className="note-card" style={{ backgroundColor: note.theme.bgColor, color: note.theme.textColor, fontSize: note.theme.fontSize }}>
              <h4>{note.title}</h4>
              <div dangerouslySetInnerHTML={{ __html: note.content }} />
              <small>Updated: {new Date(note.updatedAt).toLocaleString()}</small>
              <div className="actions">
                <button type="button" onClick={() => startEdit(note)}>Edit</button>
                <button type="button" onClick={async () => { await http.patch(`/notes/${note._id}/undo`); fetchNotes(); }}>Undo</button>
                <button type="button" onClick={async () => { await http.patch(`/notes/${note._id}/pin`); fetchNotes(); }}>{note.pinned ? 'Unpin' : 'Pin'}</button>
                <button type="button" onClick={async () => { await http.delete(`/notes/${note._id}`); fetchNotes(); fetchBin(); }}>Delete</button>
              </div>

              <div className="task-box">
                <button type="button" onClick={() => loadTasks(note._id)}>Load Tasks</button>
                <div>
                  {(tasksByNote[note._id] || []).map((task) => (
                    <label key={task._id} className="task-row">
                      <input type="checkbox" checked={task.completed} onChange={() => toggleTask(note._id, task)} />
                      <span>{task.text}</span>
                    </label>
                  ))}
                </div>
                <div className="inline">
                  <input value={taskText[note._id] || ''} onChange={(e) => setTaskText((prev) => ({ ...prev, [note._id]: e.target.value }))} placeholder="New task" />
                  <button type="button" onClick={() => addTask(note._id)}>Add</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h3>Recycle Bin</h3>
        {bin.map((note) => (
          <div key={note._id} className="bin-row">
            <span>{note.title}</span>
            <div className="actions">
              <button type="button" onClick={async () => { await http.patch(`/notes/recycle/${note._id}/restore`); fetchNotes(); fetchBin(); }}>Restore</button>
              <button type="button" onClick={async () => {
                const pin = window.prompt('Enter recycle PIN');
                if (!pin) return;
                await http.post('/recycle/verify-pin', { pin });
                await http.delete(`/notes/recycle/${note._id}/permanent`);
                fetchBin();
              }}>
                Delete permanently
              </button>
            </div>
          </div>
        ))}
      </section>

      <ReminderToast reminders={toasts} onClose={(id) => setToasts((prev) => prev.filter((item) => item._id !== id))} />
    </div>
  );
}
