// src/components/HeroSection.jsx
"use client";
import { motion } from "framer-motion";

export function HeroSection() {
    const heading = "Adventure Awaits";
    const subheading = "Discover the perfect fit for your next outdoor journey.";
    const descriptions = [
        "High-quality clothing for ethical adventurers, made to explore, made to respect.",
        "High-quality clothing for ethical adventurers who care how they move through the world.",
        "High-quality clothing for ethical adventurers — impact without leaving a trace."
    ];

    return (
        <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
            <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
                <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
            </div>
            <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
                <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
                <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            </div>
            <div className="px-4 py-10 md:py-20">
                <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
                    {heading.split(" ").map((word, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.1,
                                ease: "easeInOut",
                            }}
                            className="mr-2 inline-block"
                        >
                            {word}
                        </motion.span>
                    ))}
                </h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="relative z-10 mx-auto max-w-2xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
                >
                    {subheading}
                </motion.p>

                <div className="mt-6 space-y-4">
                    {descriptions.map((desc, index) => (
                        <motion.p
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: 0.7 + (index * 0.2)
                            }}
                            className="text-center text-sm text-neutral-500 dark:text-neutral-400"
                        >
                            {desc}
                        </motion.p>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 1.2 }}
                    className="relative z-10 mt-8 flex justify-center"
                >
                    <button className="w-48 transform rounded-lg bg-black px-6 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                        Shop Now
                    </button>
                </motion.div>
            </div>
        </div>
    );
}