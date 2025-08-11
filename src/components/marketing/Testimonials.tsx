'use client'
import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import required modules for autoplay
import { Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion'
import { BookmarkCheck } from 'lucide-react'
import Image from 'next/image'

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
  }
];

const Testimonials = () => {
  return (
    <section className="px-4 max-w-7xl mx-auto flex flex-col justify-center items-center ">
      <span className="text-white text-center inline-block text-[14px] px-4 py-2 mb-10 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.05)]">
        Testimonials
      </span>
      <h3 className="text-2xl leading-8 md:text-6xl md:leading-20 font-bold mb-3 text-center  bg-[radial-gradient(70.71%_70.71%_at_50%_50%,_#FFFFFF_0%,_#B5CFFF_56%)] bg-clip-text text-transparent">
        System Analytics Real-Time Monitoring
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
      <div className="w-full relative">
        <Swiper
          modules={[Autoplay]}
          loop={true}
          speed={1000}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          allowTouchMove={true}
          className="mySwiper"
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 12,
            },
            480: {
              slidesPerView: 1,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
        >
          {testimonials.map((t, idx) => (
            <SwiperSlide key={idx}>
              <div className={`w-full relative my-8 ${t.featured ? 'bg-gradient-to-br from-[#2B3990]/60 to-[#1B2653]/80 border border-white/30 shadow-xl' : 'bg-white/5 border border-white/20 shadow-lg'} rounded-2xl p-6 flex flex-col items-center text-center relative`}>
                {t.featured && (
                  <div className="absolute -top-5 right-4 !w-10 !h-10 p-1 flex justify-center items-center rounded-lg rotate-12 object-cover mb-2 border border-white/30">
                    <BookmarkCheck size={36} strokeWidth={1} />
                  </div>
                )}
                {/* Stars */}
                <div className="flex justify-center mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/80 text-sm font-normal mb-6">
                  {t.text}
                </p>
                <div className="flex flex-col items-center">
                  <Image src={t.img} alt={t.name} width={50} height={50} className="!w-20 !h-20 rounded-full object-cover mb-2 border-2 border-white/30" />
                  <span className="text-white font-normal text-[20px]">{t.name}</span>
                  <span className="text-white/60 text-sm">{t.title}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      </motion.div>
    </section>
  )
}

export default Testimonials