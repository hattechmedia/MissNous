import React from 'react';
import HeroSection from '../components/HeroSection';
import TrustBanner from '../components/TrustBanner';
import NaturalTouchSection from '../components/NaturalTouchSection';
import FeaturedProductsSection from '../components/FeaturedProductsSection';
import VideoSection from '../components/VideoSection';
import ProductBenefitsSection from '../components/ProductBenefitsSection';
import ParallaxBanner from '../components/ParallaxBanner';
import SkinRitualSection from '../components/SkinRitualSection';
import PureComfortSection from '../components/PureComfortSection';
import FaqSection from '../components/FaqSection';
import TestimonialsSection from '../components/TestimonialsSection';
import NewsletterSection from '../components/NewsletterSection';

export default function HomePage({
  onNavigate,
  onAddToCart,
  onToggleWishlist,
  wishlistItems = [],
  products = [],
  onViewProduct
}) {
  return (
    <main>
      <HeroSection onNavigate={onNavigate} />
      <TrustBanner />
      <NaturalTouchSection onNavigate={onNavigate} />
      <FeaturedProductsSection
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistItems={wishlistItems}
        onNavigate={onNavigate}
        products={products}
        onViewProduct={onViewProduct}
      />
      <VideoSection />
      <ProductBenefitsSection onNavigate={onNavigate} />
      <ParallaxBanner onNavigate={onNavigate} />
      <SkinRitualSection onNavigate={onNavigate} />
      <PureComfortSection onNavigate={onNavigate} />
      <FaqSection />
      <TestimonialsSection />
      <NewsletterSection />
    </main>
  );
}
