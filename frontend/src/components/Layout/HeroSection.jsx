import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import styled from 'styled-components';

const StyledButton = styled(Link)`
  z-index: 2;
  display: block;
  width: fit-content;
  height: auto;
  outline: none;
  border: none;
  background-color: inherit;
  font-size: 24px;
  font-weight: bold;
  padding: 10px 20px;
  position: relative;
  cursor: pointer;
  text-decoration: none;
  color: #cbd5e1; /* text-slate-300 */
  text-align: center;
  margin: 0 auto;

  &::before {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    z-index: 3;
    position: absolute;
    top: 0%;
    left: 0%;
    transform: scaleX(0.2) scaleY(0.5) translate(250%, 100%);
    border-top: solid 2px #cbd5e1;
    border-left: solid 4px #cbd5e1;
    transition: all .4s ease-in-out;
  }

  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    z-index: 3;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%) scaleX(0.2) scaleY(0.5);
    border-bottom: solid 2px #cbd5e1;
    border-right: solid 4px #cbd5e1;
    transition: all .4s ease-in-out;
  }

  &:hover::before {
    transform: translate(0%, 0%) scaleX(1) scaleY(1);
    border-top: solid 1px #cbd5e1;
    border-left: solid 1px #cbd5e1;
  }

  &:hover::after {
    transform: scaleX(1) scaleY(1) translate(0%, 0%);
    border-bottom: solid 1px #cbd5e1;
    border-right: solid 1px #cbd5e1;
  }
`;

export function HeroSection() {
    const heading = "Discover the perfect fit for your next outdoor journey";
    const subheading = "High-quality clothing for ethical adventurers, made to explore, made to respect.";
    // const descriptions = [
    //     "High-quality clothing for ethical adventurers who care how they move through the world.",
    //     "High-quality clothing for ethical adventurers — impact without leaving a trace."
    // ];

    return (
        <div className="relative flex h-[95vh] w-full items-center justify-center px-4">
            <div className="w-full max-w-[2000px]">
                <h1 className="relative z-10 mx-auto max-w-6xl text-center text-2xl font-bold text-slate-700 md:text-5xl lg:text-7xl dark:text-slate-300">
                    {heading.split(" ").map((word, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.25,
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

                {/*<div className="mt-6 space-y-4">*/}
                {/*    {descriptions.map((desc, index) => (*/}
                {/*        <motion.p*/}
                {/*            key={index}*/}
                {/*            initial={{ opacity: 0, y: 10 }}*/}
                {/*            animate={{ opacity: 1, y: 0 }}*/}
                {/*            transition={{*/}
                {/*                duration: 0.3,*/}
                {/*                delay: 0.7 + (index * 0.2)*/}
                {/*            }}*/}
                {/*            className="text-center text-sm text-neutral-500 dark:text-neutral-400"*/}
                {/*        >*/}
                {/*            {desc}*/}
                {/*        </motion.p>*/}
                {/*    ))}*/}
                {/*</div>*/}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 1.2 }}
                    className="relative z-10 mt-8"
                >
                    <StyledButton to="/collections/all">
                        Shop Now
                    </StyledButton>
                </motion.div>
            </div>
        </div>
    );
}