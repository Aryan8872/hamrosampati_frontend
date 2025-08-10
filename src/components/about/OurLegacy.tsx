import { motion, spring, useInView } from "framer-motion";
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";

// Types
interface Statistic {
    value: string;
    label: string;
    delay: number;
}

interface CountUpProps {
    end: number;
    duration: number;
    suffix?: string;
}

const CountUp: React.FC<CountUpProps> = ({ end, duration, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView && !isVisible) {
            setIsVisible(true);
            let startTime: number;
            const animate = (currentTime: number) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                setCount(Math.floor(easeOutQuart * end));

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            requestAnimationFrame(animate);
        }
    }, [isInView, end, duration, isVisible]);

    return (
        <span ref={ref}>
            {count}{suffix}
        </span>
    );
};

const Statistics: React.FC = () => {
    const statistics: Statistic[] = [
        { value: '+100', label: 'Unit Already', delay: 0 },
        { value: '+60K', label: 'Customer', delay: 0.2 },
        { value: '99%', label: 'Satisfied', delay: 0.4 }
    ];

    return (
        <div className="grid grid-cols-3 md:grid-cols-3 gap-28 mb-16">
            {statistics.map((stat) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: stat.delay }}
                    className="text-center"
                >
                    <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{
                            duration: 0.6,
                            delay: stat.delay + 0.2,
                            type: spring,
                            stiffness: 200
                        }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-2"
                    >
                        {stat.value === '+100' && <CountUp end={100} duration={2} suffix="+" />}
                        {stat.value === '+60K' && <CountUp end={60} duration={2} suffix="K+" />}
                        {stat.value === '99%' && <CountUp end={99} duration={2} suffix="%" />}
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: stat.delay + 0.4 }}
                        className="text-gray-600 text-sm md:text-base"
                    >
                        {stat.label}
                    </motion.p>
                </motion.div>
            ))}
        </div>
    );
};

// Image Gallery Component
const ImageGallery: React.FC = () => {
    const images = [
        { id: 1, src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop', alt: 'Modern House 1' },
        { id: 2, src: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop', alt: 'Victorian House' },
        { id: 3, src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop', alt: 'Country House' },
        { id: 4, src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop', alt: 'Modern Villa' },
        { id: 5, src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop', alt: 'Luxury Home' },
        { id: 6, src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop', alt: 'Contemporary House' }
    ];

    return (
        <div className="relative w-full">
            {/* Scrolling Gallery */}
            <div className="overflow-hidden">
                <motion.div
                    className="flex space-x-6"
                    animate={{
                        x: [0, -1200],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 30,
                            ease: "linear",
                        },
                    }}
                >
                    {[...images, ...images].map((image, index) => (
                        <motion.div
                            key={`${image.id}-${index}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.6,
                                delay: (index % 6) * 0.1,
                                type: spring,
                                stiffness: 100
                            }}
                            whileHover={{
                                scale: 1.05,
                                transition: { duration: 0.3 }
                            }}
                            className="flex-shrink-0 w-72 h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Gradient Overlays */}
            <div className="absolute top-0 left-0 w-3 sm:w-32 h-full bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
            <div className="absolute top-0 right-0 w-3 sm:w-32 h-full bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
        </div>
    );
};

export const OurLegacy: React.FC = () => {
    const {t} = useTranslation()
    return (
        <div className="w-full mx-auto px-4 py-16">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-ManropeBold text-gray-900 leading-tight">
                        {t("Our Legacy of")}
                        <br />
                        <span className="text-blue-600">{t("Building Dreams")}</span>
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <p className="text-gray-600 font-ManropeMedium text-lg md:text-[18px] leading-relaxed">
                       {t("Over the years, DreamHouse has grown from a vision to a trusted real estate partner.We have helped countless families and individuals achieve their dream of homeownership,and we take immense pride in the positive impact we've made on our community.")}
                    </p>
                </motion.div>

            </div>
            <div className='flex w-full place-content-end px-16'>
                <Statistics />
            </div>

            <div>
                <ImageGallery />
            </div>
        </div>
    );
};


export default OurLegacy;