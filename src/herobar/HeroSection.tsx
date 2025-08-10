import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AnimatedText } from "../animation/AnimatedText";
import HeroSectionSearch from "./HeroSectionSearch";

const HeroSection = () => {

    const heroRef = useRef<HTMLDivElement | null>(null);

    const { t } = useTranslation();

    useEffect(() => {
        if (!heroRef.current) return;
        gsap.fromTo(
            heroRef.current,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }
        );
    }, []);



    return (
        <div
            ref={heroRef}
            className="relative rounded-b-xl z-0 flex flex-col gap-y-6  items-center justify-end w-full min-h-[600px] md:min-h-[700px] text-white"
            style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?cs=srgb&dl=pexels-binyaminmellish-106399.jpg&fm=jpg)`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                willChange: "transform, opacity",
                marginTop: "-89px", // Compensate for navbar height
                paddingTop: "80px", // Add padding 
            }}
        >
            <div className="flex  justify-between w-full xl:w-[90%] relative z-10 text-left px-6 mt-20">
                <h1 className="text-4xl hidden md:block md:max-w-2xl md:text-5xl font-ManropeBold leading-relaxed ">
                    <AnimatedText text={t(`Discover a place where you will love to live`)} />
                </h1>
                <p className="mt-4 hidden md:block max-w-lg text-base md:text-lg font-ManropeMedium opacity-90">
                    <AnimatedText text={t(`Find your dream home with ease, offering the best in modern amenities and comfort.`)} />
                </p>
            </div>

            <HeroSectionSearch />


        </div>
    );
};

export default HeroSection;