
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import NewsletterForm from "@/components/coming-soon/NewsletterForm";
import ProductCarousel from "@/components/coming-soon/ProductCarousel";
import MobileBackgroundCarousel from "@/components/coming-soon/MobileBackgroundCarousel";

const ComingSoonPage = () => {
  const carouselImages = [
    {
      src: "/lovable-uploads/d5e58add-86a9-491c-b3e2-ca380524e254.png",
      alt: "Delivery Package"
    },
    {
      src: "/lovable-uploads/bfa0e35e-65cd-4463-8936-12bb49a038ed.png",
      alt: "Delivery Vehicle"
    },
    {
      src: "/lovable-uploads/2e970dc1-e8bd-4b6c-badd-cd0e005681e6.png",
      alt: "Driver Equipment"
    },
    {
      src: "/lovable-uploads/72f88cbc-15c4-4d41-94fe-0de3eb6336a3.png",
      alt: "Delivery Service"
    },
    {
      src: "/lovable-uploads/e514159f-9955-4ab6-b125-cec4fa80e32c.png",
      alt: "Mobile App"
    },
    {
      src: "/lovable-uploads/71a9030d-5d42-4ab2-9094-6e27ccb2f3fe.png",
      alt: "Technology"
    },
    {
      src: "/lovable-uploads/20baac49-7e2c-4aab-beff-16091ed03fa2.png",
      alt: "Logistics"
    },
    {
      src: "/lovable-uploads/ef568fa7-7d69-42cf-9696-866a4075928b.png",
      alt: "Professional Service"
    },
    {
      src: "/lovable-uploads/8273b9c4-c7f0-464d-ba14-b2c91e9c18fc.png",
      alt: "Quality Delivery"
    }
  ];

  useEffect(() => {
    // Only disable overflow on desktop, allow scrolling on mobile
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        // Desktop - disable overflow
        document.body.style.overflow = 'hidden';
      } else {
        // Mobile - enable overflow
        document.body.style.overflow = 'unset';
      }
    };

    // Set initial state
    if (mediaQuery.matches) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    mediaQuery.addEventListener('change', handleMediaChange);
    
    return () => {
      document.body.style.overflow = 'unset';
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  const createAutoplayPlugin = () => {
    let interval: NodeJS.Timeout;
    
    return {
      name: 'autoplay',
      options: {},
      init: (embla: any) => {
        const autoplay = () => {
          if (!embla.canScrollNext()) {
            embla.scrollTo(0);
          } else {
            embla.scrollNext();
          }
        };
        
        interval = setInterval(autoplay, 3000);
      },
      destroy: () => {
        if (interval) {
          clearInterval(interval);
        }
      }
    };
  };

  const autoplayPlugin = createAutoplayPlugin();

  return (
    <div className="h-screen w-full bg-white text-black font-sans md:overflow-hidden">
      {/* Mobile Layout - Allow scrolling */}
      <div className="flex md:hidden flex-col min-h-screen relative">
        {/* Logo at the top */}
        <div className="flex justify-center pt-8 pb-4 z-20 relative">
          <Link to="/">
            <img 
              src="/lovable-uploads/4bed48db-95ec-4822-b3dd-a6c0d4c214ba.png" 
              alt="Gura Logo" 
              className="h-10 w-auto" 
            />
          </Link>
        </div>
        
        {/* Carousel section directly under logo */}
        <div className="h-64 relative mb-8">
          <MobileBackgroundCarousel 
            images={carouselImages} 
            autoplayPlugin={createAutoplayPlugin()} 
          />
        </div>
        
        {/* Main content below carousel */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 bg-white">
          <div className="space-y-6 text-center max-w-sm">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-black">
                Driver Portal Coming Soon!
              </h1>
              <p className="text-lg leading-relaxed text-gray-600">
                Join the Gura delivery team!<br />
                Sign up for updates on driver opportunities
              </p>
            </div>

            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Desktop Layout - True centering with flexbox */}
      <div className="hidden md:flex items-center justify-center h-full relative z-10">
        <div className="flex items-center gap-8 max-w-6xl">
          {/* Text Content */}
          <div className="flex-shrink-0 space-y-4 md:space-y-8 max-w-xl text-center">
            <div className="flex justify-center mb-4">
              <Link to="/">
                <img 
                  src="/lovable-uploads/4bed48db-95ec-4822-b3dd-a6c0d4c214ba.png" 
                  alt="Gura Logo" 
                  className="h-12 sm:h-10 md:h-12 w-auto" 
                />
              </Link>
            </div>
            
            <div className="space-y-2 md:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-black">
                Driver Portal Coming Soon!
              </h1>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-600">
                Join the Gura delivery team!<br />
                Sign up for updates on driver opportunities
              </p>
            </div>

            <NewsletterForm />
          </div>

          {/* Carousel Content */}
          <div className="flex-shrink-0">
            <ProductCarousel 
              images={carouselImages} 
              autoplayPlugin={autoplayPlugin} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
