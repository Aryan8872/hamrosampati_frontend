import { useTranslation } from "react-i18next";
import AnimatedDiv from "../../animation/AnimatedDiv";
import { AnimatedText } from "../../animation/AnimatedText";
import { useNavigate } from "react-router-dom";

const TrustedAdvisorsSection = () => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    return (
        <AnimatedDiv
            scale
            animationType="smallTobig"
            styles={{ display: "inline" }}
        >
            <section className="bg-buttonColor py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="text-white">
                            <AnimatedText text={t(`Trusted advisors create loyal customers`)} className="lg:text-4xl text-2xl leading-normal" />
                            <h2 className="text-4xl font-bold mb-8"></h2>
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                {[
                                    { value: '17k+', label: 'Satisfied Customers' },
                                    { value: '25+', label: 'Years of Experience' },
                                    { value: '150+', label: 'Award Winning' },
                                    { value: '25+', label: 'Property Collections' }
                                ].map((item) => (
                                    <AnimatedDiv key={item.label} animationType="appearFrombottom" styles={{ display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
                                        <div
                                            key={item.label}
                                            className="bg-white rounded-xl shadow-lg p-6 sm:w-32 md:w-44 lg:w-56 xl:w-64 2xl:w-96"
                                        >
                                            <div className="text-2xl lg:text-4xl text-black font-bold mb-2">{item.value}</div>
                                            <div className="text-base lg:text-lg text-black font-medium">{t(item.label)}</div>
                                        </div>

                                    </AnimatedDiv>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-9">
                            <AnimatedDiv styles={{ justifyContent: "end" }}>

                                <span className="text-left self-end text-white">
                                    {t("Trusted advisors build lasting relationships,ensuring customer loyalty satisfaction and long term business success through expert guidance, reliability")}.
                                </span>
                            </AnimatedDiv>
                            <AnimatedDiv >
                                <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl gap-8 p-8">
                                    <div className="flex flex-col justify-between">
                                        <p className="lg:text-base text-[0.95rem] leading-[1.5rem] text-gray-600 mb-4">
                                            {t("Trusted advisors build lasting relationships,ensuring customer loyalty through expert guidance, reliability")}.
                                        </p>
                                        <button onClick={()=>navigate("/all-properties")} className="bg-buttonColor text-base  text-white py-2 rounded-lg w-[50%] hover:bg-green-700 transition-colors">
                                            {t("Explore Now")}
                                        </button>
                                    </div>
                                    <div>
                                        <img
                                            src="https://fishtail.org/wp-content/uploads/2024/08/Dusit-Thani-Himalayan-Resort-Luxury-Properties-in-Nepal.jpeg"
                                            alt="Property"
                                            className="w-full h-64 object-cover rounded-xl"
                                        />
                                    </div>
                                </div>
                            </AnimatedDiv>
                        </div>
                    </div>
                </div>
            </section>
        </AnimatedDiv>
    );
};

export default TrustedAdvisorsSection;