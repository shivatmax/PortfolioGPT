import { useEffect, useRef, useState } from 'react';

/**
 * A hook to automatically scroll a container element.
 * 
 * @param ref - Reference to the scrollable HTML element
 * @param isEnabled - Whether auto-scrolling is active
 * @param speed - Pixels to scroll to per frame (default: 0.5)
 */
export const useAutoScroll = (ref: React.RefObject<HTMLDivElement>, isEnabled: boolean, speed: number = 0.5) => {
    const frameRef = useRef<number | null>(null);
    const [isUserInteracted, setIsUserInteracted] = useState(false);

    // Reset interaction state when re-enabled
    useEffect(() => {
        if (isEnabled) {
            setIsUserInteracted(false);
        }
    }, [isEnabled]);

    useEffect(() => {
        if (!isEnabled || !ref.current || isUserInteracted) return;

        const scrollContainer = ref.current;

        const animate = () => {
            // Check if reached bottom or user interaction
            if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 1 || isUserInteracted) {
                return;
            }
            scrollContainer.scrollTop += speed;
            frameRef.current = requestAnimationFrame(animate);
        };

        frameRef.current = requestAnimationFrame(animate);

        const stopScroll = () => {
            // Only set user interaction if valid scroll event (not simulated)
            setIsUserInteracted(true);
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };

        // Listen for manual interaction. 
        // Note: 'scroll' event fires on auto-scroll too, so we must rely on wheel/touch.
        scrollContainer.addEventListener('wheel', stopScroll);
        scrollContainer.addEventListener('touchstart', stopScroll);
        scrollContainer.addEventListener('mousedown', stopScroll); // For scrollbar dragging

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
            scrollContainer.removeEventListener('wheel', stopScroll);
            scrollContainer.removeEventListener('touchstart', stopScroll);
            scrollContainer.removeEventListener('mousedown', stopScroll);
        };
    }, [isEnabled, isUserInteracted, ref, speed]);

    return {
        reset: () => setIsUserInteracted(false),
        isScrolling: isEnabled && !isUserInteracted
    };
};
