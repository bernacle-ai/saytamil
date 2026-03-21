import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/home/NavBar';
import { Footer } from '@/components/home/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service — SayTamil',
  description: 'Terms of Service for SayTamil — the rules and conditions for using our Tamil grammar checker.',
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

export default function TermsPage() {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Terms of Service</h1>
            <p className="text-gray-400 text-sm">Effective date: {EFFECTIVE_DATE}</p>
          </div>

          <div className="prose-none">

            <Section title="1. Acceptance of Terms">
              <p>
                By accessing or using SayTamil (&quot;the Service&quot;) at saytamil.com, you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the Service.
              </p>
              <p>
                These Terms apply to all visitors, users, and others who access or use the Service. We reserve the right to update these Terms at any time. Continued use of the Service after changes constitutes acceptance.
              </p>
            </Section>

            <Section title="2. Description of Service">
              <p>SayTamil is an AI-powered Tamil writing assistant that provides:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Tamil grammar and spelling analysis via the Google Gemini AI API</li>
                <li>Transliteration from English phonetics (Tanglish) to Tamil script</li>
                <li>A chat-based interface for iterative writing assistance</li>
                <li>Persistent chat history for registered users</li>
              </ul>
              <p>The Service is provided &quot;as is&quot; and we make no guarantees about the accuracy, completeness, or reliability of AI-generated grammar suggestions.</p>
            </Section>

            <Section title="3. User Accounts">
              <p>To access certain features, you must create an account. You agree to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your password and account</li>
                <li>Notify us immediately of any unauthorised use of your account</li>
                <li>Accept responsibility for all activity that occurs under your account</li>
              </ul>
              <p>We reserve the right to suspend or terminate accounts that violate these Terms.</p>
            </Section>

            <Section title="4. Usage Limits and Plans">
              <p>The Service operates on a tiered plan model:</p>
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700">
                      <th className="text-left px-4 py-3 font-semibold border-b border-gray-200">Plan</th>
                      <th className="text-left px-4 py-3 font-semibold border-b border-gray-200">Daily Analyses</th>
                      <th className="text-left px-4 py-3 font-semibold border-b border-gray-200">History</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr><td className="px-4 py-3">Free</td><td className="px-4 py-3">10 / day</td><td className="px-4 py-3">None</td></tr>
                    <tr><td className="px-4 py-3">Pro</td><td className="px-4 py-3">Unlimited</td><td className="px-4 py-3">30 days</td></tr>
                    <tr><td className="px-4 py-3">Team</td><td className="px-4 py-3">Unlimited</td><td className="px-4 py-3">90 days</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">Attempting to circumvent usage limits (e.g. by creating multiple accounts) is a violation of these Terms and may result in account termination.</p>
            </Section>

            <Section title="5. Acceptable Use">
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Submit content that is unlawful, harmful, threatening, abusive, defamatory, or otherwise objectionable</li>
                <li>Attempt to reverse-engineer, scrape, or extract data from the Service in bulk</li>
                <li>Interfere with or disrupt the integrity or performance of the Service</li>
                <li>Use automated scripts or bots to access the Service without prior written consent</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                <li>Violate any applicable local, national, or international law or regulation</li>
              </ul>
            </Section>

            <Section title="6. Intellectual Property">
              <p>The SayTamil name, logo, website design, and original content are the intellectual property of SayTamil and are protected by applicable copyright and trademark laws.</p>
              <p>You retain ownership of any Tamil text you submit to the Service. By submitting text, you grant us a limited, non-exclusive licence to process it solely for the purpose of providing the Service to you.</p>
              <p>AI-generated grammar suggestions and feedback are provided for your personal use. You may not resell or redistribute them as a standalone product.</p>
            </Section>

            <Section title="7. Disclaimer of Warranties">
              <p>The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, either express or implied, including but not limited to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Accuracy or completeness of AI grammar suggestions</li>
                <li>Uninterrupted or error-free operation</li>
                <li>Fitness for a particular purpose</li>
              </ul>
              <p>Grammar analysis is AI-generated and should be reviewed by a qualified Tamil language expert for critical or formal use cases.</p>
            </Section>

            <Section title="8. Limitation of Liability">
              <p>To the maximum extent permitted by law, SayTamil shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service, including but not limited to loss of data, loss of profits, or reputational harm.</p>
              <p>Our total liability to you for any claim arising from these Terms or the Service shall not exceed the amount you paid us in the 12 months preceding the claim, or ₹500, whichever is greater.</p>
            </Section>

            <Section title="9. Third-Party Services">
              <p>The Service integrates with third-party services including Google Gemini API and Google OAuth. Your use of those services is subject to their respective terms and privacy policies. We are not responsible for the practices of third-party services.</p>
            </Section>

            <Section title="10. Termination">
              <p>We may suspend or terminate your access to the Service at any time, with or without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.</p>
              <p>You may terminate your account at any time by contacting us at <a href="mailto:hello@saytamil.com" className="text-teal-600 hover:underline">hello@saytamil.com</a>. Upon termination, your right to use the Service ceases immediately.</p>
            </Section>

            <Section title="11. Governing Law">
              <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Chennai, Tamil Nadu, India.</p>
            </Section>

            <Section title="12. Contact Us">
              <p>If you have questions about these Terms, please contact us:</p>
              <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm space-y-1">
                <p className="font-semibold text-gray-800">SayTamil</p>
                <p>Chennai, Tamil Nadu, India</p>
                <p>Email: <a href="mailto:hello@saytamil.com" className="text-teal-600 hover:underline">hello@saytamil.com</a></p>
              </div>
            </Section>

          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-teal-600 transition-colors">← Privacy Policy</Link>
            <Link href="/" className="hover:text-teal-600 transition-colors">Back to Home →</Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
