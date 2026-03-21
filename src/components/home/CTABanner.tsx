import Link from 'next/link';

export function CTABanner() {
  return (
    <section className="py-20 px-4 bg-gray-50 border-y border-gray-200">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Write better Tamil starting today.</h2>
        <p className="text-gray-500 text-lg mb-8">Free. No signup. No download.</p>
        <Link href="/tool"
          className="inline-block font-bold px-10 py-4 rounded-xl text-lg text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)', boxShadow: '0 4px 32px rgba(0,212,180,0.30)' }}>
          Check Your Tamil Now →
        </Link>
      </div>
    </section>
  )
}
