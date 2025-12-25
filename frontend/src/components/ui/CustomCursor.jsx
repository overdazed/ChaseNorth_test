import { useEffect, useRef } from 'react';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const circleRef = useRef(null);
    const dotRef = useRef(null);

    useEffect(() => {
        if (!cursorRef.current || !circleRef.current || !dotRef.current) return;

        let pointerX = 0;
        let pointerY = 0;
        let previousPointerX = 0;
        let previousPointerY = 0;
        let angle = 0;
        let previousAngle = 0;
        let angleDisplace = 0;
        const degrees = 57.296;
        const cursorSize = 20;
        let fading = false;

        const cursor = cursorRef.current;
        const circle = circleRef.current;
        const dot = dotRef.current;

        // Initialize cursor styles
        Object.assign(cursor.style, {
            position: 'fixed',
            top: `${cursorSize / -2}px`,
            left: `${cursorSize / -2}px`,
            zIndex: '2147483647',
            width: `${cursorSize}px`,
            height: `${cursorSize}px`,
            backgroundColor: '#fff0',
            border: '1.25px solid #292927',
            borderRadius: '50%',
            boxShadow: '0 -15px 0 -8px #292927',
            transition: '250ms, transform 100ms',
            userSelect: 'none',
            pointerEvents: 'none',
            transform: 'translate3d(0, 0, 0)',
            opacity: 1
        });

        const handleMouseMove = (e) => {
            previousPointerX = pointerX;
            previousPointerY = pointerY;
            pointerX = e.pageX;
            pointerY = e.pageY;

            const distanceX = previousPointerX - pointerX;
            const distanceY = previousPointerY - pointerY;
            const distance = Math.sqrt(distanceY ** 2 + distanceX ** 2);

            // Update cursor position
            cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;

            // Handle hover effects
            const target = e.target;
            if (target.localName === 'a' ||
                target.localName === 'button' ||
                target.onclick !== null ||
                target.classList.contains('curzr-hover')) {
                cursor.style.border = '10px solid #292927';
            } else {
                cursor.style.border = '1.25px solid #292927';
            }

            // Rotate cursor
            rotateCursor(distanceX, distanceY);

            // Fade effect
            fadeEffect(distance);
        };

        const rotateCursor = (distanceX, distanceY) => {
            const unsortedAngle = Math.atan(Math.abs(distanceY) / Math.abs(distanceX)) * degrees;
            previousAngle = angle;

            if (distanceX <= 0 && distanceY >= 0) {
                angle = 90 - unsortedAngle + 0;
            } else if (distanceX < 0 && distanceY < 0) {
                angle = unsortedAngle + 90;
            } else if (distanceX >= 0 && distanceY <= 0) {
                angle = 90 - unsortedAngle + 180;
            } else if (distanceX > 0 && distanceY > 0) {
                angle = unsortedAngle + 270;
            }

            if (isNaN(angle)) {
                angle = previousAngle;
            } else {
                if (angle - previousAngle <= -270) {
                    angleDisplace += 360 + angle - previousAngle;
                } else if (angle - previousAngle >= 270) {
                    angleDisplace += angle - previousAngle - 360;
                } else {
                    angleDisplace += angle - previousAngle;
                }
            }
            cursor.style.transform += ` rotate(${angleDisplace}deg)`;
        };

        const fadeEffect = (distance) => {
            cursor.style.boxShadow = `0 ${-15 - distance}px 0 -8px #292927`;
            if (!fading) {
                fading = true;
                setTimeout(() => {
                    cursor.style.boxShadow = '0 -15px 0 -8px #29292700';
                    fading = false;
                }, 50);
            }
        };

        const handleClick = () => {
            cursor.style.transform += ' scale(0.75)';
            setTimeout(() => {
                cursor.style.transform = cursor.style.transform.replace(' scale(0.75)', '');
            }, 35);
        };

        // Add event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('click', handleClick);

        // Show cursor after initialization
        cursor.style.opacity = '1';

        // Cleanup
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('click', handleClick);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="curzr-cursor"
            style={{ opacity: 0 }} // Start hidden, will be shown after initialization
        >
            <div ref={circleRef} className="curzr-circle"></div>
            <div ref={dotRef} className="curzr-dot"></div>
        </div>
    );
};

export default CustomCursor;