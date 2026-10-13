import React, { useEffect } from 'react';
import { ShieldCheck, FileText, ArrowLeft, Mail, AlertCircle, Sparkles } from 'lucide-react';

export default function TermsOfUsePage({ onNavigate }) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="bg-[#FDF2F5] text-[#2B2225] min-h-screen font-sans">
      {/* 1. HERO BANNER HEADER */}
      <section className="relative min-h-[380px] sm:min-h-[440px] pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-16 text-center overflow-hidden border-b border-[#F7D6DF]/60 bg-[#2B2225] flex items-center justify-center">
        {/* Hero Background Banner Image */}
        <img
          src="/gpt-8.jpeg"
          alt="Miss Nous Terms of Use Banner"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 scale-105 filter blur-[0.5px]"
        />
        {/* Ambient Dark, Rose & Gold Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225] via-[#2B2225]/85 to-[#2B2225]/65 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#9E3F5C]/35 via-transparent to-[#D4AF6A]/25 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF6A]/15 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-4 sm:space-y-5 reveal-down">
          {/* Back button */}
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF9F5] backdrop-blur-md border border-white/25 text-xs font-semibold uppercase tracking-wider transition-all duration-300 mb-2 cursor-pointer shadow-lg hover:shadow-pink-glow/30"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#E8D3A5] animate-pulse" />
            <span className="font-sans text-xs uppercase tracking-[0.25em] font-semibold text-[#FFF9F5]">
              Legal & Compliance
            </span>
          </div>

          <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-medium text-[#FFF9F5] tracking-tight leading-[1.15] drop-shadow-lg">
            Terms of Use
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#9E3F5C]/30 border border-[#F7D6DF]/30 text-[#F7D6DF] text-xs font-medium">
              Effective Date: October 13, 2026
            </span>
            <span className="text-[#E8D3A5] text-xs">•</span>
            <span className="text-[#FFF9F5]/80 text-xs font-light">
              Miss Nous Inc. Official Customer Terms
            </span>
          </div>
        </div>
      </section>

      {/* 2. TERMS CONTENT BODY */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 lg:px-16 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-[#F7D6DF] shadow-luxury p-6 sm:p-12 lg:p-16 space-y-10 text-left">
          
          {/* Quick Summary Callout */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#FDF2F5] border-l-4 border-[#9E3F5C] space-y-2">
            <div className="flex items-center gap-2 text-[#9E3F5C] font-bold text-sm uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>In Short</span>
            </div>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              By using missnous.com or buying from us, you agree to these Terms. Our products are for adults 18 and over. They are personal care products, not medicines. Please read the sections on orders, shipping, and returns before you buy, and contact <a href="mailto:care@missnous.com" className="text-[#9E3F5C] font-semibold underline">care@missnous.com</a> if anything is unclear.
            </p>
          </div>

          {/* Intro */}
          <div className="space-y-4 text-sm sm:text-base text-[#5A4B50] leading-relaxed border-b border-[#F7D6DF]/60 pb-8">
            <p>
              Welcome to missnous.com (the &ldquo;Site&rdquo;), operated by Miss Nous Inc. (&ldquo;Miss Nous,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). These Terms of Use (&ldquo;Terms&rdquo;) govern your access to and use of the Site and your purchase of our products. Please read them carefully. By using the Site or placing an order, you agree to these Terms. If you do not agree, please do not use the Site.
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
              1. Age Requirement
            </h2>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              Our products are intimate wellness products intended for adults only. By using this Site or purchasing from us, you confirm that you are at least 18 years old, or the age of majority in your location if it is higher. You also confirm that you are legally able to enter into these Terms. We may refuse or cancel any order where we reasonably believe this requirement is not met.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
              2. About Our Products
            </h2>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              Miss Nous sells water-based, organic-botanical intimate lubricants. Our products are personal care and wellness products. They are not medical devices or medicines and are not intended to diagnose, treat, cure, or prevent any disease or medical condition. Statements on the Site about ingredients, pH, and comfort describe the product and are not medical advice.
            </p>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              If you have a known allergy, a medical condition, are pregnant, or are unsure whether a product is right for you, consult a qualified healthcare professional before use. Always read the ingredient list on the product page and the packaging before use, and stop use if irritation occurs.
            </p>

            <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#E8D3A5] space-y-1.5">
              <h3 className="font-sans text-base font-bold text-[#2B2225]">
                Condom and Material Compatibility
              </h3>
              <p className="text-sm text-[#5A4B50] leading-relaxed">
                Information we provide about compatibility with condoms or other materials is general guidance only. Because products and personal circumstances vary, you are responsible for checking suitability for your own use. Follow the directions and warnings on the product packaging.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
              3. Using the Site
            </h2>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              You agree to use the Site lawfully and not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-[#5A4B50]">
              <li>Use it in any way that breaks applicable law or these Terms.</li>
              <li>Access, tamper with, or disrupt the Site, its servers, or its security.</li>
              <li>Use bots, scrapers, or other automated tools to collect data from the Site without our permission.</li>
              <li>Upload or transmit anything harmful, such as viruses or malicious code.</li>
              <li>Impersonate others or misrepresent your identity or age.</li>
              <li>Infringe our rights or the rights of any other person.</li>
            </ul>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              We may suspend or end your access to the Site if you breach these Terms.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
              4. Accounts & Security
            </h2>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              If you create an account, you are responsible for keeping your login details secure and for all activity under your account. Tell us promptly at <a href="mailto:care@missnous.com" className="text-[#9E3F5C] font-semibold underline">care@missnous.com</a> if you suspect unauthorized use. You must provide accurate and current information and keep it up to date.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
              5. Orders and Pricing
            </h2>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              When you place an order, you make an offer to buy the products in your cart. Your order is accepted only when we send an order confirmation or dispatch the products. We may refuse or cancel an order for reasons including product unavailability, pricing or description errors, suspected fraud, or failure to meet the age requirement.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-[#5A4B50]">
              <li>All prices are shown on the Site and may change at any time before you order.</li>
              <li>We try to keep product descriptions, images, and pricing accurate, but errors can occur. If we find an error in the price or description of a product you ordered, we will contact you and give you the choice to continue at the correct price or cancel.</li>
              <li>You are responsible for any taxes, duties, or customs charges that apply to your order, especially on international shipments.</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="space-y-3">
            <h2 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
              6. Payment
            </h2>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              Payment is processed securely through our third-party payment provider. By submitting payment, you confirm that you are authorized to use the payment method. We do not store your full card details on our servers.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-3">
            <h2 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
              7. Shipping and Discreet Delivery
            </h2>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              We ship products in plain, discreet packaging with no intimate product labels on the outside. Delivery times and costs are shown at checkout and may vary by location. Risk of loss passes to you when the products are delivered to the address you provide. We are not responsible for delays caused by carriers, customs, or incorrect address details you supply.
            </p>
          </div>

          {/* Section 8 */}
          <div className="space-y-3">
            <h2 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
              8. Returns and Refunds
            </h2>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              Because of the intimate and personal nature of our products, we can only accept returns for hygiene and safety reasons in limited cases. We accept returns of items that are unopened, unused, and in their original sealed packaging. We cannot accept returns of opened or used products unless they are faulty or the law requires otherwise.
            </p>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              If a product arrives damaged, defective, or incorrect, contact us at <a href="mailto:care@missnous.com" className="text-[#9E3F5C] font-semibold underline">care@missnous.com</a> within a reasonable time of delivery. Please include your order details and, where possible, photos, so we can put it right with a replacement or refund.
            </p>
          </div>

          {/* Section 9 */}
          <div className="space-y-3">
            <h2 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
              9. Intellectual Property
            </h2>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              All content on the Site, including text, graphics, logos, images, product names, and design, is owned by or licensed to Miss Nous and is protected by intellectual property laws. You may view and use the Site for your own personal, non-commercial use. You may not copy, reproduce, distribute, or create derivative works from our content without our written permission.
            </p>
          </div>

          {/* Section 10 */}
          <div className="space-y-3">
            <h2 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
              10. Governing Law
            </h2>
            <p className="text-sm sm:text-base text-[#5A4B50] leading-relaxed">
              These Terms are governed by the laws of the State of New Jersey and the United States, without regard to conflict-of-law rules. Any dispute will be handled by the courts located in New Jersey, unless mandatory consumer law in your country gives you other rights.
            </p>
          </div>

          {/* Contact Footer Box */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-sans text-base font-bold text-[#2B2225]">
                Questions About Our Terms?
              </h4>
              <p className="text-sm text-[#5A4B50]">
                Contact our customer care team anytime at <a href="mailto:care@missnous.com" className="text-[#9E3F5C] font-semibold underline">care@missnous.com</a>.
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
