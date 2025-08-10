import { useTranslation } from 'react-i18next';
import { FaDribbble, FaFacebook, FaGithub, FaLinkedin, FaPeace, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <>
            <div className="bg-[#EDECF2] text-black mt-14">
                <div className="max-w-7xl mx-auto py-16 px-3 smx:px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
                        <div className="flex-1">
                            <h2 className="text-2xl font-ManropeBold">{t("Stay Updated with Hamro Sampati")}</h2>
                            <p className="w-[80%] text-black mt-2 font-ManropeRegular break-words">{t("Subscribe to our newsletter for the latest property listings, market trends, and exclusive offers. No spam, just valuable insights.")}</p>
                        </div>
                        <div className="flex w-auto ">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 font-ManropeMedium md:w-72 px-1 py-3 text-gray-900 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="bg-buttonColor text-white font-ManropeMedium hover:bg-buttonColor/60 px-6 py-3 rounded-r-lg transition-colors duration-300">
                                {t("Subscribe")}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t text-black border-gray-800">
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
                            <div className="col-span-1 md:col-span-2 lg:col-span-2">
                                <span className='text-buttonColor text-3xl  font-ManropeBold'>HamroSampati</span>
                                <p className="text-black text-sm font-ManropeMedium mt-5 max-w-md">
                                    {t("Hamro Sampati is your trusted partner in finding the perfect property in Japan. Whether you're looking to buy, sell, or rent, we provide comprehensive support and the latest listings.")}
                                </p>
                            </div>

                            {/* Property Listings */}
                            <div className='text-black'>
                                <h3 className="text-sm font-ManropeMedium text-black mb-4">{t("Property Listings")}</h3>
                                <ul className="space-y-3 text-sm font-ManropeMedium">
                                    <li><a href="#" className="  transition-colors">{t("Apartments for Sale")}</a></li>
                                    <li><a href="#" className=" transition-colors">{t("Houses for Sale")}</a></li>
                                    <li><a href="#" className="  transition-colors">{t("Commercial Buildings")}</a></li>
                                    <li><a href="#" className=" transition-colors">{t("Hotels & Ryokans")}</a></li>
                                    <li><a href="#" className=" transition-colors">{t("Land for Sale")}</a></li>
                                    <li><a href="#" className=" transition-colors">{t("Apartments for Rent")}</a></li>
                                    <li><a href="#" className=" transition-colors">{t("Share Houses for Rent")}</a></li>
                                </ul>
                            </div>

                            {/* Locations */}
                            <div>
                                <h3 className="text-sm font-ManropeSemiBold mb-4">{t("Locations")}</h3>
                                <ul className="space-y-3 text-sm font-ManropeSemiBold">
                                    <li><a href="#" className="transition-colors">{t("Kathmandu")}</a></li>
                                    <li><a href="#" className="transition-colors">{t("Pokhara")}</a></li>
                                    <li><a href="#" className="transition-colors">{t("Lalitpur")}</a></li>
                                    <li><a href="#" className="transition-colors">{t("Bhaktapur")}</a></li>
                                    <li><a href="#" className="transition-colors">{t("Biratnagar")}</a></li>
                                    <li><a href="#" className="transition-colors">{t("Bharatpur")}</a></li>
                                    <li><a href="#" className="transition-colors">{t("Butwal")}</a></li>
                                    <li><a href="#" className="transition-colors">{t("Dharan")}</a></li>
                                    <li><a href="#" className="transition-colors">{t("Janakpur")}</a></li>
                                    <li><a href="#" className="transition-colors">{t("Hetauda")}</a></li>
                                </ul>
                            </div>

                            {/* Company */}
                            <div className='text-black'>
                                <h3 className="text-sm font-ManropeSemiBold text-black mb-4">{t("Company")}</h3>
                                <ul className="space-y-3 text-sm font-ManropeSemiBold">
                                    <li><a href="#" className=" transition-colors">{t("About Us")}</a></li>
                                    <li><a href="#" className=" transition-colors">{t("Contact Us")}</a></li>
                                    <li><a href="#" className=" transition-colors">{t("Terms of Use")}</a></li>
                                    <li><a href="#" className=" transition-colors">{t("Privacy Policy")}</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Footer Bottom */}
                        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                            <p className="text-black text-sm font-ManropeMedium">{t("© 2025 HamroSampati. All rights reserved.")}</p>
                            <div className="flex space-x-4 mt-4 md:mt-0">
                                <a href="#" className=" transition-colors"><FaTwitter size={20} /></a>
                                <a href="#" className=" transition-colors"><FaLinkedin size={20} /></a>
                                <a href="#" className=" transition-colors"><FaFacebook size={20} /></a>
                                <a href="#" className="transition-colors"><FaGithub size={20} /></a>
                                <a href="#" className=" transition-colors"><FaPeace size={20} /></a>
                                <a href="#" className="transition-colors"><FaDribbble size={20} /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Footer;