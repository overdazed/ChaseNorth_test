import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroVideo from '../../assets/Blinking.mp4';

const Hero = () => {
    const container = useRef(null);
    const [position, setPosition] = useState(50);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start start", "end start"],
    });

    // Parallax effect
    const y = useTransform(scrollYProgress, [0, 1], ["0vh", "20vh"]);

    // Handle responsive positioning
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            let newPosition = 50 + (83.5 - 50) * (1 - Math.min(1, Math.max(0, (width - 640) / (1920 - 640))));
            setPosition(newPosition);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Video loop handling
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const startTime = 0;

        const handleLoadedMetadata = () => {
            video.currentTime = startTime;
        };

        const handleTimeUpdate = () => {
            if (video.currentTime >= video.duration || video.currentTime < startTime) {
                video.currentTime = startTime;
                video.play();
            }
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, []);

    const videoRef = useRef(null);

    return (
        <section className="relative h-screen overflow-hidden" ref={container}>
            {/* Video background with parallax effect */}
            <motion.div
                className="absolute inset-0 w-full h-screen overflow-hidden z-[-1] flex items-center"
                style={{ y }}
            >
                <div className="relative w-full h-full">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover transition-all duration-300 ease-out"
                        style={{
                            minWidth: '100%',
                            minHeight: '100%',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            objectPosition: `${position}% bottom`
                        }}
                    >
                        <source src={heroVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>
            </motion.div>

            {/* Hero Content */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center text-white p-6">
                    <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter uppercase mb-4">
                        {/*Vacation <br /> Ready*/}
                    </h1>
                    {/*<p className="text-sm sm:text-base md:text-lg mb-6 tracking-tighter">*/}
                    {/*    Explore our vacation-ready outfits with fast worldwide shipping.*/}
                    {/*</p>*/}
                    {/*<Link*/}
                    {/*    to="#"*/}
                    {/*    className="inline-block bg-white text-gray-950 py-2 px-6 rounded-sm text-lg transition-colors duration-300 hover:bg-gray-100"*/}
                    {/*>*/}
                    {/*    Shop Now*/}
                    {/*</Link>*/}
                </div>
            </div>
        </section>
    );
};

export default Hero;