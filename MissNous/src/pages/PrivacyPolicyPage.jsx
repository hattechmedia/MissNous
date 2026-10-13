import React, { useEffect } from 'react';
import { Lock, ShieldCheck, ArrowLeft, Mail, Sparkles, EyeOff, CheckCircle } from 'lucide-react';

export default function PrivacyPolicyPage({ onNavigate }) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="bg-[#FDF2F5] text-[#2B2225] min-h-screen font-sans">
      {/* 1. HERO BANNER HEADER */}
      <section className="relative min-h-[380px] sm:min-h-[440px] pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-16 text-center overflow-hidden border-b border-[#F7D6DF]/60 bg-[#2B2225] flex items-center justify-center">
        {/* Hero Background Banner Image */}
        <img
          src="/gpt-16.jpeg"
          alt="Miss Nous Privacy Policy Banner"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-75 scale-100"
        />
        {/* Subtle Luxury Gradient for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225]/85 via-black/45 to-black/35 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#9E3F5C]/25 via-transparent to-[#D4AF6A]/20 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#9E3F5C]/25 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-4 sm:space-y-5 reveal-down">
          {/* Back button */}
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/40 hover:bg-black/60 text-[#FFF9F5] backdrop-blur-md border border-white/25 text-xs font-semibold uppercase tracking-wider transition-all duration-300 mb-2 cursor-pointer shadow-lg hover:shadow-pink-glow/30"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/25 shadow-sm">
            <Lock className="w-3.5 h-3.5 text-[#E8D3A5] animate-pulse" />
            <span className="font-sans text-xs uppercase tracking-[0.25em] font-semibold text-[#FFF9F5]">
              Discretion & Trust
            </span>
          </div>

          <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-medium text-[#FFF9F5] tracking-tight leading-[1.15] drop-shadow-xl">
            Privacy Policy
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#9E3F5C]/50 backdrop-blur-sm border border-[#F7D6DF]/40 text-[#FFF9F5] text-xs font-medium">
              Effective Date: October 13, 2026
            </span>
            <span className="text-[#E8D3A5] text-xs">•</span>
            <span className="text-[#FFF9F5] text-xs font-medium drop-shadow-sm">
              100% Discreet Packaging & Encrypted Data
            </span>
          </div>
        </div>
      </section>

      {/* 2. PRIVACY POLICY CONTENT BODY */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 lg:px-16 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-[#F7D6DF] shadow-luxury p-6 sm:p-12 lg:p-16 space-y-10 text-left">
          
          {/* Quick Summary Callout */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#FDF2F5] border-l-4 border-[#9E3F5C] space-y-2">
            <div className="flex items-center gap-2 text-[#9E3F5C] font-bold text-sm uppercase tracking-wider">
              <EyeOff className="w-4 h-4" />
              <span>In Short</span>
            </div>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              Miss Nous respects your privacy and your need for discretion. We collect only what we need to fulfill your orders and operate our Site, we never sell your personal information, and we ship in plain, unbranded packaging. You can access, correct, or delete your data at any time by emailing <a href="mailto:care@missnous.com" className="text-[#9E3F5C] font-semibold underline">care@missnous.com</a>.
            </p>
          </div>

          {/* Intro */}
          <div className="space-y-4 text-sm sm:text-base text-[#5A4B50] leading-relaxed border-b border-[#F7D6DF]/60 pb-8">
            <p>
              This Privacy Policy explains how Miss Nous Inc. collects, uses, shares, and protects your personal information when you visit missnous.com, place an order, or otherwise interact with us. Because of the intimate nature of our products, we understand that privacy and discretion matter to you, and we treat your information with that in mind.
            </p>
          </div>

          {/* Section 1: Who We Are */}
          <div className="space-y-3">
            <h2 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
              1. Who We Are
            </h2>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              Miss Nous Inc. is the data controller responsible for your personal information.
            </p>
            <div className="p-4 rounded-xl bg-[#FFF9F5] border border-[#E8D3A5] text-sm text-[#5A4B50] space-y-1">
              <p><strong>Address:</strong> 18 Garibaldi Avenue, Newark, New Jersey 07114, United States</p>
              <p><strong>Email:</strong> care@missnous.com</p>
              <p><strong>Phone:</strong> +1 908 977 3004</p>
            </div>
          </div>

          {/* Section 2: Age Restriction */}
          <div className="space-y-3">
            <h2 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
              2. Age Restriction
            </h2>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              Our products are intended only for adults. You must be at least 18 years old, or the age of majority in your location if it is higher, to use this Site or purchase from us. We do not knowingly collect personal information from anyone under 18. If we learn that we have collected information from a minor, we will delete it promptly.
            </p>
          </div>

          {/* Section 3: Information We Collect */}
          <div className="space-y-4">
            <h2 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
              3. Information We Collect
            </h2>
            <div className="space-y-3">
              <h3 className="font-sans text-lg font-bold text-[#2B2225]">
                Information you provide directly:
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-[#5A4B50]">
                <li><strong>Contact details:</strong> Your name, email address, phone number, billing address, and shipping address.</li>
                <li><strong>Order information:</strong> Products purchased, order value, and transaction history.</li>
                <li><strong>Communications:</strong> Inquiries sent via our contact forms, email, or reviews.</li>
              </ul>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="font-sans text-lg font-bold text-[#2B2225]">
                Payment Security:
              </h3>
              <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
                When you make a purchase, payment card details are collected and processed directly by our PCI-compliant third-party payment processor. We never store your full payment card number on our servers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#E8D3A5] space-y-1.5">
              <h3 className="font-sans text-base font-bold text-[#2B2225]">
                Sensitive Information Handling
              </h3>
              <p className="text-sm text-[#5A4B50] leading-relaxed">
                We do not ask for or collect sensitive medical or health details. The fact that you purchase an intimate wellness product is treated with strict confidentiality and never shared beyond order delivery needs.
              </p>
            </div>
          </div>

          {/* Section 4: How We Use Information */}
          <div className="space-y-3">
            <h2 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
              4. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-[#5A4B50]">
              <li>Process, fulfill, and deliver your orders accurately.</li>
              <li>Provide responsive customer care and order status updates.</li>
              <li>Send transactional notifications such as order and shipping confirmations.</li>
              <li>Improve site functionality, product formulations, and shopping experience.</li>
              <li>Detect and prevent fraud and unauthorized account activities.</li>
              <li>Comply with applicable legal, accounting, and consumer protection requirements.</li>
            </ul>
          </div>

          {/* Section 5: Discreet Shipping */}
          <div className="space-y-3">
            <h2 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
              5. Discreet Packaging & Handling
            </h2>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              We understand the sensitive nature of intimate wellness care. All orders are packed in plain, unbranded external boxes or envelopes. The shipping label contains only the necessary courier details with no product descriptions or explicit branding visible from the outside.
            </p>
          </div>

          {/* Section 6: Your Privacy Rights */}
          <div className="space-y-3">
            <h2 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
              6. Your Privacy Rights
            </h2>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              Depending on your jurisdiction (such as GDPR in the EU/UK or CCPA/CPRA in the US), you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-[#5A4B50]">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information.</li>
              <li><strong>Deletion:</strong> Request erasure of your personal data where legally applicable.</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time with one click.</li>
            </ul>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              To exercise any of these rights, simply email us at <a href="mailto:care@missnous.com" className="text-[#9E3F5C] font-semibold underline">care@missnous.com</a>.
            </p>
          </div>

          {/* Section 7: Data Security */}
          <div className="space-y-3">
            <h2 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
              7. Data Security
            </h2>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              We implement industry-standard technical and organizational security measures, including HTTPS encryption, secure server firewalls, and tokenized payment processing, to safeguard your personal data from unauthorized access or disclosure.
            </p>
          </div>

          {/* Contact Footer Box */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-sans text-base font-bold text-[#2B2225]">
                Have Questions Regarding Your Privacy?
              </h4>
              <p className="text-sm text-[#5A4B50]">
                Our dedicated privacy team is available at <a href="mailto:care@missnous.com" className="text-[#9E3F5C] font-semibold underline">care@missnous.com</a>.
              </p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('contact')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-xs uppercase tracking-wider font-bold rounded-full transition-all cursor-pointer whitespace-nowrap"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Us</span>
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
