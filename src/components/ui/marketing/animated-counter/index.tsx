'use client'

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    className?: string;
}

export default function AnimatedCounter({ value, duration = 2, className = "" }: AnimatedCounterProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    // Custom intersection observer for better control
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setHasAnimated(true);
                        const startTime = Date.now();
                        const animate = () => {
                            const elapsed = Date.now() - startTime;
                            const progress = Math.min(elapsed / (duration * 1000), 1);
                            const currentCount = value * progress;
                            setCount(currentCount);

                            if (progress < 1) {
                                requestAnimationFrame(animate);
                            }
                        };
                        requestAnimationFrame(animate);
                    }
                });
            },
            { threshold: 0.1, rootMargin: "-100px" }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [value, duration, hasAnimated]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={hasAnimated ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className={`text-4xl font-bold text-white mb-2 ${className}`}
        >
            {count.toFixed(1)}%
        </motion.div>
    );
}