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
        <section className='flex flex-col justify-center items-center gap-12 md:gap-16'>

            <h2 className="text-white text-md md:text-lg flex items-center gap-2">
                Trusted by
                <span className='font-bold'>
                    2500 +
                </span>
                companies worldwide
            </h2>

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
                style={{ width: '100%' }}
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
                        slidesPerView: 5,
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
