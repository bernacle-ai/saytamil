'use client';

import { useState } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const topics = ['Bug report', 'Feature request', 'Grammar correction feedback', 'Partnership / integration', 'School or institution plan', 'Press / media', 'Other'];

const inputCls = 'w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400 transition-all';

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    await new Promise(r => setTimeout(r, 1200));
    setStatus('sent');
  };

  if (status === 'sent') {
    return (
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-10 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h3>
        <p className="text-gray-500 text-sm">We&apos;ll get back to you within 24 hours.</p>
        <button onClick={() => { setForm({ name: '', email: '', topic: '', message: '' }); setStatus('idle'); }}
          className="mt-6 text-sm text-teal-600 hover:underline">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 space-y-5 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Name</label>
          <input type="text" value={form.name} onChange={set('name')} required placeholder="Your name" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
          <input type="email" value={form.email} onChange={set('email')} required placeholder="you@example.com" className={inputCls} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Topic</label>
        <select value={form.topic} onChange={set('topic')} className={inputCls}>
          <option value="">Select a topic...</option>
          {topics.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Message</label>
        <textarea value={form.message} onChange={set('message')} required rows={6}
          placeholder="Describe your question or feedback. You can write in Tamil too — தமிழிலும் எழுதலாம்."
          className={'font-tamil resize-none ' + inputCls} />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-500">Something went wrong. Please email us at hello@saytamil.com</p>
      )}

      <button type="submit" disabled={status === 'sending'}
        className="w-full font-semibold py-3 rounded-xl text-sm text-white transition-all disabled:opacity-50 hover:opacity-90"
        style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)', boxShadow: '0 4px 20px rgba(0,212,180,0.20)' }}>
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>

      <p className="text-xs text-gray-400 text-center">We typically respond within 24 hours on weekdays.</p>
    </form>
  );
}
