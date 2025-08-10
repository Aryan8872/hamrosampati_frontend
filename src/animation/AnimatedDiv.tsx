import { easeOut, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const AnimatedDiv = ({
    children,
    animationType = "appearFrombottom",
    fromRight = false,
    styles = {},
    animation = {},
    scale = false
}: {
    children: React.ReactNode;
    animationType?: string;
    fromRight?: boolean;
    styles?: React.CSSProperties;
    animation?: { [key: string]: string | number | boolean | object };
    scale?: boolean;
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (elementRef.current) {
                const rect = elementRef.current.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.8) {
                    setIsVisible(true);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const defaultAnimation = {
        opacity: 0,
        y: 50,
        x: 0,
    };

    const smallToBig = {
        opacity: 0,
        y: 100,
        x: 0,
        scale: 0.9,
    };

    const fromRightAnimation = {
        opacity: 0,
        y: 0,
        x: 50,
    };

    const selectedAnimation =
        animationType === "smallTobig"
            ? smallToBig
            : animationType === "appearFrombottom"
                ? defaultAnimation
                : defaultAnimation;

    const finalAnimation = fromRight ? fromRightAnimation : selectedAnimation;

    return (
        <motion.div
            ref={elementRef}
            initial={finalAnimation}
            animate={isVisible ? { opacity: 1, y: 0, x: 0, scale: scale ? 1 : undefined, transition: { duration: 1.2, ease: easeOut, ...animation } } : finalAnimation}
            style={{ display: "inline", ...styles }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedDiv;
