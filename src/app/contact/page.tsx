import type { Metadata } from 'next';
import { NavBar } from '@/components/home/NavBar';
import { Footer } from '@/components/home/Footer';
import { ContactForm } from '@/components/home/ContactForm';

export const metadata: Metadata = {
  title: 'Contact — SayTamil Tamil Grammar Checker',
  description: 'Get in touch with the SayTamil team. Questions, feedback, or partnership inquiries.',
};

export default function ContactPage() {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <NavBar />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Get in Touch</h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Questions, feedback, bug reports, or partnership ideas — we read every message.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-5">Contact Information</h2>
                <div className="space-y-4">
                  {[
                    {
                      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
                      label: 'Email', value: 'hello@saytamil.com', href: 'mailto:hello@saytamil.com',
                    },
                    {
                      icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></>,
                      label: 'Location', value: 'Chennai, Tamil Nadu, India',
                    },
                    {
                      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
                      label: 'Response time', value: 'Within 24 hours on weekdays',
                    },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-teal-50 border border-teal-100">
                        <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">{item.label}</p>
                        {item.href
                          ? <a href={item.href} className="text-sm text-teal-600 hover:underline">{item.value}</a>
                          : <p className="text-sm text-gray-700">{item.value}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-4">Common Topics</h2>
                <div className="space-y-2">
                  {[['🐛','Bug report or incorrect correction'],['💡','Feature request or suggestion'],['🤝','Partnership or integration'],['🏫','School or institution plan'],['📰','Press or media inquiry']].map(([icon, label]) => (
                    <div key={label} className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{icon}</span><span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-5 bg-teal-50 border border-teal-100">
                <p className="font-tamil text-sm font-medium mb-1 text-teal-600">தமிழில் எழுதலாம்</p>
                <p className="text-xs text-gray-500">You can write to us in Tamil — we read and respond in Tamil too.</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
