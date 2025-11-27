import { motion } from "motion/react";
import butterfly from "figma:asset/a5450697d83cc07e46b9889f5f6c1775dbbc6f96.png";
import palmLeafH from "figma:asset/5b58f00cc03af7c7b464ed1c95e6b06af5d00af4.png";
import palmLeafV from "figma:asset/ee2ff73f8abdd4b1d742eb2cbb1e4e69d05af8e6.png";
import starfishBlue1 from "figma:asset/e58b33f13eea78bbdac68f57e7efbcf8c6af2cbd.png";
import crab from "figma:asset/c55ec2c35df70e7ffc85af03e9f8555e10adc2a0.png";
import umbrella from "figma:asset/f925e0d12df1da0802da49e8d7cf6ad32374d0ff.png";
import sunscreen from "figma:asset/35c56e60c19d30a81d3b0ba5d2d77e2e72c92d2b.png";
import starfishBlue2 from "figma:asset/cadd091ff48dec914e6de11e39b0e28d82ff46ec.png";
import lifebuoy from "figma:asset/c51adbfc7ca87f6e0fac9a9db2b1f9aa5fd2a25e.png";
import starfishOrange from "figma:asset/104ff5b2c202ea29df61402644b1dee7dd21aa15.png";
import sunglasses from "figma:asset/ff7c2960458345b8063718ad706b20659cd6bb9c.png";
import flipflops from "figma:asset/eb11a6276156bc4bd28ddc7b379471512b3e9880.png";

interface Decoration {
  image: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  size: string;
  rotation: number;
  animationDelay: number;
  animationDuration: number;
  opacity?: number;
}

const decorations: Decoration[] = [
  // Header area
  {
    image: butterfly,
    position: { top: "120px", right: "5%" },
    size: "80px",
    rotation: -15,
    animationDelay: 0,
    animationDuration: 4,
    opacity: 0.9
  },
  {
    image: palmLeafH,
    position: { top: "80px", left: "-30px" },
    size: "120px",
    rotation: 20,
    animationDelay: 1,
    animationDuration: 5,
    opacity: 0.7
  },
  {
    image: starfishOrange,
    position: { top: "200px", left: "10%" },
    size: "70px",
    rotation: 30,
    animationDelay: 0.5,
    animationDuration: 6,
    opacity: 0.8
  },
  
  // Menu area
  {
    image: sunglasses,
    position: { top: "420px", right: "-15px" },
    size: "90px",
    rotation: -20,
    animationDelay: 2,
    animationDuration: 4.5,
    opacity: 0.85
  },
  {
    image: crab,
    position: { top: "500px", left: "5%" },
    size: "75px",
    rotation: 10,
    animationDelay: 1.5,
    animationDuration: 5.5,
    opacity: 0.8
  },
  
  // Leisure carousel area
  {
    image: umbrella,
    position: { top: "700px", right: "8%" },
    size: "85px",
    rotation: -10,
    animationDelay: 0.8,
    animationDuration: 5,
    opacity: 0.85
  },
  {
    image: starfishBlue1,
    position: { top: "800px", left: "5%" },
    size: "75px",
    rotation: 45,
    animationDelay: 2.5,
    animationDuration: 6,
    opacity: 0.75
  },
  {
    image: flipflops,
    position: { top: "900px", right: "5%" },
    size: "100px",
    rotation: 15,
    animationDelay: 1.2,
    animationDuration: 4.8,
    opacity: 0.8
  },
  
  // News carousel area
  {
    image: lifebuoy,
    position: { top: "1100px", left: "3%" },
    size: "80px",
    rotation: -25,
    animationDelay: 0.3,
    animationDuration: 5.2,
    opacity: 0.85
  },
  {
    image: sunscreen,
    position: { top: "1200px", right: "8%" },
    size: "70px",
    rotation: 20,
    animationDelay: 1.8,
    animationDuration: 4.5,
    opacity: 0.8
  },
  
  // Footer area
  {
    image: palmLeafV,
    position: { bottom: "200px", left: "-25px" },
    size: "130px",
    rotation: -15,
    animationDelay: 0.6,
    animationDuration: 6,
    opacity: 0.7
  },
  {
    image: starfishBlue2,
    position: { bottom: "150px", right: "10%" },
    size: "75px",
    rotation: -30,
    animationDelay: 2.2,
    animationDuration: 5.5,
    opacity: 0.75
  }
];

export function FloatingDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10" style={{ minHeight: '100%' }}>
      {decorations.map((decoration, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            ...decoration.position,
            width: decoration.size,
            height: decoration.size,
            opacity: decoration.opacity || 0.9
          }}
          initial={{ 
            rotate: decoration.rotation,
            y: 0 
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [
              decoration.rotation,
              decoration.rotation + 5,
              decoration.rotation - 5,
              decoration.rotation
            ]
          }}
          transition={{
            duration: decoration.animationDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: decoration.animationDelay
          }}
        >
          <img
            src={decoration.image}
            alt="decoração"
            className="w-full h-full object-contain drop-shadow-2xl"
            style={{ 
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              imageRendering: 'auto'
            }}
            onError={(e) => {
              console.error('Erro ao carregar imagem decorativa:', decoration.image);
              e.currentTarget.style.display = 'none';
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}