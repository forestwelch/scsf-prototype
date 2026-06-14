'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-brand-charcoal mb-6">Send a Message</h2>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent!</h3>
          <p className="text-green-700">
            Thank you for reaching out. A board member will get back to you soon.
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-brand-charcoal mb-1" htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </label>
              <input id="firstName" name="firstName" type="text" required
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-royal-blue focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-charcoal mb-1" htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input id="lastName" name="lastName" type="text" required
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-royal-blue focus:border-transparent" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-charcoal mb-1" htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <input id="email" name="email" type="email" required
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-royal-blue focus:border-transparent" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-charcoal mb-1" htmlFor="recipient">
              Direct this message to (optional)
            </label>
            <input id="recipient" name="recipient" type="text" placeholder="Name of SCSF board member"
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-royal-blue focus:border-transparent" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-charcoal mb-1" htmlFor="message">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea id="message" name="message" required rows={6}
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-royal-blue focus:border-transparent resize-y" />
          </div>

          <button type="submit"
            className="bg-brand-royal-blue text-white px-8 py-3 rounded-md font-semibold hover:bg-brand-sky-blue transition-colors">
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
