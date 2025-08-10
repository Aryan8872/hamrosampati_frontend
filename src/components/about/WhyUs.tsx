import { motion } from "framer-motion";
import { FaBuilding, FaDollarSign, FaHome, FaUser } from "react-icons/fa";
import { WhyUsCard } from "./WhyUsCard";
import { ReactNode } from "react";
import { t } from "i18next";


interface Feature {
    icon: ReactNode;
    title: string;
    subtitle: string;
}

export const WhyUs: React.FC = () => {
    const features: Feature[] = [
        {
            icon: <FaBuilding />,
            title: "WIDE RANGE OF PROPERTIES",
            subtitle: "Benefits"
        },
        {
            icon: <FaUser />,
            title: "FINEST COMMUNITY",
            subtitle: "Support"
        },
        {
            icon: <FaDollarSign />,
            title: "INVESTMENT",
            subtitle: "Interest"
        },
        {
            icon: <FaHome />,
            title: "HOMES THAT MATCH",
            subtitle: "Lifestyle"
        },

    ];

    return (
        <div className="container mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl font-ManropeBold text-gray-900 mb-8">
                    {t("Why us")}
                </h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 text-base font-ManropeMedium max-w-4xl mx-auto leading-relaxed"
                >
                    {t("Best real estate agents you will ever see in your life. If you ")}
                    <br className="hidden md:block" />
                    {t("encounter any problems do not hesitate to knock our agents")}
                </motion.p>
            </motion.div>
            <div className="flex container mx-auto flex-wrap justify-center gap-6 lg:gap-8">
                {features.map((feature, index) => (
                    <div
                        key={feature.title}
                        className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] 2xl:w-[calc(20%-20px)] min-w-[280px] max-w-[350px]"
                    >
                        <WhyUsCard feature={feature} index={index} />
                    </div>
                ))}
            </div>
        </div>
    );
};