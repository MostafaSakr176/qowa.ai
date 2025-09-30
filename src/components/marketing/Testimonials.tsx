'use client'
import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import required modules for autoplay
import { Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useLocale } from 'next-intl';

const testimonials = [
  {
    name: "Maya Chen",
    title: "IT Security Lead",
    img: "/media/images/hero/testmonial.png",
    featured: false,
    text: "Work with AI Defense transformed our security posture. Their AI-driven threat detection identified vulnerabilities we didn’t even know existed."
  },
  {
    name: "Adrian Blake",
    title: "CTO at Novacircle",
    img: "/media/images/hero/testmonial.png",
    featured: true,
    text: "Work with AI Defense transformed our security posture. Their AI-driven threat detection identified vulnerabilities we didn’t even know existed."
  },
  {
    name: "Maya Chen",
    title: "IT Security Lead",
    img: "/media/images/hero/testmonial.png",
    featured: false,
    text: "Work with AI Defense transformed our security posture. Their AI-driven threat detection identified vulnerabilities we didn’t even know existed."
  },
  {
    name: "Adrian Blake",
    title: "CTO at Novacircle",
    img: "/media/images/hero/testmonial.png",
    featured: true,
    text: "Work with AI Defense transformed our security posture. Their AI-driven threat detection identified vulnerabilities we didn’t even know existed."
  },
  {
    name: "Maya Chen",
    title: "IT Security Lead",
    img: "/media/images/hero/testmonial.png",
    featured: false,
    text: "Work with AI Defense transformed our security posture. Their AI-driven threat detection identified vulnerabilities we didn’t even know existed."
  },
  {
    name: "Maya Chen",
    title: "IT Security Lead",
    img: "/media/images/hero/testmonial.png",
    featured: false,
    text: "Work with AI Defense transformed our security posture. Their AI-driven threat detection identified vulnerabilities we didn’t even know existed."
  },
  {
    name: "Adrian Blake",
    title: "CTO at Novacircle",
    img: "/media/images/hero/testmonial.png",
    featured: true,
    text: "Work with AI Defense transformed our security posture. Their AI-driven threat detection identified vulnerabilities we didn’t even know existed."
  },
  {
    name: "Maya Chen",
    title: "IT Security Lead",
    img: "/media/images/hero/testmonial.png",
    featured: false,
    text: "Work with AI Defense transformed our security posture. Their AI-driven threat detection identified vulnerabilities we didn’t even know existed."
  }
];

const Testimonials = () => {
  const locale = useLocale()

  return (
    <section className="relative overflow-x-hidden py-28 mb-0">
      <Image
        src="/media/images/faq-bg.svg"
        alt=""
        width={100}
        height={100}
        className="w-xl absolute top-0 -left-[15%] transform z-2"
      />
      <Image
        src="/media/images/squars.svg"
        alt=""
        width={100}
        height={100}
        className="w-sm absolute top-0 -right-0 transform z-2"
      />
      <div className='w-full flex flex-col justify-center items-center relative z-2'>
        <div
          className="text-white text-[12px] md:text-base flex items-center gap-2 px-4 py-2 rounded-full border border-[#9C4FFF33] mb-8"
          aria-label="Go to dashboard"
          style={{
            background: "linear-gradient(270deg, #110522 0%, #381960 100%)",
            backdropFilter: "blur(8px)",
            boxShadow: "1px -2px 3px 0px #9C4FFF40 inset",

          }}
        >
          <Image src="/media/icons/Sparkle.svg" alt="Rocket icon" width={20} height={20} />

          <span className="bg-gradient-to-b from-[#FFFFFF] to-[#ceb0f5] bg-clip-text text-transparent">Testimonials</span>

        </div>
        <h3 className="text-4xl leading-10 md:text-6xl md:leading-16 font-bold mb-3 text-center  bg-[linear-gradient(180deg,_#FFFFFF_0%,_#AD6EFF_100%)] bg-clip-text text-transparent">
          What Our <br />
          Users are Saying
        </h3>
        <p className="text-white/70 text-lg mb-14 text-center max-w-3xl mx-auto">
          Our platform offers top-tier AI-driven cybersecurity and threat detection to help you stay ahead of cyber threats.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full relative"
        >
          <div className="w-full space-y-2 relative overflow-hidden px-4 md:px-0">
            <div className='h-full w-[1px] absolute -left-1 top-0 z-4 !shadow-none md:shadow-2xl'
              style={{
                boxShadow: "rgb(0 0 0) 0px 0px 140px 80px"
              }}></div>
            <div className='h-full w-[1px] absolute -right-1 top-0 z-4 !shadow-none md:shadow-2xl'
              style={{
                boxShadow: "rgb(0 0 0) 0px 0px 140px 80px"
              }}></div>
            <Swiper
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 12 },
                768: { slidesPerView: 2, spaceBetween: 16 },
                1024: { slidesPerView: 3, spaceBetween: 16 },
                1280: { slidesPerView: 4, spaceBetween: 16 },
              }}
              spaceBetween={16}
              autoplay={{ delay: 1500, disableOnInteraction: false }}
              loop={true}
              speed={2000}
              centeredSlides={true}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination, Autoplay]}
            >
              {testimonials.map((t, idx) => (
                <SwiperSlide key={idx}>
                  <div className={`w-full my-2 p-4 border border-[#281545] rounded-2xl`}
                    style={{
                      background: "linear-gradient(180deg, #1C053A 0%, #0B0019 44%)",
                      boxShadow: "0px -1px 0px #9440FF"
                    }}>
                    <div className="flex justify-between items-center mb-4">
                      <div className='flex flex-col items-start'>
                        <span className="text-white font-normal text-base">{t.name}</span>
                        <span className="text-white/60 text-xs">{t.title}</span>
                      </div>
                      <Image src={t.img} alt={t.name} width={48} height={48} className="!w-12 !h-12 rounded-full object-cover" />

                    </div>
                    <p className="text-[#DEC4FF] text-sm font-normal">
                      {t.text}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <Swiper
              dir={locale === "en" ? "rtl" : "ltr"}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 12 },
                768: { slidesPerView: 2, spaceBetween: 16 },
                1024: { slidesPerView: 3, spaceBetween: 16 },
                1280: { slidesPerView: 4, spaceBetween: 16 },
              }}
              spaceBetween={16}
              autoplay={{ delay: 1500, disableOnInteraction: false }}
              loop={true}
              speed={2000}
              centeredSlides={false}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination, Autoplay]}
              className="mySwiper"
            >
              {testimonials.map((t, idx) => (
                <SwiperSlide key={idx}>
                  <div
                    dir={locale === "en" ? "ltr" : "rtl"}
                    className={`w-full my-2 p-4 border border-[#281545] rounded-2xl`}
                    style={{
                      background: "linear-gradient(180deg, #1C053A 0%, #0B0019 44%)",
                      boxShadow: "0px -1px 0px #9440FF"
                    }}>
                    <div className="flex justify-between items-center mb-4">
                      <div className='flex flex-col items-start'>
                        <span className="text-white font-normal text-base">{t.name}</span>
                        <span className="text-white/60 text-xs">{t.title}</span>
                      </div>
                      <Image src={t.img} alt={t.name} width={48} height={48} className="!w-12 !h-12 rounded-full object-cover" />

                    </div>
                    <p className="text-[#DEC4FF] text-sm font-normal">
                      {t.text}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>
      </div>

    </section>
  )
}

export default Testimonials