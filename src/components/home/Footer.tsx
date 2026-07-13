import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <Image src="/saytamil-logo.png" alt="SayTamil Tamil Grammar Checker" width={28} height={28} className="rounded-xl" />
              <span className="text-white font-bold text-lg">SayTamil</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              AI-powered Tamil grammar, explained clearly.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
              style={{ background: 'rgba(0,212,180,0.10)', border: '1px solid rgba(0,212,180,0.25)', color: '#00b89e' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Free plan available
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Product</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/tool" className="hover:text-teal-400 transition-colors">Tool</Link></li>
              <li><Link href="#pricing" className="hover:text-teal-400 transition-colors">Pricing</Link></li>
              <li><span className="text-gray-700">API (coming soon)</span></li>
              <li><span className="text-gray-700">Chrome Extension (coming soon)</span></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Company</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="#" className="hover:text-teal-400 transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-teal-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Legal</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</Link></li>
            </ul>
            <div className="mt-6 flex gap-2 text-sm">
              <button className="text-gray-500 hover:text-teal-400 transition-colors">English</button>
              <span className="text-gray-700">|</span>
              <button className="font-tamil text-gray-500 hover:text-teal-400 transition-colors">தமிழ்</button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-sm text-center text-gray-600">
          © 2025 SayTamil. Made with ❤️ in Chennai.
        </div>
      </div>
    </footer>
  );
}
