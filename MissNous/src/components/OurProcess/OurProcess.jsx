import React, { useState, useEffect, useRef, useCallback } from 'react';
import './OurProcess.css';

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Research',
    description: 'Our team researches and carefully verifies natural ingredients before developing any formula.',
    imagePath: '/assets/images/process/research.webp',
    alt: 'Scientific research and verification of natural botanical ingredients in laboratory'
  },
  {
    step: '02',
    title: 'Sourcing',
    description: 'We work with certified suppliers worldwide to source high-grade ingredients.',
    imagePath: '/assets/images/process/sourcing.webp',
    alt: 'Ethical sourcing of certified organic botanical herbs and extracts from global farms'
  },
  {
    step: '03',
    title: 'Formulation',
    description: 'Our specialists combine carefully selected ingredients into balanced formulas designed for quality, consistency, and everyday wellness.',
    imagePath: '/assets/images/process/formulation.webp',
    alt: 'Precise apothecary formulation of active natural wellness serums and blends'
  },
  {
    step: '04',
    title: 'Quality Testing',
    description: 'Every formula goes through careful quality checks to verify purity, consistency, safety, and product standards before it reaches our customers.',
    imagePath: '/assets/images/process/testing.webp',
    alt: 'High-tech pharmaceutical quality control inspection and purity testing'
  }
];

export default function OurProcess() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef(null);
  const tabsRef = useRef([]);
  const autoplayTimerRef = useRef(null);

  // Check user preference for reduced motion
  const isReducedMotion = useCallback(() => {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // IntersectionObserver for scroll entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Autoplay functionality (every 4 seconds, pauses on hover/focus)
  useEffect(() => {
    if (isPaused || isReducedMotion()) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PROCESS_STEPS.length);
    }, 4000);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isPaused, isReducedMotion]);

  // Keyboard navigation
  const handleKeyDown = (e, index) => {
    let newIndex = null;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        newIndex = (index + 1) % PROCESS_STEPS.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        newIndex = (index - 1 + PROCESS_STEPS.length) % PROCESS_STEPS.length;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = PROCESS_STEPS.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        setActiveIndex(index);
        return;
      default:
        return;
    }

    if (newIndex !== null) {
      setActiveIndex(newIndex);
      if (tabsRef.current[newIndex]) {
        tabsRef.current[newIndex].focus();
      }
    }
  };

  return (
    <section 
      className="tn-process-section"
      aria-label="Product Process Section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div 
        ref={containerRef}
        className={`tn-process-container ${isVisible ? 'is-visible' : ''}`}
      >
        {/* Header */}
        <header className="tn-process-header">
          <span className="tn-process-eyebrow">HOW WE MAKE IT</span>
          <h2 className="tn-process-title">TRINUTRA PRODUCT PROCESS</h2>
        </header>

        {/* Horizontal Accordion */}
        <div 
          className="tn-process-accordion"
          role="tablist"
          aria-label="Trinutra product creation stages"
        >
          {PROCESS_STEPS.map((step, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={step.step}
                ref={(el) => (tabsRef.current[idx] = el)}
                id={`tn-process-tab-${idx}`}
                role="tab"
                tabIndex={0}
                aria-selected={isActive}
                aria-controls={`tn-process-panel-${idx}`}
                className={`tn-process-panel ${isActive ? 'tn-process-active' : ''}`}
                onClick={() => setActiveIndex(idx)}
                onMouseEnter={() => setActiveIndex(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
              >
                {/* Background Image */}
                <img
                  src={step.imagePath}
                  alt={step.alt}
                  className="tn-process-image"
                  width="800"
                  height="460"
                  loading="lazy"
                />

                {/* Dark Green & Gradient Overlays */}
                <div className="tn-process-overlay-color" aria-hidden="true" />
                <div className="tn-process-overlay-gradient" aria-hidden="true" />

                {/* Collapsed State Badge */}
                <div className="tn-process-collapsed-badge" aria-hidden="true">
                  <div className="tn-process-step-pill">{step.step}</div>
                  <span className="tn-process-collapsed-title">{step.title}</span>
                </div>

                {/* Active State Content */}
                <div 
                  id={`tn-process-panel-${idx}`}
                  role="tabpanel"
                  aria-labelledby={`tn-process-tab-${idx}`}
                  className="tn-process-content"
                  aria-hidden={!isActive}
                >
                  <div className="tn-process-step-indicator">
                    STEP {step.step}
                  </div>
                  <h3 className="tn-process-active-title">
                    {step.title}
                  </h3>
                  <p className="tn-process-description">
                    {step.description}
                  </p>
                  <div className="tn-process-progress-line" aria-hidden="true" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Dots Indicator */}
        <nav className="tn-process-dots" aria-label="Process carousel navigation">
          {PROCESS_STEPS.map((step, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={step.step}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to step ${step.step}: ${step.title}`}
                aria-current={isActive ? 'true' : 'false'}
                className={`tn-process-dot ${isActive ? 'tn-process-dot-active' : ''}`}
              />
            );
          })}
        </nav>
      </div>
    </section>
  );
}
