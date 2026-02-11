import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', recycleBinPin: '' });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) await register(form);
      else await login({ username: form.username, password: form.password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <section className="auth-card">
      <h1>Note-X</h1>
      <p>{isRegister ? 'Create a secure account' : 'Login to your notes'}</p>
      <form onSubmit={onSubmit}>
        <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        {isRegister && (
          <input
            placeholder="Recycle PIN (optional, 4-8 digits)"
            value={form.recycleBinPin}
            onChange={(e) => setForm({ ...form, recycleBinPin: e.target.value })}
          />
        )}
        {error && <p className="error">{error}</p>}
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <button className="text-btn" type="button" onClick={() => setIsRegister((v) => !v)}>
        {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
      </button>
    </section>
  );
}
