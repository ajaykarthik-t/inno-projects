"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import './HeroSection.css';

// Simplified content item interface
interface ContentItem {
  id: string;
  title: string;
  description: string;
  price?: string;
  discount?: string;
  ctaText: string;
  ctaLink: string;
  mediaType: 'gradient';
  gradientColors?: string[];
  icon?: string;
  textColor?: string;
  accentColor?: string;
}

const HeroSection: React.FC = () => {
  // State management
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Updated content items with the AI/ML project section first
  const contentItems: ContentItem[] = [
    {
      id: 'ai-ml-project',
      title: 'Full Stack AI/ML Projects',
      description: 'Get your AI and Machine Learning projects built in record time. Our expert team delivers complete solutions.',
      price: 'Build and Get your project in less than 12 hours',
      ctaText: 'Start Your Project',
      ctaLink: '/ai-ml-project',
      mediaType: 'gradient',
      gradientColors: ['#8B5CF6', '#EC4899'],
      textColor: '#ffffff',
      accentColor: '#10B981',
      icon: 'ai'
    },
    {
      id: 'referral-program',
      title: 'Refer & Earn Rewards',
      description: 'Refer your friends to receive up to a 90% discount and cashback on all your purchases. The more friends you refer, the greater your rewards!',
      discount: 'UP TO 90% OFF',
      ctaText: 'Refer Now',
      ctaLink: '/referral',
      mediaType: 'gradient',
      gradientColors: ['#FF416C', '#FF4B2B'],
      textColor: '#ffffff',
      accentColor: '#FFD166',
      icon: 'gift'
    },
    {
      id: 'book-appointment',
      title: 'Expert Consultation',
      description: 'Schedule an appointment with an experienced software engineer to receive personalized guidance on your projects.',
      ctaText: 'Book a Session',
      ctaLink: '/appointments',
      mediaType: 'gradient',
      gradientColors: ['#0575E6', '#021B79'],
      textColor: '#ffffff',
      accentColor: '#64B5F6',
      icon: 'calendar'
    },
    {
      id: 'request-project',
      title: 'Request a New Project',
      description: 'Need a custom AI project developed? Our team of experts builds tailored solutions from the ground up.',
      ctaText: 'Submit Request',
      ctaLink: '/request-project',
      mediaType: 'gradient',
      gradientColors: ['#5614B0', '#DBD65C'],
      textColor: '#ffffff',
      accentColor: '#A259FF',
      icon: 'project'
    },
    {
      id: 'ieee-publication',
      title: 'IEEE Journal Publication',
      description: 'Get expert help publishing your research in prestigious IEEE journals. Our academic team will help you refine your paper.',
      price: 'For less than ₹3,000.00',
      ctaText: 'Publish Research',
      ctaLink: '/ieee-publication',
      mediaType: 'gradient',
      gradientColors: ['#11998e', '#38ef7d'],
      textColor: '#ffffff',
      accentColor: '#38ef7d',
      icon: 'document'
    },
    {
      id: 'contact-support',
      title: 'Contact Us 24/7',
      description: 'Our dedicated support team is available around the clock to assist you with any questions or concerns.',
      ctaText: 'Get Help Now',
      ctaLink: '/contact',
      mediaType: 'gradient',
      gradientColors: ['#4A00E0', '#8E2DE2'],
      textColor: '#ffffff',
      accentColor: '#00FFC8',  // Bright cyan for button color
      icon: 'support'
    }
    
    
  ];

  // Function to switch to next slide - optimized for mobile
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setActiveSlide((prev) => (prev + 1) % contentItems.length);
    
    // Shorter transition time for mobile
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, contentItems.length]);

  // Function to switch to previous slide - optimized for mobile
  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setActiveSlide((prev) => (prev === 0 ? contentItems.length - 1 : prev - 1));
    
    // Shorter transition time for mobile
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, contentItems.length]);

  // Function to go to a specific slide
  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === activeSlide) return;
    
    setIsTransitioning(true);
    setActiveSlide(index);
    
    // Shorter transition time for mobile
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, activeSlide]);

  // Start autoplay
  const startAutoplay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
  }, [nextSlide]);

  // Pause autoplay
  const pauseAutoplay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  // Enhanced touch handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    // Lower threshold for swipe detection on mobile
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    // Reset values
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Initialize autoplay and clean up on unmount
  useEffect(() => {
    startAutoplay();
    
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [startAutoplay]);

  // Current active content
  const currentContent = contentItems[activeSlide];

  // Generate gradient background style
  const getBackgroundStyle = () => {
    if (currentContent.gradientColors && currentContent.gradientColors.length > 0) {
      if (currentContent.gradientColors.length === 1) {
        return { backgroundColor: currentContent.gradientColors[0] };
      } else {
        return {
          background: `linear-gradient(135deg, ${currentContent.gradientColors.join(', ')})`
        };
      }
    }
    return { backgroundColor: '#1a1a2e' };
  };

  // Add scroll handler
  const handleScrollClick = () => {
    const nextSection = document.querySelector('.content-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Render icon based on content ID
  const renderIcon = () => {
    if (currentContent.id === 'ai-ml-project') {
      return (
        <>
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20z"></path>
          <path d="M7 12l3 3 7-7"></path>
        </>
      );
    } else if (currentContent.id.includes('project')) {
      return (
        <>
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 8v8"></path>
          <path d="M8 12h8"></path>
        </>
      );
    } else if (currentContent.id.includes('product')) {
      return (
        <>
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </>
      );
    } else {
      return (
        <>
          <path d="M5 12h14"></path>
          <path d="M12 5l7 7-7 7"></path>
        </>
      );
    }
  };

  return (
    <div 
      className="hero-section"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={startAutoplay}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={containerRef}
    >
      <div 
        className={`hero-content ${isTransitioning ? 'transitioning' : ''}`} 
        style={{ 
          color: currentContent.textColor || '#ffffff',
          '--accent-color': currentContent.accentColor || '#8E2DE2'
        } as React.CSSProperties}
      >
        <div className="hero-background" style={getBackgroundStyle()}>
          <div className="animated-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            {currentContent.id === 'ai-ml-project' && (
              <>
                <div className="ai-particle ai-particle-1"></div>
                <div className="ai-particle ai-particle-2"></div>
                <div className="ai-particle ai-particle-3"></div>
                <div className="ai-particle ai-particle-4"></div>
                <div className="ai-particle ai-particle-5"></div>
                <div className="ai-circuit"></div>
              </>
            )}
          </div>
        </div>
        
        <div className="hero-text">
          <div className="content-header">
            <h1>{currentContent.title}</h1>
          </div>
          
          <p>{currentContent.description}</p>
          
          {currentContent.price && (
            <div className="hero-price">
              {currentContent.price}
            </div>
          )}
          
          <a href={currentContent.ctaLink} className="hero-cta" style={{ backgroundColor: currentContent.accentColor || 'var(--accent-primary)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {renderIcon()}
            </svg>
            {currentContent.ctaText}
          </a>
        </div>
        
      
        {/* Navigation arrows - larger touch targets for mobile */}
        <button className="nav-button prev" onClick={prevSlide} aria-label="Previous slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button className="nav-button next" onClick={nextSlide} aria-label="Next slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      
      {/* Slide indicators - larger and more spaced for mobile */}
      <div className="slide-indicators">
        {contentItems.map((_, index) => (
          <button 
            key={index} 
            className={`indicator ${activeSlide === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          >
            <span className="indicator-progress"></span>
          </button>
        ))}
      </div>

      {/* Add scroll indicator */}
      <div className="scroll-indicator" onClick={handleScrollClick} role="button" aria-label="Scroll to next section">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;