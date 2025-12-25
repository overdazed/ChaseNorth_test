// frontend/src/components/UI/CustomCursor.jsx
import { useEffect, useRef } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const dotsRef = useRef([]);
    const amount = 20;
    const mousePosition = useRef({ x: 0, y: 0 });
    const lastFrame = useRef(0);
    const idle = useRef(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        let dots = [];

        // Create cursor dots
        for (let i = 0; i < amount; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-dot';
            cursor.appendChild(dot);
            dots.push(dot);
        }
        dotsRef.current = dots;

        const handleMouseMove = (e) => {
            mousePosition.current = { x: e.clientX, y: e.clientY };
        };

        const animate = () => {
            const dots = dotsRef.current;
            let x = mousePosition.current.x;
            let y = mousePosition.current.y;

            dots.forEach((dot, index) => {
                const nextDot = dots[index + 1] || dots[0];
                const nextX = nextDot?.offsetLeft || x;
                const nextY = nextDot?.offsetTop || y;

                const size = index * 0.3 + 10;
                dot.style.width = `${size}px`;
                dot.style.height = `${size}px`;
                dot.style.opacity = 1 - index * 0.03;

                if (idle.current) {
                    y += Math.sin((index / 3) * 2) * 2;
                    x += Math.cos(index * 0.5) * 2;
                }

                const dx = nextX - x;
                const dy = nextY - y;
                x += dx * 0.2;
                y += dy * 0.2;

                dot.style.left = `${x}px`;
                dot.style.top = `${y}px`;
            });

            lastFrame.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        lastFrame.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(lastFrame.current);
            cursor.innerHTML = '';
        };
    }, []);

    return (
        <>
            <svg className="cursor-svg" xmlns="http://www.w3.org/2000/svg" version="1.1">
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -15" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
                    </filter>
                </defs>
            </svg>
            <div ref={cursorRef} className="custom-cursor" />
        </>
    );
};

export default CustomCursor;