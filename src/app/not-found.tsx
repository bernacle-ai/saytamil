import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold mb-4"
        style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        404
      </p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
      <div className="flex gap-4">
        <Link href="/" className="font-semibold px-6 py-3 rounded-xl text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)' }}>
          Go Home
        </Link>
        <Link href="/tool" className="border border-gray-200 hover:border-teal-400 text-gray-600 hover:text-teal-600 font-semibold px-6 py-3 rounded-xl transition-colors">
          Open Tool
        </Link>
      </div>
    </div>
  );
}
