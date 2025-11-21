'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Card from '../ui/marketing/animated-card'
import Image from 'next/image'

export default function AboutUs() {
    return (
        <section className="max-w-7xl mx-auto flex flex-col justify-center items-center ">
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
                <span className="bg-gradient-to-b from-[#FFFFFF] to-[#ceb0f5] bg-clip-text text-transparent">About Us</span>
            </div>
            <h3 className="text-3xl leading-10 md:text-5xl md:leading-12 font-bold mb-3 text-center bg-[linear-gradient(180deg,_#FFFFFF_0%,_#AD6EFF_100%)] bg-clip-text text-transparent">
                Penetration Testing, Reinvented by AI
            </h3>
            <p className="text-white/70 text-lg mb-14 text-center max-w-3xl mx-auto">
                Autonomous AI agents, instant pentesting, and proven results. Discover vulnerabilities before attackers do—faster, deeper, and with complete coverage.
            </p>
            <div className="grid grid-cols-6 gap-6">

                {/* Autonomous AI Agents */}
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
                                    Autonomous AI Agents
                                </h3>
                                <p className="text-white/70 text-sm">
                                    Think like hackers, work like machines.<br />
                                    Deploy hundreds of specialized AI agents that collaborate to find vulnerabilities.
                                </p>
                            </div>

                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-3xl p-4 space-y-6 border border-white/30 transition-all duration-400 transform hover:-translate-y-2.5 hover:shadow-2xl">
                                    <div className="h-16 rounded flex items-end justify-between px-2">
                                        <Image src={'/media/images/hero/about-us/Line.svg'} alt='line' width={100} height={100} className='w-full' />
                                    </div>
                                    <h4 className="text-white text-[10px] md:text-[14px] flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md w-full">
                                        AI Collaboration
                                    </h4>
                                </div>

                                <div className="rounded-3xl p-4 space-y-6 border border-white/30 transition-all duration-400 transform hover:-translate-y-2.5 hover:shadow-2xl">
                                    <div className="h-16 rounded flex items-end justify-between px-2">
                                        {[20, 45, 30, 60, 40, 80, 35, 20, 45, 30, 60, 40, 80, 35, 20, 45, 30, 60, 40, 80, 35].map((height, index) => (
                                            <div
                                                key={index}
                                                className="bg-[#560D9E] rounded"
                                                style={{ height: `${height}%`, width: '4px' }}
                                            />
                                        ))}
                                    </div>
                                    <h4 className="text-white text-[10px] md:text-[14px] flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md w-full">
                                        Automated Reconnaissance
                                    </h4>
                                </div>
                            </div> */}
                        </div>
                    </Card>
                </motion.div>

                {/* On-demand Pentesting */}
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
                                    On-demand Pentesting
                                </h3>
                                <p className="text-white/70 text-sm">
                                    Pentest your latest update, in hours.<br />
                                    No scheduling, no delays. Just push your code and watch XBOW get to work.
                                </p>
                            </div>

                            {/* <div className="grid grid-cols-3 gap-6 lg:gap-14">
                                <div className='col-span-3 md:col-span-1'>
                                    <h4 className="text-white text-[14px] flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md">
                                        Instant Launch
                                    </h4>
                                </div>
                                <div className='col-span-3 md:col-span-2 grid grid-cols-4 gap-4'>
                                    <div className='flex items-center justify-center p-3 w-14 h-14 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md transition-all duration-400 transform hover:-translate-y-2.5 hover:shadow-2xl'>
                                        <Image src={'/media/images/hero/about-us/icon-1.svg'} alt='icon' width={100} height={100} className='w-full' />
                                    </div>
                                    <div className='flex items-center justify-center p-3 w-14 h-14 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md transition-all duration-400 transform hover:-translate-y-2.5 hover:shadow-2xl'>
                                        <Image src={'/media/images/hero/about-us/icon-2.svg'} alt='icon' width={100} height={100} className='w-full' />
                                    </div>
                                    <div className='flex items-center justify-center p-3 w-14 h-14 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md transition-all duration-400 transform hover:-translate-y-2.5 hover:shadow-2xl'>
                                        <Image src={'/media/images/hero/about-us/icon-3.svg'} alt='icon' width={100} height={100} className='w-full' />
                                    </div>
                                    <div className='flex items-center justify-center p-3 w-14 h-14 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md transition-all duration-400 transform hover:-translate-y-2.5 hover:shadow-2xl'>
                                        <Image src={'/media/images/hero/about-us/icon-4.svg'} alt='icon' width={100} height={100} className='w-full' />
                                    </div>
                                    <div className='flex items-center justify-center p-3 w-14 h-14 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md transition-all duration-400 transform hover:-translate-y-2.5 hover:shadow-2xl'>
                                        <Image src={'/media/images/hero/about-us/icon-5.svg'} alt='icon' width={100} height={100} className='w-full' />
                                    </div>
                                    <div className='flex items-center justify-center p-3 w-14 h-14 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md transition-all duration-400 transform hover:-translate-y-2.5 hover:shadow-2xl'>
                                        <Image src={'/media/images/hero/about-us/icon-6.svg'} alt='icon' width={100} height={100} className='w-full' />
                                    </div>
                                    <div className='flex items-center justify-center p-3 w-14 h-14 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md transition-all duration-400 transform hover:-translate-y-2.5 hover:shadow-2xl'>
                                        <Image src={'/media/images/hero/about-us/icon-7.svg'} alt='icon' width={100} height={100} className='w-full' />
                                    </div>
                                    <div className='flex items-center justify-center p-3 w-14 h-14 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md transition-all duration-400 transform hover:-translate-y-2.5 hover:shadow-2xl'>
                                        <Image src={'/media/images/hero/about-us/icon-8.svg'} alt='icon' width={100} height={100} className='w-full' />
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </Card>
                </motion.div>

                {/* Complete Coverage */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="col-span-6 lg:col-span-2"
                >
                    <Card className="flex flex-col h-full w-full">
                        <h3 className="text-xl font-bold text-white mb-3">
                            Complete Coverage
                        </h3>
                        <p className="text-white/70 text-sm">
                            AI coordinator ensures nothing gets missed.<br />
                            Systematic testing of every endpoint, every attack vector.
                        </p>

                        {/* <div className="flex-1 space-y-4">
                            <div className="bg-white rounded-lg py-3 px-4 flex items-center gap-3">
                                <Image src={'/media/images/hero/about-us/engin-icon.svg'} alt='icon' width={14} height={14} />
                                <span className="text-[#012C79] text-sm">Systematic Testing</span>
                            </div>
                            <button
                                className="text-white text-[16px] font-medium text-center gap-3 px-8 py-3 rounded-full w-full"
                                style={{
                                    background: "linear-gradient(180deg, #9440FF 0%, #6505E0 100%)",
                                    boxShadow: "inset 0px -14px 22.44px -12.09px #FFFFFFA3",
                                    borderBottom: "solid 3px #6505E0",
                                }}
                            >
                                Start Your Free Trial
                            </button>
                        </div> */}
                    </Card>
                </motion.div>

                {/* Battle-Tested Intelligence */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="col-span-6 lg:col-span-2"
                >
                    <Card className="flex flex-col h-full w-full">
                        <h3 className="text-xl font-bold text-white mb-3">
                            Battle-Tested Intelligence
                        </h3>
                        <p className="text-white/70 text-sm">
                            Trained by top hackers, proven in the wild.<br />
                            <span className="font-semibold text-white">1092+</span> real vulnerabilities discovered across major platforms.
                        </p>
                        {/* <div className="flex-1 flex items-center justify-center">
                            <Image src={'/media/images/hero/about-us/ropot-img.svg'} alt='icon' width={100} height={100} className='w-full' />
                        </div> */}
                    </Card>
                </motion.div>

                {/* (Optional) Social/Trust Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="col-span-6 lg:col-span-2"
                >
                    <Card className="flex flex-col h-full w-full">
                        <h3 className="text-xl font-bold text-white mb-3">
                            Trusted by Security Leaders
                        </h3>
                        <p className="text-white/70 text-sm">
                            Recognized by the world’s top organizations for penetration testing excellence.
                        </p>
                        {/* <div className="space-y-4">
                            <div className="flex gap-2">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="border border-white transition-all duration-200 hover:bg-white hover:shadow-[0_0_16px_4px_rgba(255,255,255,0.3)] rounded-lg p-3 w-12 h-12 flex justify-center items-center group"
                                    >
                                        <div className="text-lg text-white group-hover:text-[#012C79] transition-colors duration-200"><Facebook /></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-2">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="border border-white transition-all duration-200 hover:bg-white hover:shadow-[0_0_16px_4px_rgba(255,255,255,0.3)] rounded-lg p-3 w-12 h-12 flex justify-center items-center group"
                                    >
                                        <div className="text-lg text-white group-hover:text-[#012C79] transition-colors duration-200"><Facebook /></div>
                                    </div>
                                ))}
                            </div>
                        </div> */}
                    </Card>
                </motion.div>

            </div>
        </section>
    )
}
