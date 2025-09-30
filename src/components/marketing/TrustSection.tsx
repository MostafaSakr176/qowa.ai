'use client'
import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
// Import required modules for autoplay
import { Autoplay } from 'swiper/modules';

import Image from 'next/image';

export default function TrustSection() {
    return (
        <section className='flex flex-col justify-center items-center gap-12 md:gap-8 mb-0'>

            <div>
                <h3 className="text-4xl leading-10 md:text-6xl md:leading-16 font-bold mb-3 text-center  bg-[linear-gradient(180deg,_#FFFFFF_0%,_#AD6EFF_100%)] bg-clip-text text-transparent">
                    Robust Security for  <br />
                    Complete Peace of Mind
                </h3>
                <p className="text-white/70 text-lg mb-14 text-center max-w-3xl mx-auto">
                    Our platform offers top-tier AI-driven cybersecurity and threat detection to help you stay ahead of cyber threats.
                </p>
            </div>

            <div className='w-2xl relative flex items-center justify-center'>
                {/* Animated shadow under the shield */}
                <span
                    className="absolute left-1/2 bottom-1/5 -translate-x-1/2 w-30 h-4 rounded-[50%] pointer-events-none z-3 bg-[#0000004D]"
                    style={{
                        animation: "shadowPulse 2.5s ease-in-out infinite",
                    }}
                />
                {/* Floating shield logo */}
                <div
                    className="absolute inset-0 flex items-center justify-center z-10"
                    style={{
                        animation: "floatY 2.5s ease-in-out infinite",
                    }}
                >
                    <Image
                        src={"/media/images/logos/logo-shield.svg"}
                        alt="Logo Contain"
                        width={100}
                        height={100}
                        className="w-48"
                    />
                </div>
                <Image
                    src={"/media/images/logo-contain.svg"}
                    alt="Logo Contain"
                    width={100}
                    height={100}
                    className="w-full"
                />
            </div>

            <Swiper
                modules={[Autoplay]}
                loop={true}
                speed={4000}
                autoplay={{
                    delay: 0,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                }}
                allowTouchMove={false}
                className="mySwiper"
                style={{ width: '100%', opacity: 0.7 }}
                breakpoints={{
                    0: {
                        slidesPerView: 2,
                        spaceBetween: 12,
                    },
                    480: {
                        slidesPerView: 2,
                        spaceBetween: 16,
                    },
                    768: {
                        slidesPerView: 4,
                        spaceBetween: 24,
                    },
                    1024: {
                        slidesPerView: 6,
                        spaceBetween: 30,
                    },
                }}
            >
                <SwiperSlide>
                    <Image src={'/media/images/hero/logo-1.svg'} alt='logo' width={100} height={100} />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={'/media/images/hero/logo-2.svg'} alt='logo' width={100} height={100} />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={'/media/images/hero/logo-3.svg'} alt='logo' width={100} height={100} />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={'/media/images/hero/logo-1.svg'} alt='logo' width={100} height={100} />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={'/media/images/hero/logo-2.svg'} alt='logo' width={100} height={100} />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={'/media/images/hero/logo-3.svg'} alt='logo' width={100} height={100} />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={'/media/images/hero/logo-1.svg'} alt='logo' width={100} height={100} />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={'/media/images/hero/logo-2.svg'} alt='logo' width={100} height={100} />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={'/media/images/hero/logo-3.svg'} alt='logo' width={100} height={100} />
                </SwiperSlide>
            </Swiper>

        </section>
    )
}
