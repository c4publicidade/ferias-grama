import { motion } from "motion/react";
import starfish from "../assets/starfish.avif";
import flower from "../assets/flower.avif";
import lifebuoy from "../assets/lifebuoy.avif";
import flipflops from "../assets/flipflops.avif";

export function BeachElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-5">
      {/* Starfish - floating bottom left */}
      <motion.img
        src={starfish}
        alt=""
        className="absolute w-16 h-16"
        style={{ top: "25%", left: "10%" }}
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Life buoy - rotating middle right */}
      <motion.img
        src={lifebuoy}
        alt=""
        className="absolute w-20 h-20"
        style={{ top: "40%", right: "3%" }}
        animate={{
          rotate: [0, 360],
          y: [0, -10, 0],
        }}
        transition={{
          rotate: {
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          },
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      {/* Flower 2 - floating bottom right */}
      <motion.img
        src={flower}
        alt=""
        className="absolute w-14 h-14"
        style={{ bottom: "15%", right: "12%" }}
        animate={{
          y: [0, -18, 0],
          rotate: [0, -12, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Flipflops - floating bottom center */}
      <motion.img
        src={flipflops}
        alt=""
        className="absolute w-16 h-16"
        style={{ bottom: "10%", left: "45%" }}
        animate={{
          y: [0, -10, 0],
          rotate: [0, 15, 0, -15, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}