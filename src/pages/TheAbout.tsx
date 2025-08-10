import { motion, spring, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import aboutbg from "../assets/aboutbg.png";
import abouthero from "../assets/abouthero.jpg";
import OurLegacy from '../components/about/OurLegacy';
import { MeetDreamTeam } from '../components/about/TeamMember';
import { WhyUs } from '../components/about/WhyUs';

const TheAbout = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const heroInView = useInView(heroRef, { once: true, amount: 0.1 });

  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.1 });

  const slideUp = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: spring, damping: 15, stiffness: 100 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, when: "beforeChildren" }
    }
  };


  const testimonials = [
    {
      quote: t('Found us the perfect family home in our desired school district within our budget.'),
      author: t('The Rodriguez Family'),
      rating: 5
    },
    {
      quote: t('Sold our condo for 15% above asking price in just 9 days!'),
      author: t('Mark & Susan T.'),
      rating: 5
    },
    {
      quote: t('Managed our rental property flawlessly for 3 years with great tenants.'),
      author: t('Investor Group LLC'),
      rating: 4
    }
  ];

  return (
    <div className="bg-white">
      <section className="w-full h-[720px] relative bg-gray-50 ">
        <img className='w-full h-full object-cover ' src={abouthero} />
        <div className="absolute z-10 bg-[rgba(0,0,0,0.2)] w-full h-full top-0"></div>
        <div className="absolute  z-20 left-0 top-[40%] sm:left-[10%]  sm:max-w-7xl px-4 sm:mx-auto sm:px-6 lg:px-8">
          <motion.div
            ref={heroRef}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="relative "
          >

            <motion.h1
              variants={slideUp}
              className="text-4xl lg:text-6xl  sm:max-w-4xl sm:text-right  font-ManropeBold text-white mb-6 leading-relaxed"
            >
              {t('More Than Just Real Estate, We Build Dreams')}
            </motion.h1>
            <motion.p
              variants={slideUp}
              className="text-base ml-7 pl-14 md:text-lg font-ManropeRegular text-white text-left max-w-2xl mr-auto leading-relaxed"
            >
              {t("We understand that buying a home is more than just a transaction.It's about building a future, creating memories, and finding a place to belong.")}
            </motion.p>

          </motion.div>
        </div>
      </section>

      <section className="pt-20">
        <OurLegacy />
      </section>

      <section className="py-20">
        <WhyUs />
      </section>


      <section className="py-20 bg-gray-50">
        <MeetDreamTeam />
      </section>


      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            ref={testimonialsRef}
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.div
              variants={slideUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("Client Testimonials")}</h2>
              <p className="text-blue-100 max-w-2xl mx-auto">
                {t("Hear what our clients say about their experience")}
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={slideUp}
                  className="bg-white p-8 rounded-xl shadow-lg"
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                  <p className="text-gray-900 font-medium">— {testimonial.author}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="my-20 h-[750px]">
        <div className="relative w-full h-full text-center">
          <img
            loading='lazy'
            className='z-0 w-full h-full object-cover' style={{ objectPosition: '0% 100%' }} src={aboutbg} />
          <div className='z-10 absolute top-0 w-full h-full bg-[rgba(0,0,0,0.3)]'></div>
          <div className='absolute z-20 w-full top-[40%] left-[50%] translate-x-[-50%]'>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className='w-full px-4'
              variants={staggerContainer}
            >
              <motion.h2
                variants={slideUp}
                className="text-3xl md:text-4xl font-bold text-white mb-6"
              >
                {t("Find Your Dream Home Faster")}
              </motion.h2>
              <motion.p
                variants={slideUp}
                className="text-gray-300 mb-8 max-w-2xl mx-auto text-center"
              >
                {t("Dive into a world of comfort and convenience as we connect you with the finest hotels, ensuring a perfect getaway tailored to your preferences")}
              </motion.p>
              <motion.div
                variants={slideUp}
              >
                <button className="px-8 py-3.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300">
                  {t("Get Started")}
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TheAbout;