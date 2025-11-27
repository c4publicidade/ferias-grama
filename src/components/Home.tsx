import { WeatherWidget } from "./WeatherWidget";
import { MenuGrid } from "./MenuGrid";
import { LeisureCarousel } from "./LeisureCarousel";
import { NewsCarousel } from "./NewsCarousel";
import { Footer } from "./Footer";
import { BeachElements } from "./BeachElements";
import { motion } from "motion/react";
import logo from "../assets/ferias-logo.avif";
import beachBackground from "../assets/bg-ferias.webp";
import sunglasses from "../assets/sunglasses.avif";

export default function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Beach Background */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('${beachBackground}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 0%',
          backgroundRepeat: 'no-repeat'
        }}
        animate={{
          scale: [1, 1.05, 1],
          x: [0, -10, 0, 10, 0],
          y: [0, -5, 0, 5, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Light overlay for better content visibility - REDUCED */}
      <div 
        className="fixed inset-0 pointer-events-none z-1"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,247,230,0.15) 100%)'
        }}
      />
      
      {/* Floating Decorations - TEMPORARIAMENTE DESABILITADO */}
      {/* <FloatingDecorations /> */}
      
      {/* Beach Elements - Animated PNGs */}
      <BeachElements />
      
      {/* Header - Ocean Section */}
      <div 
        className="relative pt-10 pb-40 px-4 overflow-hidden"
      >
        <div className="relative z-10 max-w-md mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <a href="/">
              <img 
                src={logo} 
                alt="Férias da Grama" 
                className="w-full max-w-xs h-auto drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(3px 3px 0px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 20px rgba(0,0,0,0.5))'
                }}
              />
            </a>
          </div>

          {/* Weather Widget */}
          <WeatherWidget />
        </div>
        
        {/* Beach Waves Transition - REMOVIDO */}
        {/* <BeachWaves /> */}
      </div>

      {/* Main Content - Beach/Sand Section */}
      <div className="max-w-md mx-auto px-4 -mt-24 pb-12 relative z-20">
        {/* Sunglasses - Between Weather and Menu */}
        <div className="flex justify-center mb-4 relative z-5">
          <motion.img
            src={sunglasses}
            alt=""
            className="w-20 h-auto"
            animate={{
              rotate: [-5, 5, -5],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        
        {/* Menu Grid */}
        <div className="mb-8">
          <MenuGrid />
        </div>

        {/* Leisure Areas Carousel */}
        <LeisureCarousel />

        {/* News Carousel */}
        <NewsCarousel />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}