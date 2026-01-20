import { motion } from "framer-motion";

export function HeroSection() {
    const heading = "dfgd Awaits dsfgdsfg sdfgsdfgsdrg sdfgsdfgsdfg sdfgsdfgsdfg";
    const subheading = "Discover the perfect fit for your next outdoor journey. " + "High-quality clothing for ethical adventurers, made to explore, made to respect.";
    const descriptions = [
        "High-quality clothing for ethical adventurers who care how they move through the world.",
        "High-quality clothing for ethical adventurers — impact without leaving a trace."
    ];

    return (
        <div className="relative flex h-[90vh] w-full items-center justify-center px-4">
            <div className="w-full max-w-[2000px]">
                <h1 className="relative z-10 mx-auto max-w-6xl text-center text-2xl font-bold text-slate-700 md:text-5xl lg:text-7xl dark:text-slate-300">
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
                    className="relative z-10 mx-auto max-w-2xl py-4 text-center md:text-lg lg:text-2xl font-normal text-neutral-600 dark:text-neutral-400"
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
                    <button className="w-48 transform rounded-lg bg-black px-6 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 md:w-56">
                        Shop Now
                    </button>
                </motion.div>
            </div>
        </div>
    );
}