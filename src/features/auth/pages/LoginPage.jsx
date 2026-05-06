import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

export function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <h1 className="text-2xl font-bold text-slate-900">
          Mart Management Login
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Use your backend credentials to continue.
        </p>

        <div className="mt-6 space-y-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none ring-0 transition focus:border-slate-500"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none ring-0 transition focus:border-slate-500"
            required
          />
        </div>

        {error ? <p className="mt-3 text-sm text-rose-500">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-6 w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
