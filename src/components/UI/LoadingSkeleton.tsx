'use client';

interface LoadingSkeletonProps {
  theme?: 'dark' | 'light';
}

export function LoadingSkeleton({ theme = 'dark' }: LoadingSkeletonProps) {
  return (
    <div className="space-y-4 animate-pulse">
      <div className={`h-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'} rounded w-3/4`} />
      <div className={`h-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'} rounded w-full`} />
      <div className={`h-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'} rounded w-5/6`} />
    </div>
  );
}
