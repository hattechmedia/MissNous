import React, { useState } from 'react';
import { Sparkles, Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import image5 from '../assets/image-5.jpeg';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
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
    if (formData.fullName && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ fullName: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="bg-[#FDF2F5] text-[#2B2225] min-h-screen font-sans">
      
      {/* 1. PAGE HERO WITH IMAGE-5 AS BACKGROUND */}
      <section className="relative min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-16 text-center overflow-hidden border-b border-[#F7D6DF]/60 bg-[#2B2225] flex items-center justify-center">
        
        {/* Background Image image-5 with Lighter Opacity Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={image5} 
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
              Contact Us
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-medium text-[#FFF9F5] tracking-tight leading-[1.15] drop-shadow-md">
            We'd Love to Hear From You
          </h1>

          {/* Supporting Intro */}
          <p className="font-sans text-base sm:text-lg text-[#F7D6DF] font-light leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
            Have questions about our botanical formulas, pH calibration, or your order? Our Parisian wellness team is here to guide and assist you.
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
                Our Customer Care
              </h2>
              <p className="font-sans text-sm text-[#5A4B50] font-normal leading-relaxed">
                Reach out to us through any of the channels below or fill out the form. We respond to all inquiries within 24 hours.
              </p>
            </div>

            {/* Contact Details List */}
            <div className="space-y-4 pt-2">
              
              {/* Email */}
              <div className="p-5 bg-white rounded-3xl border border-[#F7D6DF] shadow-sm flex items-start gap-4 hover:shadow-pink-glow transition-all">
                <div className="w-11 h-11 rounded-2xl bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center flex-shrink-0 border border-[#F7D6DF]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans text-xs uppercase tracking-wider font-bold text-[#9E3F5C]">Email Support</h4>
                  <a href="mailto:care@missnous.com" className="font-sans text-sm sm:text-base font-medium text-[#2B2225] hover:text-[#9E3F5C] transition-colors">
                    care@missnous.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="p-5 bg-white rounded-3xl border border-[#F7D6DF] shadow-sm flex items-start gap-4 hover:shadow-gold-glow transition-all">
                <div className="w-11 h-11 rounded-2xl bg-[#FFF9F5] text-[#D4AF6A] flex items-center justify-center flex-shrink-0 border border-[#E8D3A5]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans text-xs uppercase tracking-wider font-bold text-[#9E3F5C]">Phone Helpline</h4>
                  <a href="tel:+33142685500" className="font-sans text-sm sm:text-base font-medium text-[#2B2225] hover:text-[#9E3F5C] transition-colors">
                    +33 1 42 68 55 00
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="p-5 bg-white rounded-3xl border border-[#F7D6DF] shadow-sm flex items-start gap-4 hover:shadow-pink-glow transition-all">
                <div className="w-11 h-11 rounded-2xl bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center flex-shrink-0 border border-[#F7D6DF]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans text-xs uppercase tracking-wider font-bold text-[#9E3F5C]">Paris Atelier</h4>
                  <p className="font-sans text-sm text-[#2B2225] font-medium leading-normal">
                    Rue Saint-Honoré, 75001 Paris, France
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="p-5 bg-white rounded-3xl border border-[#F7D6DF] shadow-sm flex items-start gap-4 hover:shadow-gold-glow transition-all">
                <div className="w-11 h-11 rounded-2xl bg-[#FFF9F5] text-[#D4AF6A] flex items-center justify-center flex-shrink-0 border border-[#E8D3A5]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans text-xs uppercase tracking-wider font-bold text-[#9E3F5C]">Business Hours</h4>
                  <p className="font-sans text-sm text-[#2B2225] font-medium leading-normal">
                    Monday - Friday: 9:00 AM - 6:00 PM CET
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 lg:p-12 rounded-[2.5rem] border border-[#F7D6DF] shadow-luxury">
            
            <div className="space-y-2 mb-6">
              <h3 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
                Send Us a Message
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#5A4B50]">
                Fill out the form below and our intimate wellness specialist will get in touch with you.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-[#FFF9F5] border border-[#E8D3A5] rounded-3xl text-center space-y-3 animate-fade-up">
                <div className="w-12 h-12 rounded-full bg-[#F7D6DF] text-[#9E3F5C] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-sans text-lg font-medium text-[#2B2225]">Message Received</h4>
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
                
                {/* Full Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 text-left">
                    <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Sophia Lauren"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-2xl px-4 py-3 text-sm text-[#2B2225] placeholder-[#A09095] focus:outline-none focus:border-[#D4AF6A] focus:ring-2 focus:ring-[#D4AF6A]/30 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                      Email Address *
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

                {/* Subject */}
                <div className="space-y-1.5 text-left">
                  <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                    Subject
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
                    Message *
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
                    className="inline-flex items-center justify-center px-8 py-3.5 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-sm font-semibold rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-0.5 gap-2"
                  >
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>
      </section>

    </div>
  );
}
