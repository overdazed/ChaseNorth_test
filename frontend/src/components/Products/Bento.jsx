"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LayoutGrid } from "../ui/layout-grid";
import mensCollectionImage from "../../assets/man/winter.jpg";
import womensCollectionImage from "../../assets/woman/winter.jpg";
import topCollectionImage from "../../assets/top/winter.jpg";
import bottomCollectionImage from "../../assets/bottom/winter-2.jpg";
import {useNavigate} from "react-router-dom";


const SkeletonOne = ({ onClick }) => {
    const handleClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('SkeletonOne clicked');
        if (onClick) onClick();
    };

    return (
        <div
            onClick={handleClick}
            // className="absolute inset-0 w-full h-full z-10 p-6"
            className="relative h-full w-full group overflow-hidden"
            style={{
                pointerEvents: 'auto',
                // cursor: 'pointer'
            }}
        >
            {/* Dim overlay that disappears on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-0 transition-all duration-500 z-0"></div>

            {/* Content */}
            <div className="absolute top-6 left-5 z-10 space-y-4">
                <p className="font-bold text-white text-4xl transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out">
                    Women
                </p>
                <p className="font-normal text-base text-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out delay-100">
                    Explore our women's collection
                </p>
            </div>
            {/*<div className="absolute top-6 left-5 z-10 space-y-4">*/}
            {/*<p className="font-bold md:text-4xl text-xl text-white pl-16">*/}
            {/*    Women*/}
            {/*</p>*/}
            {/*    <p className="font-bold text-white text-4xl transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out">*/}
            {/*        Women*/}
            {/*    </p>*/}
            {/*    <p className="font-normal text-base text-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out delay-100">*/}
            {/*        Explore our women's collection*/}
            {/*    </p>*/}
            {/*</div>*/}
            {/* THIS IS BEEN SHOWN */}
            {/*<p className="font-normal text-base my-4 max-w-lg text-white">*/}
            {/*    Explore our women's collection*/}
            {/*</p>*/}
            {/*<div*/}
            {/*    className="mt-4 text-white underline"*/}
            {/*    onClick={(e) => {*/}
            {/*        e.stopPropagation();*/}
            {/*        if (onClick) onClick();*/}
            {/*    }}*/}
            {/*>*/}
            {/*    Shop now*/}
            {/*</div>*/}
        </div>
    );
};

const SkeletonTwo = () => (
    <div>
        <p className="font-bold md:text-4xl text-xl text-white">
            House above the clouds
        </p>
        <p className="font-normal text-base text-white"></p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
            Perched high above the world, this house offers breathtaking views and a
            unique living experience. It&apos;s a place where the sky meets home,
            and tranquility is a way of life.
        </p>
    </div>
);

const SkeletonThree = () => (
    <div>
        <p className="font-bold md:text-4xl text-xl text-white">
            Greens all over
        </p>
        <p className="font-normal text-base text-white"></p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
            A house surrounded by greenery and nature&apos;s beauty. It&apos;s the
            perfect place to relax, unwind, and enjoy life.
        </p>
    </div>
);

const SkeletonFour = () => (
    <div>
        <p className="font-bold md:text-4xl text-xl text-white">
            Men
        </p>
        <p className="font-normal text-base text-white"></p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
            A house by the river is a place of peace and tranquility. It&apos;s the
            perfect place to relax, unwind, and enjoy life.
        </p>
    </div>
);

const cards = [
    {
        id: 1,
        content: (
            <div
                onClick={() => {
                    console.log('Navigating to Women\'s collection');
                    navigate('/collections/all', { state: { gender: 'Women' } });
                }}
                className="absolute inset-0 w-full h-full z-10 p-6 cursor-pointer"
            >
            </div>
        ),
        className: "md:col-span-2",
        thumbnail: womensCollectionImage,
        objectPosition: "center 60%",
    },
    {
        id: 2,
        content: <SkeletonTwo />,
        className: "col-span-1",
        thumbnail: topCollectionImage,
            //"https://images.unsplash.com/photo-1464457312035-3d7d0e0c058e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: 3,
        content: <SkeletonThree />,
        className: "col-span-1",
        thumbnail: bottomCollectionImage,
            //"https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: 4,
        content: <SkeletonFour />,
        className: "md:col-span-2",
        thumbnail: mensCollectionImage,
            // "https://images.unsplash.com/photo-1475070929565-c985b496cb9f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
];

const Bento = () => {
    const navigate = useNavigate();
    const container = useRef(null);

    const handleCardClick = (path, state = {}) => {
        console.log('Navigating to:', path);
        navigate(path, { state });
    };

    const cards = [
        {
            id: 1,
            content: <SkeletonOne onClick={() => handleCardClick('/collections/all', { gender: 'Women' })} />,
            className: "md:col-span-2",
            thumbnail: womensCollectionImage,
            objectPosition: "center 60%",
        },
        {
            id: 2,
            content: <SkeletonTwo onClick={() => navigate('/collections/tops')} />,
            className: "col-span-1",
            thumbnail: topCollectionImage,
        },
        {
            id: 3,
            content: <SkeletonThree onClick={() => navigate('/collections/bottoms')} />,
            className: "col-span-1",
            thumbnail: bottomCollectionImage,
        },
        {
            id: 4,
            content: <SkeletonFour onClick={() => navigate('/collections/all', { state: { gender: 'Men' } })} />,
            className: "md:col-span-2",
            thumbnail: mensCollectionImage,
        },
    ];

    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start start", "end start"]
    });
    const yValue = useTransform(scrollYProgress, [0, 1], [0, 30]);
    const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

    const [isDaytime, setIsDaytime] = React.useState(() => {
        if (typeof window !== 'undefined') {
            const isDark = document.documentElement.classList.contains('dark');
            return !isDark;
        }
        return true;
    });

    React.useEffect(() => {
        const handleThemeChange = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setIsDaytime(!isDark);
        };

        handleThemeChange();
        window.addEventListener('themeChange', handleThemeChange);

        return () => {
            window.removeEventListener('themeChange', handleThemeChange);
        };
    }, []);

    return (
        <motion.div 
            ref={container}
            className={`relative h-screen w-full ${isDaytime ? 'bg-neutral-50' : 'bg-neutral-950'}`}
            style={{
                y: yValue,
                opacity,
                scale,
                zIndex: 10,
                position: 'relative'
            }}
        >
            <div className="h-full pb-20 pt-0">
                <LayoutGrid cards={cards} isDay={isDaytime} />
            </div>
        </motion.div>
    );
};

export default Bento;
