import React, { useState, useEffect } from 'react';
import { Sparkles, Mail, MapPin, Clock, Send, CheckCircle2, HelpCircle, RotateCcw, ArrowRight } from 'lucide-react';

export default function ContactPage({ onNavigate }) {
  // Page Meta Description for SEO without changing browser tab title
  useEffect(() => {
    let metaDesc = document.querySelector('meta[name="description"]');
    let created = false;
    let prevDesc = '';
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
      created = true;
    } else {
      prevDesc = metaDesc.getAttribute('content') || '';
    }
    metaDesc.setAttribute('content', 'Contact the Miss Nous team with questions about your order, our products, or ingredients. We are here to help.');

    return () => {
      if (created) {
        metaDesc.remove();
      } else {
        metaDesc.setAttribute('content', prevDesc);
      }
    };
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  const handleFaqClick = () => {
    if (onNavigate) {
      onNavigate('faq');
    }
  };

  return (
    <div className="bg-[#FDF2F5] text-[#2B2225] min-h-screen font-sans">
      <meta name="description" content="Contact the Miss Nous team with questions about your order, our products, or ingredients. We are here to help." />

      {/* 1. PAGE HERO WITH IMAGE-5 AS BACKGROUND */}
      <section className="relative min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-16 text-center overflow-hidden border-b border-[#F7D6DF]/60 bg-[#2B2225] flex items-center justify-center">

        {/* Background Image gpt-13.png with Lighter Opacity Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/gpt-13.png"
            alt="Miss Nous Contact Background"
            className="w-full h-full object-cover object-center opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225]/60 via-[#2B2225]/25 to-[#2B2225]/40"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-6 reveal-up">

          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#F7D6DF] shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
            <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
              Get In Touch
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-medium text-[#FFF9F5] tracking-tight leading-[1.15] drop-shadow-md">
            Contact Miss Nous
          </h1>

          {/* Supporting Intro */}
          <p className="font-sans text-base sm:text-lg text-[#F7D6DF] font-light leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
            Have questions about our ingredients, pH-balanced formulas, or your order? The Miss Nous team is here to guide you and help with anything you need.
          </p>

        </div>
      </section>

      {/* 2. CONTACT CONTENT SECTION (2 Columns Desktop / Stacked Mobile) */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* LEFT COLUMN: Contact Information */}
          <div className="lg:col-span-5 space-y-8 reveal-left">

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#F7D6DF] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
                <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                  Get in Touch
                </span>
              </div>
              <h2 className="font-sans text-3xl sm:text-4xl font-medium text-[#2B2225] tracking-tight">
                Other ways to reach us
              </h2>
              <p className="font-sans text-sm text-[#5A4B50] font-normal leading-relaxed">
                You can also email us directly, and our team will respond as soon as possible.
              </p>
            </div>

            {/* Contact Details List */}
            <div className="space-y-4 pt-2">

              {/* Support Email */}
              <div className="p-5 bg-white rounded-3xl border border-[#F7D6DF] shadow-sm flex items-start gap-4 hover:shadow-pink-glow transition-all">
                <div className="w-11 h-11 rounded-2xl bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center flex-shrink-0 border border-[#F7D6DF]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-sans text-xs uppercase tracking-wider font-bold text-[#9E3F5C]">Support Email</span>
                  <a href="mailto:care@missnous.com" className="font-sans text-sm sm:text-base font-medium text-[#2B2225] hover:text-[#9E3F5C] transition-colors block">
                    care@missnous.com
                  </a>
                </div>
              </div>

              {/* Response Time */}
              <div className="p-5 bg-white rounded-3xl border border-[#F7D6DF] shadow-sm flex items-start gap-4 hover:shadow-pink-glow transition-all">
                <div className="w-11 h-11 rounded-2xl bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center flex-shrink-0 border border-[#F7D6DF]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-sans text-xs uppercase tracking-wider font-bold text-[#9E3F5C]">Response Time</span>
                  <p className="font-sans text-sm sm:text-base text-[#2B2225] font-medium leading-normal">
                    Within 1 to 2 business days
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="p-5 bg-white rounded-3xl border border-[#F7D6DF] shadow-sm flex items-start gap-4 hover:shadow-gold-glow transition-all">
                <div className="w-11 h-11 rounded-2xl bg-[#FFF9F5] text-[#D4AF6A] flex items-center justify-center flex-shrink-0 border border-[#E8D3A5]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-sans text-xs uppercase tracking-wider font-bold text-[#9E3F5C]">Hours</span>
                  <p className="font-sans text-sm sm:text-base text-[#2B2225] font-medium leading-normal">
                    Monday – Friday: 9:00 AM – 6:00 PM EST
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 lg:p-12 rounded-[2.5rem] border border-[#F7D6DF] shadow-luxury">

            <div className="space-y-2 mb-6 text-left">
              <span className="block font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
                Send us a message
              </span>
            </div>

            {submitted ? (
              <div className="p-6 bg-[#FFF9F5] border border-[#E8D3A5] rounded-3xl text-center space-y-3 animate-fade-up">
                <div className="w-12 h-12 rounded-full bg-[#F7D6DF] text-[#9E3F5C] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <span className="block font-sans text-lg font-medium text-[#2B2225]">Message Received</span>
                <p className="font-sans text-xs sm:text-sm text-[#5A4B50]">
                  Thank you for reaching out! Our team will respond to your inquiry within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="pt-2 text-xs font-semibold text-[#9E3F5C] underline hover:text-[#7C2F47]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 text-left">
                    <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Sophia Lauren"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-2xl px-4 py-3 text-sm text-[#2B2225] placeholder-[#A09095] focus:outline-none focus:border-[#D4AF6A] focus:ring-2 focus:ring-[#D4AF6A]/30 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="sophia@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-2xl px-4 py-3 text-sm text-[#2B2225] placeholder-[#A09095] focus:outline-none focus:border-[#D4AF6A] focus:ring-2 focus:ring-[#D4AF6A]/30 transition-all"
                    />
                  </div>
                </div>

                {/* Subject (optional) */}
                <div className="space-y-1.5 text-left">
                  <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                    Subject (optional)
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Product Inquiry / Order Assistance"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-2xl px-4 py-3 text-sm text-[#2B2225] placeholder-[#A09095] focus:outline-none focus:border-[#D4AF6A] focus:ring-2 focus:ring-[#D4AF6A]/30 transition-all"
                  />
                </div>

                {/* Message Textarea */}
                <div className="space-y-1.5 text-left">
                  <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Write your message or inquiry here..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-2xl px-4 py-3 text-sm text-[#2B2225] placeholder-[#A09095] focus:outline-none focus:border-[#D4AF6A] focus:ring-2 focus:ring-[#D4AF6A]/30 transition-all resize-none"
                  ></textarea>
                </div>

                {/* Send Button */}
                <div className="pt-2 text-left">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-8 py-3.5 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-sm font-semibold rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-0.5 gap-2 cursor-pointer"
                  >
                    <span>Send message</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>
      </section>

      {/* 3. BEFORE YOU REACH OUT SECTION */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5] border-t border-[#F7D6DF]/60 relative overflow-hidden">
        {/* Subtle Ambient Background Accents */}
        <div className="absolute top-1/4 -left-36 w-96 h-96 bg-[#F7D6DF]/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-36 w-96 h-96 bg-[#D4AF6A]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-12">

          {/* Centered Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#F7D6DF] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF6A]" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                Helpful Resources
              </span>
            </div>

            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] tracking-tight">
              Before you reach out
            </h2>

            <div className="w-12 h-0.5 bg-[#D4AF6A] rounded-full mx-auto my-2"></div>

            <p className="font-sans text-sm sm:text-base text-[#5A4B50] font-normal leading-relaxed max-w-2xl mx-auto">
              A quick check here might save you a wait. Many common questions about orders, ingredients, and how to use our formulas are already answered in one of these places.
            </p>
          </div>

          {/* 3 Cards Grid (matching exact attached image style) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">

            {/* Card 01: FAQ */}
            <div className="relative bg-white rounded-3xl p-6 sm:p-7 text-left shadow-luxury hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group border border-[#F7D6DF] overflow-hidden min-h-[220px]">
              {/* Top Right Corner Dark Pink Circle with Number */}
              <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#9E3F5C] text-[#FFF9F5] flex items-center justify-center pt-3.5 pr-3.5 sm:pt-4 sm:pr-4 shadow-sm border border-[#F7D6DF]/40 group-hover:scale-105 transition-transform duration-300 pointer-events-none z-10">
                <span className="font-sans font-bold text-xs sm:text-sm tracking-wider">
                  01
                </span>
              </div>

              {/* Top Left Icon Container (Squircle box) */}
              <div className="w-12 h-12 rounded-2xl bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center text-[#9E3F5C] shadow-xs group-hover:scale-110 group-hover:bg-[#9E3F5C] group-hover:text-white transition-all duration-300">
                <HelpCircle className="w-5 h-5 stroke-[2]" />
              </div>

              {/* Middle Content */}
              <div className="mt-5 space-y-2">
                <h3 className="font-sans text-base sm:text-lg font-bold text-[#2B2225] leading-snug">
                  Check our FAQ
                </h3>
                <div className="w-7 h-0.5 bg-[#D4AF6A] rounded-full my-1.5"></div>
                <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed">
                  For questions about ingredients, usage, and storage.
                </p>
              </div>
            </div>

            {/* Card 02: Order Confirmation Email */}
            <div className="relative bg-white rounded-3xl p-6 sm:p-7 text-left shadow-luxury hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group border border-[#F7D6DF] overflow-hidden min-h-[220px]">
              {/* Top Right Corner Dark Pink Circle with Number */}
              <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#9E3F5C] text-[#FFF9F5] flex items-center justify-center pt-3.5 pr-3.5 sm:pt-4 sm:pr-4 shadow-sm border border-[#F7D6DF]/40 group-hover:scale-105 transition-transform duration-300 pointer-events-none z-10">
                <span className="font-sans font-bold text-xs sm:text-sm tracking-wider">
                  02
                </span>
              </div>

              {/* Top Left Icon Container (Squircle box) */}
              <div className="w-12 h-12 rounded-2xl bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center text-[#9E3F5C] shadow-xs group-hover:scale-110 group-hover:bg-[#9E3F5C] group-hover:text-white transition-all duration-300">
                <Mail className="w-5 h-5 stroke-[2]" />
              </div>

              {/* Middle Content */}
              <div className="mt-5 space-y-2">
                <h3 className="font-sans text-base sm:text-lg font-bold text-[#2B2225] leading-snug">
                  Order confirmation email
                </h3>
                <div className="w-7 h-0.5 bg-[#D4AF6A] rounded-full my-1.5"></div>
                <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed">
                  Check your order confirmation email for tracking and delivery details.
                </p>
              </div>
            </div>

            {/* Card 03: Returns Page */}
            <div className="relative bg-white rounded-3xl p-6 sm:p-7 text-left shadow-luxury hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group border border-[#F7D6DF] overflow-hidden min-h-[220px]">
              {/* Top Right Corner Dark Pink Circle with Number */}
              <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#9E3F5C] text-[#FFF9F5] flex items-center justify-center pt-3.5 pr-3.5 sm:pt-4 sm:pr-4 shadow-sm border border-[#F7D6DF]/40 group-hover:scale-105 transition-transform duration-300 pointer-events-none z-10">
                <span className="font-sans font-bold text-xs sm:text-sm tracking-wider">
                  03
                </span>
              </div>

              {/* Top Left Icon Container (Squircle box) */}
              <div className="w-12 h-12 rounded-2xl bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center text-[#9E3F5C] shadow-xs group-hover:scale-110 group-hover:bg-[#9E3F5C] group-hover:text-white transition-all duration-300">
                <RotateCcw className="w-5 h-5 stroke-[2]" />
              </div>

              {/* Middle Content */}
              <div className="mt-5 space-y-2">
                <h3 className="font-sans text-base sm:text-lg font-bold text-[#2B2225] leading-snug">
                  Check our returns page
                </h3>
                <div className="w-7 h-0.5 bg-[#D4AF6A] rounded-full my-1.5"></div>
                <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed">
                  Review our returns policy if you need to send something back.
                </p>
              </div>
            </div>

          </div>

          {/* Button: Visit our FAQ */}
          <div className="pt-4 flex justify-center">
            <button
              type="button"
              onClick={handleFaqClick}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-xs uppercase tracking-widest font-bold rounded-full shadow-pink-glow gap-2.5 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Visit our FAQ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. PRESS AND PARTNERSHIPS SECTION */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 lg:px-16 bg-white border-t border-[#F7D6DF]/60 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/3 -right-36 w-96 h-96 bg-[#F7D6DF]/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#E8D3A5]/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

            {/* Left Column: Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
                <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                  Collaborations & Media
                </span>
              </div>

              <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] tracking-tight leading-[1.15]">
                Press and partnerships
              </h2>

              <div className="w-16 h-0.5 bg-gradient-to-r from-[#9E3F5C] via-[#D4AF6A] to-transparent"></div>

              <p className="font-sans text-base sm:text-lg text-[#5A4B50] font-normal leading-relaxed">
                If you are reaching out about a collaboration, press feature, or wholesale opportunity, let us know in your message and our team will make sure it reaches the right person.
              </p>
            </div>

            {/* Right Column: Image (part.jpeg) */}
            <div className="lg:col-span-6">
              <div className="relative group max-w-lg mx-auto lg:max-w-none">
                {/* Ambient Soft Glow */}
                <div className="absolute -inset-3 bg-gradient-to-tr from-[#9E3F5C]/20 via-[#D4AF6A]/20 to-transparent rounded-[2.5rem] blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="relative rounded-[2rem] sm:rounded-3xl overflow-hidden border border-[#F7D6DF] shadow-luxury bg-[#FDF2F5]">
                  <img
                    src="/part.jpeg"
                    alt="Miss Nous Press and Partnerships"
                    className="w-full h-[320px] sm:h-[400px] lg:h-[440px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => { e.currentTarget.src = '/Part.jpeg'; }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
