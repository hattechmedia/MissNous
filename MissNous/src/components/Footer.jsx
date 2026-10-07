import React from 'react';
import { MapPin, Phone } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const handleNavClick = (e, page) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <footer className="w-full bg-[#9E3F5C] py-12 sm:py-16 px-4 sm:px-8 lg:px-16 text-[#FFF9F5] border-t border-[#D4AF6A]/30">
      {/* Full Width Footer Container */}
      <div className="w-full max-w-7xl mx-auto space-y-10">

        {/* Footer Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start pt-2 reveal-up">

          {/* COLUMN 1: LOGO, ABOUT MISS NOUS, PHONE & ADDRESS (5 Cols wide on MD) */}
          <div className="md:col-span-5 space-y-4 pr-0 md:pr-4">
            <a
              href="/"
              onClick={(e) => handleNavClick(e, 'home')}
              className="inline-block group"
              aria-label="Miss Nous Home"
            >
              <img
                src="/logo-bg.png"
                alt="Miss Nous"
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </a>

            <p className="font-sans text-xs sm:text-sm text-[#F7D6DF] leading-relaxed max-w-sm">
              <strong className="text-[#E8D3A5] font-semibold">Miss Nous</strong> is dedicated to luxury intimate wellness and premium body care, formulating 100% organic botanical rituals that empower self-love and natural confidence.
            </p>

            {/* Contact Details (Phone & Address) Below Description */}
            <div className="space-y-2.5 pt-1">
              <a
                href="tel:+19089773004"
                className="flex items-center gap-2.5 text-xs sm:text-sm text-[#E8D3A5] hover:text-white font-sans transition-colors font-medium group/phone"
              >
                <Phone className="w-4 h-4 text-[#D4AF6A] flex-shrink-0" />
                <span className="tracking-wide font-medium">+19089773004</span>
              </a>

              <a
                href="https://www.google.com/maps/place/Miss+Nous/@40.6877962,-74.1994947,17z/data=!3m1!4b1!4m6!3m5!1s0x89c253a52fef0fcb:0x82a1dbac81782d21!8m2!3d40.6877962!4d-74.1994947!16s%2Fg%2F11zypb6tl8?entry=ttu&g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-xs text-[#E8D3A5] hover:text-white font-sans transition-colors group/address"
              >
                <MapPin className="w-4 h-4 text-[#D4AF6A] flex-shrink-0 mt-0.5 group-hover/address:scale-110 transition-transform" />
                <span className="leading-relaxed font-medium">
                  18 Garibaldi Avenue, Newark, New Jersey 07114
                </span>
              </a>
            </div>
          </div>


          {/* COLUMN 2: PAGES NAVIGATION (3 Cols wide on MD) */}
          <div className="md:col-span-3 space-y-3">
            <span className="block font-sans text-xs font-bold uppercase tracking-wider text-[#D4AF6A]">
              PAGES
            </span>
            <ul className="flex flex-col gap-2 font-sans text-sm text-[#F7D6DF]">
              <li>
                <a
                  href="/"
                  onClick={(e) => handleNavClick(e, 'home')}
                  className="hover:text-[#E8D3A5] transition-colors font-medium inline-block py-0.5"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleNavClick(e, 'about')}
                  className="hover:text-[#E8D3A5] transition-colors font-medium inline-block py-0.5"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  onClick={(e) => handleNavClick(e, 'shop')}
                  className="hover:text-[#E8D3A5] transition-colors font-medium inline-block py-0.5"
                >
                  Shop
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleNavClick(e, 'contact')}
                  className="hover:text-[#E8D3A5] transition-colors font-medium inline-block py-0.5"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: LOCATION MAP (4 Cols wide on MD) */}
          <div className="md:col-span-4 space-y-3">
            <span className="block font-sans text-xs font-bold uppercase tracking-wider text-[#D4AF6A]">
              OUR LOCATION
            </span>
            <div className="w-full rounded-2xl overflow-hidden border border-[#D4AF6A]/30 shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3025.3721763643252!2d-74.20206962427051!3d40.68780023909715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c253a52fef0fcb%3A0x82a1dbac81782d21!2sMiss%20Nous!5e0!3m2!1sen!2sde!4v1791368607883!5m2!1sen!2sde"
                className="w-full h-44 border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Miss Nous Location"
              ></iframe>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Divider Row */}
        <div className="border-t border-[#D4AF6A]/30 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E8D3A5]/80 font-normal gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span>Copyright © 2026 Miss Nous Inc. All rights reserved.</span>
            <span className="hidden sm:inline text-[#D4AF6A]">•</span>
            <span className="font-semibold text-[#E8D3A5]">Powered by Hat Tech Media</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-[#E8D3A5] transition-colors">
              Privacy Policy
            </a>
            <span>·</span>
            <a href="#" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-[#E8D3A5] transition-colors">
              Terms of Use
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}









