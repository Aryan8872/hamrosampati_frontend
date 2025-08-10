import {  motion, spring } from "framer-motion";
import { ReactNode } from 'react';

interface Feature {
    icon: ReactNode;
    title: string;
    subtitle: string;
}

interface FeatureCardProps {
    feature: Feature;
    index: number;
}

export const WhyUsCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
    const iconColors: Record<number, string> = {
        0: 'bg-blue-500',
        1: 'bg-teal-400',
        2: 'bg-orange-500',
        3: 'bg-blue-500',
        4: 'bg-teal-400',

    };

    const bgColors: Record<number, string> = {
        0: 'bg-blue-50',
        1: 'bg-teal-50',
        2: 'bg-orange-50',
        3: 'bg-blue-50',
        4: 'bg-blue-50',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.6,
                delay: index * 0.2,
                type: spring,
                stiffness: 100
            }}
            whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 }
            }}
            className={`${bgColors[index]} p-8 sm:h-[250px] rounded-3xl w-full text-center relative overflow-hidden`}
        >
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                    duration: 0.6,
                    delay: index * 0.2 + 0.3,
                    type: spring,
                    stiffness: 200
                }}
                className={`${iconColors[index]} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6`}
            >
                <div className="w-8 h-8 text-white" >{feature.icon}</div>
            </motion.div>

            <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 0.5 }}
                className="text-base font-ManropeBold text-gray-900 mb-3 "
            >
                {feature.title}
            </motion.h3>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 0.6 }}
                className="text-gray-600 font-ManropeMedium text-sm"
            >
                {feature.subtitle}
            </motion.p>

            <motion.div
                className="absolute -top-10 -right-10 w-20 h-20 bg-white bg-opacity-30 rounded-full"
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
            <motion.div
                className="absolute -bottom-10 -left-10 w-16 h-16 bg-white bg-opacity-20 rounded-full"
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [360, 180, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease:   "linear"
                }}
            />
        </motion.div>
    );
};