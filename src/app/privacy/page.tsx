import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/home/NavBar';
import { Footer } from '@/components/home/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — SayTamil',
  description: 'Privacy Policy for SayTamil — how we collect, use, and protect your data.',
};

const EFFECTIVE_DATE = 'March 21, 2025';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h2>
      <div className="space-y-3 text-gray-600 leading-relaxed text-[15px]">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen">
      <NavBar />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-600 border border-teal-200 mb-4">
              Legal
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
            <p className="text-gray-400 text-sm">Effective date: {EFFECTIVE_DATE}</p>
          </div>

          <div className="prose-none">

            <Section title="1. Introduction">
              <p>
                SayTamil (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the website saytamil.com and the SayTamil AI writing assistant service (the &quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
              </p>
              <p>
                By using SayTamil, you agree to the collection and use of information in accordance with this policy. If you do not agree, please discontinue use of the Service.
              </p>
            </Section>

            <Section title="2. Information We Collect">
              <p><span className="font-semibold text-gray-800">Account information:</span> When you register, we collect your name, email address, and a hashed password. If you sign in with Google, we receive your name, email, and profile picture from Google.</p>
              <p><span className="font-semibold text-gray-800">Content you submit:</span> Tamil text you submit for grammar analysis is sent to the Google Gemini API for processing. We do not permanently store the raw text of your analyses.</p>
              <p><span className="font-semibold text-gray-800">Chat history:</span> If you are a registered user, your chat sessions and messages are stored in our database to provide persistent history across sessions.</p>
              <p><span className="font-semibold text-gray-800">Usage data:</span> We track the number of analyses you perform per day to enforce plan limits. We also collect standard server logs including IP address, browser type, and pages visited.</p>
              <p><span className="font-semibold text-gray-800">Demo usage:</span> Unauthenticated demo sessions are tracked via a browser session identifier. No personal data is collected for demo usage.</p>
            </Section>

            <Section title="3. How We Use Your Information">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Provide, operate, and maintain the Service</li>
                <li>Authenticate your identity and manage your account</li>
                <li>Enforce daily usage limits based on your plan</li>
                <li>Improve and personalise the Service</li>
                <li>Respond to your support requests and inquiries</li>
                <li>Send transactional emails (e.g. OTP for password reset)</li>
                <li>Monitor for abuse, fraud, and security threats</li>
              </ul>
              <p>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>
            </Section>

            <Section title="4. Third-Party Services">
              <p>We use the following third-party services that may process your data:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><span className="font-semibold text-gray-800">Google Gemini API</span> — processes Tamil text for grammar analysis. Subject to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Google&apos;s Privacy Policy</a>.</li>
                <li><span className="font-semibold text-gray-800">Google OAuth</span> — used for &quot;Sign in with Google&quot;. Subject to Google&apos;s Privacy Policy.</li>
                <li><span className="font-semibold text-gray-800">PostgreSQL hosting provider</span> — stores your account and chat data on secure servers.</li>
                <li><span className="font-semibold text-gray-800">Email provider (nodemailer)</span> — used to send OTP and transactional emails.</li>
              </ul>
            </Section>

            <Section title="5. Data Retention">
              <p>We retain your account data for as long as your account is active. Chat history is retained according to your plan (Free: not retained beyond session, Pro: 30 days, Team: 90 days).</p>
              <p>You may request deletion of your account and associated data at any time by contacting us at <a href="mailto:hello@saytamil.com" className="text-teal-600 hover:underline">hello@saytamil.com</a>. We will process deletion requests within 30 days.</p>
            </Section>

            <Section title="6. Data Security">
              <p>We implement industry-standard security measures including:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Passwords are hashed using bcrypt before storage — we never store plaintext passwords</li>
                <li>All data in transit is encrypted via HTTPS/TLS</li>
                <li>Database connections use SSL with certificate validation</li>
                <li>API keys and secrets are stored as environment variables, never in source code</li>
              </ul>
              <p>No method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.</p>
            </Section>

            <Section title="7. Cookies and Tracking">
              <p>We use session cookies to maintain your authenticated session via NextAuth. We do not use third-party advertising cookies or tracking pixels.</p>
              <p>You can configure your browser to refuse cookies, but this may prevent you from using authenticated features of the Service.</p>
            </Section>

            <Section title="8. Children's Privacy">
              <p>The Service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.</p>
            </Section>

            <Section title="9. Your Rights">
              <p>Depending on your jurisdiction, you may have the right to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict processing of your data</li>
                <li>Data portability</li>
              </ul>
              <p>To exercise any of these rights, contact us at <a href="mailto:hello@saytamil.com" className="text-teal-600 hover:underline">hello@saytamil.com</a>.</p>
            </Section>

            <Section title="10. Changes to This Policy">
              <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the effective date at the top of this page. Continued use of the Service after changes constitutes acceptance of the updated policy.</p>
            </Section>

            <Section title="11. Contact Us">
              <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
              <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm space-y-1">
                <p className="font-semibold text-gray-800">SayTamil</p>
                <p>Chennai, Tamil Nadu, India</p>
                <p>Email: <a href="mailto:hello@saytamil.com" className="text-teal-600 hover:underline">hello@saytamil.com</a></p>
              </div>
            </Section>

          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <Link href="/" className="hover:text-teal-600 transition-colors">← Back to Home</Link>
            <Link href="/terms" className="hover:text-teal-600 transition-colors">Terms of Service →</Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
