import { AnimatePresence, easeIn, easeOut, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CiHeart } from "react-icons/ci";
import { FaHouseUser, FaMicroblog, FaRegBuilding, FaStore, FaUser, FaUserEdit } from "react-icons/fa";
import { FaBuildingUser, FaCircleUser } from "react-icons/fa6";
import { FiClock, FiHome, FiInfo, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import navlogo from "../../assets/logo/hamrosampati_logo.png";
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";
import { useTab } from "../../context/TabContext";
import Translator from "../Translator/Translator";
import UserNotification from "../UserNotification";

interface NavLink {
    logo: JSX.Element;
    path: string;
}

interface ProfileMenuItem {
    id: string;
    icon: JSX.Element;
    label: string;
    action: () => void;
    isDanger?: boolean;
}

interface TheNavbarProps {
    isHomePage?: boolean;
}

const TheNavbar: React.FC<TheNavbarProps> = ({ isHomePage = false }) => {
    const { t } = useTranslation();
    const { activeTab, setActiveTab } = useTab();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [openProfileMenu, setOpenProfileMenu] = useState<boolean>(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const profileButtonRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout, user } = useAuth();
    const { setPropertyQueryParamsWithSession, setCurrentPropertyPageWithSession } = useSearch();

    // Sync active tab with current URL
    useEffect(() => {
        const pathname = location.pathname;

        // Map URL paths to tab names
        const pathToTabMap: Record<string, string> = {
            '/': 'Home',
            '/all-properties': 'Home', // Default to Home for general properties page
            '/all-properties/apartment': 'Apartment',
            '/all-properties/building': 'Building',
            '/all-properties/house': 'House',
            '/all-properties/store': 'Store',
            '/blog': 'Blog',
            '/about': 'About'
        };

        // Find the matching tab for current path
        let matchingTab = pathToTabMap[pathname];

        // If no exact match, try to find partial matches for property pages
        if (!matchingTab && pathname.startsWith('/all-properties/')) {
            const propertyType = pathname.split('/')[2]; // Get the property type from URL
            if (propertyType) {
                // Capitalize first letter to match tab names
                matchingTab = propertyType.charAt(0).toUpperCase() + propertyType.slice(1);
            }
        }

        // Only update if we found a matching tab and it's different from current
        if (matchingTab && matchingTab !== activeTab) {
            setActiveTab(matchingTab);
        }
    }, [location.pathname, activeTab, setActiveTab]);

    const navContainerVariants = {
        hidden: { scaleX: 0, opacity: 0, transformOrigin: "center" },
        visible: {
            scaleX: 1,
            opacity: 1,
            transformOrigin: "center",
            transition: {
                duration: 0.8,
                ease: easeOut,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        },
    };

    const navItemVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                ease: easeOut
            }
        },
    };

    const logoVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: easeOut
            }
        },
    };

    const mobileMenuVariants = {
        hidden: { x: "-100%", opacity: 0.5 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: easeOut } },
        exit: { x: "-100%", opacity: 0, transition: { duration: 0.3, ease: easeIn } }
    };

    const mobileOverlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } }
    };

    const profileDropdownVariants = {
        hidden: {
            opacity: 0,
            scale: 0.95,
            y: -10,
            transition: {
                duration: 0.2,
                ease: easeIn
            }
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: easeOut,
                staggerChildren: 0.05
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: -10,
            transition: {
                duration: 0.2,
                ease: easeIn
            }
        }
    };

    const profileItemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.2,
                ease: easeOut
            }
        }
    };

    useEffect(() => {
        const handleScroll = (): void => {
            if (isHomePage) {
                // For home page: transparent until hero text is scrolled past
                // Text starts at: 89px (marginTop) + 80px (paddingTop) + 80px (mt-20) = 249px
                const textStartPosition = 249;
                const scrolled = window.scrollY >= textStartPosition;
                setIsScrolled(scrolled);
            } else {
                // For other pages: use original logic
                setIsScrolled(window.scrollY >= 105);
            }
        };

        // Call once on mount to set initial state
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHomePage]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);

    // Enhanced click outside handler for profile dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent): void => {
            if (
                openProfileMenu &&
                profileMenuRef.current &&
                profileButtonRef.current &&
                !profileMenuRef.current.contains(event.target as Node) &&
                !profileButtonRef.current.contains(event.target as Node)
            ) {
                setOpenProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [openProfileMenu]);

    // Close profile menu on route navigation
    useEffect(() => {
        setOpenProfileMenu(false);
    }, [navigate]);

    const navLinks: Record<string, NavLink> = {
        "Home": {
            logo: <FiHome className="mr-2" />,
            path: "/"
        },
        "Apartment": {
            logo: <FaRegBuilding className="mr-2" />,
            path: "/all-properties/apartment"
        },
        "Building": {
            logo: <FaBuildingUser className="mr-2" />,
            path: "/all-properties/building"
        },
        "House": {
            logo: <FaHouseUser className="mr-2" />,
            path: "/all-properties/house"
        },
        "Store": {
            logo: <FaStore className="mr-2" />,
            path: "/all-properties/store"
        },
        "Blog": {
            logo: <FaMicroblog className="mr-2" />,
            path: "/blog"
        },
        "About": {
            logo: <FiInfo className="mr-2" />,
            path: "/about"
        }
    };

    const profileMenuItems: ProfileMenuItem[] = [
        {
            id: 'favorites',
            icon: <CiHeart className="h-5 w-5" />,
            label: t('Favourites'),
            action: () => navigate("/favorites")
        },
        {
            id: 'tour-history',
            icon: <FiClock className="h-5 w-5" />,
            label: t('Tour History'),
            action: () => navigate("/tour-history")
        },
        {
            id: 'edit-profile',
            icon: <FaUserEdit className="h-5 w-5" />,
            label: t('Edit Profile'),
            action: () => navigate("/edit-profile")
        },
        {
            id: 'logout',
            icon: <FiLogOut className="h-5 w-5" />,
            label: t('Logout'),
            action: logout,
            isDanger: true
        }
    ];

    const navItemAction = (item: string, path: string): void => {
        setActiveTab(item);
        navigate(path);
    };

    const setNavbarQuery = (query: string): void => {
        setPropertyQueryParamsWithSession(`propertyType=${query}`);
        setCurrentPropertyPageWithSession(1);
    };

    const handleProfileItemClick = (item: ProfileMenuItem): void => {
        item.action();
        setOpenProfileMenu(false);
    };

    const handleMobileNavClick = (item: string, path: string): void => {
        if (["Apartment", "Building", "House", "Store"].includes(item)) {
            setNavbarQuery(item.toUpperCase());
        }
        navItemAction(item, path);
        setIsMenuOpen(false);
    };

    const closeMobileMenu = (): void => {
        setIsMenuOpen(false);
    };

    return (
        <motion.nav
            className={`sticky top-0 left-0 right-0 w-full z-40 transition-all duration-300 ${isHomePage && !isScrolled
                ? 'lg:shadow-none'
                : 'bg-white lg:bg-white/95 lg:shadow-md'
                } lg:py-2 py-2`}
            style={{
                backgroundColor: isHomePage && !isScrolled ? 'rgba(0, 0, 0, 0)' : undefined,
                backdropFilter: isHomePage && !isScrolled ? 'none' : undefined
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: easeOut }}
            data-debug={`home:${isHomePage}, scrolled:${isScrolled}`}
        >
            <div className="max-w-screen-2xl mx-auto flex justify-between lg:justify-evenly items-center px-4 lg:gap-4 xl:px-6">
                <div className="flex items-center gap-2">
                    <motion.div
                        className="flex items-center bg-white rounded-full"
                        variants={logoVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <img
                            onClick={() => navigate("/")}
                            src={navlogo}
                            className="h-12 w-auto sm:h-14 md:h-16 lg:h-[60px] xl:h-[70px] 2xl:h-[60px] cursor-pointer transition-all duration-300"
                            alt="Hamro Sampati Logo"
                        />
                    </motion.div>
                    <span className={`text-lg hidden xl:block  ${(isHomePage ? (isScrolled ? 'text-black' : 'text-white') : 'text-black')} font-ManropeBold`}>{t('PropNest Nepal')}</span>
                </div>


                <motion.div
                    className={`hidden lg:flex items-center rounded-full lg:px-0 lgx:px-2 py-1 mx-4 origin-center lg:mx-0 ${isHomePage && !isScrolled
                        ? 'bg-white/20 backdrop-blur-sm'
                        : 'bg-navbarBgColor'
                        }`}
                    variants={navContainerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {Object.keys(navLinks).map((item) => (
                        <motion.button
                            key={item}
                            onClick={() => {
                                if (["Apartment", "Building", "House", "Store"].includes(item)) {
                                    setNavbarQuery(item.toUpperCase());
                                }
                                navItemAction(item, navLinks[item].path);
                            }}
                            className={`px-4 py-2 mx-1 text-sm lg:text-[13px] xl:text-[14px] xl:font-medium rounded-full flex items-center transition-all duration-300 ${activeTab === item
                                ? "bg-white border text-buttonColor font-ManropeSemiBold shadow-md"
                                : isHomePage && !isScrolled
                                    ? "text-white font-ManropeMedium hover:bg-white/20"
                                    : "text-navbarButtonTextColor font-ManropeMedium hover:bg-gray-200"
                                }`}
                            variants={navItemVariants}
                        >
                            {navLinks[item].logo}
                            {t(item)}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Auth buttons for desktop */}
                <div className="hidden lg:flex items-center space-x-7">
                    <div className="hidden lg:block">
                        <div className={`${isHomePage && !isScrolled ? '' : 'bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors rounded-md'}`}>
                            <Translator isTransparent={isHomePage && !isScrolled} />
                        </div>
                    </div>

                    {!isAuthenticated && (
                        <div className="hidden lg:flex items-center space-x-3">
                            <div
                                onClick={() => navigate("/login")}
                                className={`flex cursor-pointer flex-row items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 font-ManropeMedium ${isHomePage && !isScrolled
                                    ? 'hover:opacity-80'
                                    : 'bg-white border border-gray-300 shadow-sm hover:bg-gray-50 text-black'}`}
                            >
                                <FaUser className={`${isHomePage ? (isScrolled ? 'text-black h-7' : 'text-white h-7') : 'text-black h-7'}`} />
                                <span className={`${isHomePage ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'}`}>
                                    {t("Sign in")}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Enhanced Profile Dropdown */}
                {isAuthenticated && (
                    <div className="hidden lg:flex relative items-center gap-2">
                        {/* Removed Admin Badge */}
                        <div className="flex flex-row items-center gap-2">
                            <UserNotification
                                userId={user?.id ?? ''}
                                iconColor={isHomePage && !isScrolled ? 'text-white' : 'text-gray-600'}
                                isTransparent={isHomePage && !isScrolled}
                            />
                            <motion.div
                                ref={profileButtonRef}
                                onClick={() => setOpenProfileMenu(!openProfileMenu)}
                                className="rounded-full cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:ring-2 hover:ring-blue-100 p-1"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaCircleUser className={`h-10 w-10 transition-colors duration-200 ${isHomePage && !isScrolled ? 'text-white' : 'text-[#374151]'}`} />
                            </motion.div>
                        </div>
                        <AnimatePresence>
                            {openProfileMenu && (
                                <>
                                    <motion.div
                                        ref={profileMenuRef}
                                        className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20"
                                        variants={profileDropdownVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        style={{
                                            transformOrigin: "top right"
                                        }}
                                    >
                                        {/* Profile header */}
                                        <motion.div
                                            className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100"
                                            variants={profileItemVariants}
                                        >
                                            <p className="text-sm font-medium text-gray-900">
                                                {user?.fullName || user?.email || t("My Account")}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {t("Manage your profile")}
                                            </p>
                                        </motion.div>

                                        {/* Menu items */}
                                        <div className="py-2">
                                            {profileMenuItems.map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    variants={profileItemVariants}
                                                    onClick={() => handleProfileItemClick(item)}
                                                    className={`flex items-center px-4 py-3 text-sm cursor-pointer transition-all duration-200 ${item.isDanger
                                                        ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                        }`}
                                                    whileHover={{ x: 4 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <span className={`mr-3 ${item.isDanger ? 'text-red-500' : 'text-gray-400'}`}>
                                                        {item.icon}
                                                    </span>
                                                    <span className="font-medium">{item.label}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Mobile Menu Button */}
                <div className="flex lg:hidden items-center gap-4">
                    <div className="lg:hidden">
                        <Translator isTransparent={isHomePage && !isScrolled} />
                    </div>

                    {/* Mobile Notification Icon */}
                    {isAuthenticated && (
                        <UserNotification
                            userId={user?.id ?? ''}
                            iconColor={isHomePage && !isScrolled ? 'text-white' : 'text-gray-700'}
                            isTransparent={isHomePage && !isScrolled}
                        />
                    )}

                    <button
                        className={`lg:hidden flex items-center justify-center p-2 rounded-md transition-colors duration-200 ${isHomePage && !isScrolled
                            ? 'text-white hover:bg-white/20'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {isMenuOpen ? (
                            <FiX className={`w-6 h-6 ${isHomePage && !isScrolled ? 'text-white' : 'text-gray-800'}`} />
                        ) : (
                            <FiMenu className={`w-6 h-6 ${isHomePage && !isScrolled ? 'text-white' : 'text-gray-800'}`} />
                        )}
                    </button>
                </div>
            </div>

            {/* Enhanced Mobile navbar */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Mobile Menu */}
                        <motion.div
                            className="fixed top-0 left-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col z-50 overflow-y-auto"
                            variants={mobileMenuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {/* Mobile Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <div className="flex items-center">
                                    <img
                                        src={navlogo}
                                        className="h-10 w-auto mr-3"
                                        alt="Hamro Sampati Logo"
                                    />
                                    <div>
                                        <span className="text-indigo-800 text-lg font-bold">HamroSampati</span>
                                        <p className="text-xs text-gray-600">{t("Find your dream property")}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeMobileMenu}
                                    className="p-2 rounded-full hover:bg-white/50 transition-colors duration-200"
                                    aria-label="Close menu"
                                >
                                    <FiX className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            {/* Mobile Profile Section */}
                            {isAuthenticated && (
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-center mb-4">
                                        <FaCircleUser className="h-12 w-12 text-gray-600 mr-4" />
                                        <div>
                                            <span className="font-semibold text-gray-900 text-lg">
                                                {user?.fullName || user?.email || t("Welcome back!")}
                                            </span>
                                            <p className="text-sm text-gray-600">
                                                {t("Manage your account")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {profileMenuItems.map((item, index) => (
                                            <motion.button
                                                key={item.id}
                                                onClick={() => {
                                                    handleProfileItemClick(item);
                                                    setIsMenuOpen(false);
                                                }}
                                                className={`w-full flex items-center px-3 py-3 text-sm rounded-lg transition-all duration-200 ${item.isDanger
                                                    ? 'text-red-600 hover:bg-red-50 border border-red-100'
                                                    : 'text-gray-700 hover:bg-gray-50 border border-gray-100'
                                                    }`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <span className={`mr-3 ${item.isDanger ? 'text-red-500' : 'text-gray-500'}`}>
                                                    {item.icon}
                                                </span>
                                                <span className="font-medium">{item.label}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Navigation Links */}
                            <div className="flex-1 p-6">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                    {t("Navigation")}
                                </h3>
                                <div className="space-y-3">
                                    {Object.keys(navLinks).map((item, index) => (
                                        <motion.button
                                            key={item}
                                            onClick={() => handleMobileNavClick(item, navLinks[item].path)}
                                            className={`w-full py-4 px-4 text-base font-medium rounded-xl transition-all duration-300 flex items-center group ${activeTab === item
                                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                                                : "text-gray-700 hover:bg-gray-50 border border-gray-100"
                                                }`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span className={`mr-4 transition-transform duration-200 group-hover:scale-110 ${activeTab === item ? 'text-white' : 'text-gray-500'
                                                }`}>
                                                {navLinks[item].logo}
                                            </span>
                                            <span className="text-left">{t(item)}</span>
                                            {activeTab === item && (
                                                <motion.div
                                                    className="ml-auto w-2 h-2 bg-white rounded-full"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                />
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Auth Buttons */}
                            {!isAuthenticated && (
                                <div className="p-6 border-t border-gray-100 space-y-3">
                                    <Link to="/login" className="block w-full">
                                        <motion.button
                                            className="w-full bg-white text-buttonColor border-2 border-buttonColor px-6 py-4 rounded-xl text-base font-semibold shadow-sm hover:bg-gray-50 transition-all duration-300"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={closeMobileMenu}
                                        >
                                            {t("Sign in")}
                                        </motion.button>
                                    </Link>

                                    <Link to="/signup" className="block w-full">
                                        <motion.button
                                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={closeMobileMenu}
                                        >
                                            {t("Sign up")}
                                        </motion.button>
                                    </Link>
                                </div>
                            )}
                        </motion.div>

                        {/* Enhanced Mobile Overlay */}
                        <motion.div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            variants={mobileOverlayVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={closeMobileMenu}
                        />
                    </>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default TheNavbar;