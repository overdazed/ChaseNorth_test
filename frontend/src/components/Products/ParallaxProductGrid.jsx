// src/components/Products/ParallaxProductGrid.jsx
"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ProductGrid from "./ProductGrid";

const ParallaxProductGrid = ({ products, loading, error, isDay = true, newStarBadgeSize = 'md' }) => {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Create motion values for parallax effect
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const y4 = useTransform(scrollYProgress, [0, 1], [0, 100]);

    // Split products into 4 columns for the parallax effect
    const column1 = products?.filter((_, i) => i % 4 === 0) || [];
    const column2 = products?.filter((_, i) => i % 4 === 1) || [];
    const column3 = products?.filter((_, i) => i % 4 === 2) || [];
    const column4 = products?.filter((_, i) => i % 4 === 3) || [];

    const renderColumn = (items, yMotion, className = "") => (
        <motion.div
            style={{ y: yMotion }}
            className={className}
        >
            <ProductGrid
                products={items}
                loading={loading}
                error={error}
                isDay={isDay}
                newStarBadgeSize={newStarBadgeSize}
            />
        </motion.div>
    );

    return (
        <div
            ref={containerRef}
            className="h-[100vh] overflow-y-auto"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-[1600px] mx-auto px-4 py-40">
                {renderColumn(column1, y1)}
                {renderColumn(column2, y2)}
                {renderColumn(column3, y3)}
                {renderColumn(column4, y4)}
            </div>
        </div>
    );
};

export default ParallaxProductGrid;