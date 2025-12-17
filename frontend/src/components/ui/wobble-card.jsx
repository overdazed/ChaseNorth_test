import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const WobbleCard = ({ children, containerClassName, className, reducedBounce = false, isDay = true }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / (reducedBounce ? 30 : 15); // Less X movement for reduced bounce cards
    const y = (clientY - (rect.top + rect.height / 2)) / 20; // Same Y movement for all cards
    setMousePosition({ x, y });
  };

  return (
    <motion.section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x * (reducedBounce ? 0.3 : 0.8)}px, ${mousePosition.y * 0.8}px, 0) scale3d(1.02, 1.02, 1)`
          : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
        transition: "transform 0.15s ease-out",
      }}
      className={cn(
        `mx-auto w-full h-full relative rounded-2xl overflow-hidden ${isDay ? 'bg-neutral-50' : 'bg-neutral-950'}`,
        containerClassName
      )}
    >
      <div
        className="relative h-full w-full sm:mx-0 sm:rounded-2xl overflow-hidden"
        style={{
          boxShadow:
            "0 10px 32px rgba(34, 42, 53, 0.12), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.05), 0 4px 6px rgba(34, 42, 53, 0.08), 0 24px 108px rgba(47, 48, 55, 0.10)",
        }}
      >
        <motion.div
          style={{
            transform: isHovering
              ? `translate3d(${-mousePosition.x * (reducedBounce ? 0.3 : 0.8)}px, ${-mousePosition.y * 0.8}px, 0) scale3d(1.04, 1.04, 1)`
              : "translate3d(0px, 0px, 0) scale3d(1.1, 1.1, 1)",
            transition: "transform 0.15s ease-out",
          }}
          className={cn("h-full p-0", className)}
        >
          <Noise />
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
};

const Noise = () => {
  return (
    <div
      className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
      style={{
        backgroundImage: "url(/noise.webp)",
        backgroundSize: "30%",
      }}
    />
  );
};
