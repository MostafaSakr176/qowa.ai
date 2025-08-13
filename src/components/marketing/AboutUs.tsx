'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Card from '../ui/marketing/animated-card'
import Image from 'next/image'
import { Facebook } from 'lucide-react'

export default function AboutUs() {
    return (
        <section className="px-4 max-w-7xl mx-auto flex flex-col justify-center items-center ">
            <span className="text-white text-center inline-block text-[14px] px-4 py-2 mb-10 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.05)]">
                About Us
            </span>
            <h3 className="text-2xl leading-8 md:text-6xl md:leading-20 font-bold mb-3 text-center  bg-[radial-gradient(70.71%_70.71%_at_50%_50%,_#FFFFFF_0%,_#B5CFFF_56%)] bg-clip-text text-transparent">
                System Analytics Real-Time Monitoring
            </h3>
            <p className="text-white/70 text-lg mb-14 text-center max-w-3xl mx-auto">
                Our platform offers top-tier AI-driven cybersecurity and threat detection to help you stay ahead of cyber threats.
            </p>
            <div className="grid grid-cols-6 gap-6">

                {/* System Analytics Card - Top Left */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="col-span-6 lg:col-span-3 flex"
                >
                    <Card className="flex flex-col h-full w-full">
                        <div className="flex flex-col flex-1 justify-around h-full">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-3">
                                    System Analytics Real-Time Monitoring
                                </h3>
                                <p className="text-white/70 text-sm mb-6">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* 
                                      To add a shadow on hover and translate up by 10px instead of scaling,
                                      use `hover:-translate-y-2.5` (which is roughly 10px), `transform`, and `hover:shadow-2xl` (or similar).
                                    */}
                                <div className="bg-white/10 rounded-3xl p-4 space-y-6 border-white/30 transition-all duration-400 transform hover:-translate-y-2.5 hover:shadow-2xl">
                                    <div className="h-16 rounded flex items-end justify-between px-2">
                                        <Image src={'/media/images/hero/about-us/Line.svg'} alt='line' width={100} height={100} className='w-full' />
                                    </div>
                                    <h4 className="text-white text-[10px] md:text-[14px] flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.05)] w-full">Network Activity</h4>
                                </div>

                                <div className="bg-white/10 rounded-3xl p-4 space-y-6 border-white/30 transition-all duration-400 transform hover:-translate-y-2.5 hover:shadow-2xl">
                                    <div className="h-16 rounded flex items-end justify-between px-2">
                                        {[20, 45, 30, 60, 40, 80, 35, 20, 45, 30, 60, 40, 80, 35, 20, 45, 30, 60, 40, 80, 35].map((height, index) => (
                                            <div
                                                key={index}
                                                className="bg-blue-400 rounded"
                                                style={{ height: `${height}%`, width: '4px' }}
                                            />
                                        ))}
                                    </div>
                                    <h4 className="text-white  text-[10px] md:text-[14px] flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.05)] w-full">Threat Signal</h4>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* AI Defense Card - Top Right */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="col-span-6 lg:col-span-3 flex"
                >
                    <Card className="flex flex-col h-full w-full">
                        <div className="flex flex-col flex-1 justify-around h-full">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-3">
                                    System Analytics Real-Time Monitoring
                                </h3>
                                <p className="text-white/70 text-sm mb-6">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-6 lg:gap-14">
                                <div className='col-span-3 md:col-span-1'>
                                    <h4 className="text-white text-[14px] flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.05)]">Network Activity</h4>
                                </div>
                                <div className='col-span-3 md:col-span-2 grid grid-cols-4 gap-4'>
                                    <div className='flex items-center justify-center p-3 w-14 h-14 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.05)] transition-all duration-400 transform hover:-translate-y-2.5 hover:shadow-2xl'>
                                        <Image src={'/media/images/hero/about-us/icon-1.svg'} alt='line' width={100} height={100} className='w-full' />
                                    </div>
                                    <div className='flex items-center justify-center p-3 w-14 h-14 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.05)] transition-all duration-400 transform hover:-translate-y-2.5 hover:shadow-2xl'>
                                        <Image src={'/media/images/hero/about-us/icon-2.svg'} alt='line' width={100} height={100} className='w-full' />
                                    </div>
                                    <div className='flex items-center justify-center p-3 w-14 h-14 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.05)] transition-all duration-400 transform hover:-translate-y-2.5 hover:shadow-2xl'>
                                        <Image src={'/media/images/hero/about-us/icon-3.svg'} alt='line' width={100} height={100} className='w-full' />
                                    </div>
                                    <div className='flex items-center justify-center p-3 w-14 h-14 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.05)] transition-all duration-400 transform hover:-translate-y-2.5 hover:shadow-2xl'>
                                        <Image src={'/media/images/hero/about-us/icon-4.svg'} alt='line' width={100} height={100} className='w-full' />
                                    </div>
                                    <div className='flex items-center justify-center p-3 w-14 h-14 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.05)] transition-all duration-400 transform hover:-translate-y-2.5 hover:shadow-2xl'>
                                        <Image src={'/media/images/hero/about-us/icon-5.svg'} alt='line' width={100} height={100} className='w-full' />
                                    </div>
                                    <div className='flex items-center justify-center p-3 w-14 h-14 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.05)] transition-all duration-400 transform hover:-translate-y-2.5 hover:shadow-2xl'>
                                        <Image src={'/media/images/hero/about-us/icon-6.svg'} alt='line' width={100} height={100} className='w-full' />
                                    </div>
                                    <div className='flex items-center justify-center p-3 w-14 h-14 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.05)] transition-all duration-400 transform hover:-translate-y-2.5 hover:shadow-2xl'>
                                        <Image src={'/media/images/hero/about-us/icon-7.svg'} alt='line' width={100} height={100} className='w-full' />
                                    </div>
                                    <div className='flex items-center justify-center p-3 w-14 h-14 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.05)] transition-all duration-400 transform hover:-translate-y-2.5 hover:shadow-2xl'>
                                        <Image src={'/media/images/hero/about-us/icon-8.svg'} alt='line' width={100} height={100} className='w-full' />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Auto-Defense Card - Bottom Left */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="col-span-6 lg:col-span-2"
                >
                    <Card className="flex flex-col h-full w-full">
                        <h3 className="text-xl font-bold text-white mb-3">
                            Auto-Defense Real-Time
                        </h3>
                        <p className="text-white/70 text-sm mb-6">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus
                        </p>

                        <div className="flex-1 space-y-4">
                            {/* Adaptive Engine Input */}
                            <div className="bg-white rounded-lg py-3 px-4 flex items-center gap-3">
                                <Image src={'/media/images/hero/about-us/engin-icon.svg'} alt='icon' width={14} height={14} />
                                <span className="text-[#012C79] text-sm">Adaptive Engine</span>
                            </div>

                            {/* Start Trial Button */}
                            <button className="cursor-pointer w-full bg-gradient-to-t from-[#392BD8] to-[#0054CA] text-white px-8 py-3 rounded-full font-medium flex items-center justify-center gap-3">
                                Start Your Free Trial
                                <Image src={'/media/images/hero/about-us/right-icon.svg'} alt='icon' width={20} height={20} />
                            </button>
                        </div>
                    </Card>
                </motion.div>

                {/* Security Compliance Card - Bottom Middle */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="col-span-6 lg:col-span-2"
                >
                    <Card className="flex flex-col h-full w-full !pb-0">
                        <h3 className="text-xl font-bold text-white mb-3">
                            Security Compliance AI
                        </h3>
                        <p className="text-white/70 text-sm mb-6">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus
                        </p>

                        <div className="flex-1 flex items-center justify-center">
                            {/* Robot Icon */}
                            <Image src={'/media/images/hero/about-us/ropot-img.svg'} alt='icon' width={100} height={100} className='w-full' />

                        </div>
                    </Card>
                </motion.div>

                {/* Connected Trusted Card - Bottom Right */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="col-span-6 lg:col-span-2"
                >
                    <Card className="flex flex-col h-full w-full">
                        <h3 className="text-xl font-bold text-white mb-3">
                            Connected Trusted
                        </h3>
                        <p className="text-white/70 text-sm mb-6">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus
                        </p>

                        <div className="space-y-4">
                            {/* Social Media Icons Grid */}
                            <div className="flex gap-2">
                                {/* Top Row */}
                                    <div
                                        className="border border-white transition-all duration-200 hover:bg-white hover:shadow-[0_0_16px_4px_rgba(255,255,255,0.3)] rounded-lg p-3 w-12 h-12 flex justify-center items-center group"
                                    >
                                        <div className="text-lg text-white group-hover:text-[#012C79] transition-colors duration-200"><Facebook /></div>
                                    </div>
                                    <div
                                        className="border border-white transition-all duration-200 hover:bg-white hover:shadow-[0_0_16px_4px_rgba(255,255,255,0.3)] rounded-lg p-3 w-12 h-12 flex justify-center items-center group"
                                    >
                                        <div className="text-lg text-white group-hover:text-[#012C79] transition-colors duration-200"><Facebook /></div>
                                    </div>
                                    <div
                                        className="border border-white transition-all duration-200 hover:bg-white hover:shadow-[0_0_16px_4px_rgba(255,255,255,0.3)] rounded-lg p-3 w-12 h-12 flex justify-center items-center group"
                                    >
                                        <div className="text-lg text-white group-hover:text-[#012C79] transition-colors duration-200"><Facebook /></div>
                                    </div>
                                    <div
                                        className="border border-white transition-all duration-200 hover:bg-white hover:shadow-[0_0_16px_4px_rgba(255,255,255,0.3)] rounded-lg p-3 w-12 h-12 flex justify-center items-center group"
                                    >
                                        <div className="text-lg text-white group-hover:text-[#012C79] transition-colors duration-200"><Facebook /></div>
                                    </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                {/* Bottom Row */}
                                <div
                                        className="border border-white transition-all duration-200 hover:bg-white hover:shadow-[0_0_16px_4px_rgba(255,255,255,0.3)] rounded-lg p-3 w-12 h-12 flex justify-center items-center group"
                                    >
                                        <div className="text-lg text-white group-hover:text-[#012C79] transition-colors duration-200"><Facebook /></div>
                                    </div>
                                    <div
                                        className="border border-white transition-all duration-200 hover:bg-white hover:shadow-[0_0_16px_4px_rgba(255,255,255,0.3)] rounded-lg p-3 w-12 h-12 flex justify-center items-center group"
                                    >
                                        <div className="text-lg text-white group-hover:text-[#012C79] transition-colors duration-200"><Facebook /></div>
                                    </div>
                                    <div
                                        className="border border-white transition-all duration-200 hover:bg-white hover:shadow-[0_0_16px_4px_rgba(255,255,255,0.3)] rounded-lg p-3 w-12 h-12 flex justify-center items-center group"
                                    >
                                        <div className="text-lg text-white group-hover:text-[#012C79] transition-colors duration-200"><Facebook /></div>
                                    </div>
                                    <div
                                        className="border border-white transition-all duration-200 hover:bg-white hover:shadow-[0_0_16px_4px_rgba(255,255,255,0.3)] rounded-lg p-3 w-12 h-12 flex justify-center items-center group"
                                    >
                                        <div className="text-lg text-white group-hover:text-[#012C79] transition-colors duration-200"><Facebook /></div>
                                    </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

            </div>
        </section>
    )
}
