'use client';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  theme?: 'dark' | 'light';
}

export function StatsCard({ icon, label, value, theme = 'dark' }: StatsCardProps) {
  return (
    <div className={`px-4 py-3 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-100 border-gray-200'} rounded-lg border flex items-center gap-3 hover:scale-105 transition-transform`}>
      <div className="text-2xl">{icon}</div>
      <div>
        <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>{label}</p>
        <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      </div>
    </div>
  );
}
