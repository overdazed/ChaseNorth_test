import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
} from "framer-motion";
import { useRef } from "react";

export const VelocityText = () => {
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const scrollVelocity = useVelocity(scrollYProgress);

  const skewXRaw = useTransform(
    scrollVelocity,
    [-0.5, 0.5],
    ["45deg", "-45deg"]
  );
  const skewX = useSpring(skewXRaw, { mass: 3, stiffness: 400, damping: 50 });

  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -4000]);
  const x = useSpring(xRaw, { mass: 3, stiffness: 400, damping: 50 });

  const text = "The world beyond awaits those who dare to ";
  // Repeat the text multiple times for a continuous effect
  const repeatedText = text.repeat(10);

  return (
    <section
      ref={targetRef}
      className="h-[1000vh] bg-neutral-50 text-neutral-950"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.p
          style={{ skewX, x }}
          className="origin-bottom-left whitespace-nowrap text-5xl font-black uppercase leading-[0.85] md:text-7xl md:leading-[0.85]"
        >
          {repeatedText}
        </motion.p>
      </div>
    </section>
  );
};

export default VelocityText;
