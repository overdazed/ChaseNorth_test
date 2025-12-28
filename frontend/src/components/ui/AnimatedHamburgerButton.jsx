import { motion, MotionConfig } from "framer-motion";

const VARIANTS = {
    top: {
        open: {
            rotate: ["0deg", "0deg", "45deg"],
            top: ["25%", "50%", "50%"],
        },
        closed: {
            rotate: ["45deg", "0deg", "0deg"],
            top: ["50%", "50%", "25%"],
        },
    },
    middle: {
        open: {
            rotate: ["0deg", "0deg", "-45deg"],
        },
        closed: {
            rotate: ["-45deg", "0deg", "0deg"],
        },
    },
    bottom: {
        open: {
            rotate: ["0deg", "0deg", "45deg"],
            bottom: ["25%", "50%", "50%"],
            left: "50%",
            width: "1.5rem",
        },
        closed: {
            rotate: ["45deg", "0deg", "0deg"],
            bottom: ["50%", "50%", "25%"],
            left: "calc(50% + 6px)",
            width: "0.75rem",
        },
    },
};

const AnimatedHamburgerButton = ({ active, onClick, className = '' }) => (
    <MotionConfig
        transition={{
            duration: 0.5,
            ease: "easeInOut",
        }}
    >
        <motion.button
            initial={false}
            animate={active ? "open" : "closed"}
            onClick={onClick}
            className={`relative h-6 w-6 focus:outline-none ${className}`}
            aria-label="Toggle menu"
        >
            <motion.span
                variants={VARIANTS.top}
                className="absolute h-0.5 w-6 bg-current"
                style={{ y: "-50%", left: "50%", x: "-50%", top: "25%" }}
            />
            <motion.span
                variants={VARIANTS.middle}
                className="absolute h-0.5 w-6 bg-current"
                style={{ left: "50%", x: "-50%", top: "50%", y: "-50%" }}
            />
            <motion.span
                variants={VARIANTS.bottom}
                className="absolute h-0.5 w-3 bg-current"
                style={{
                    x: "-50%",
                    y: "50%",
                    bottom: "25%",
                    left: "50%"
                }}
            />
        </motion.button>
    </MotionConfig>
);

export default AnimatedHamburgerButton;
