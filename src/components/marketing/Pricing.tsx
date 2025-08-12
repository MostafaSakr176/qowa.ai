import React from 'react'
import Card from '../ui/marketing/animated-card'
import { motion } from 'framer-motion'


const Pricing = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 flex flex-col justify-center items-center">
            {/* Project Timeline Card */}
            <span className="text-white text-center inline-block text-[14px] px-4 py-2 mb-10 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.05)]">
                Plans that suits you!
            </span>
            <h3 className="text-2xl leading-8 md:text-6xl md:leading-20 font-bold mb-3 text-center  bg-[radial-gradient(70.71%_70.71%_at_50%_50%,_#FFFFFF_0%,_#B5CFFF_56%)] bg-clip-text text-transparent">
                World with AI Defense
            </h3>
            <p className="text-white/70 text-lg mb-18 text-center max-w-3xl mx-auto">
                Our platform offers top-tier AI-driven cybersecurity and threat detection to help you stay ahead of cyber threats.
            </p>

            <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4 lg:gap-12 mt-4">
                {/* Starter Plan */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="col-span-4 md:col-span-2 row-span-2 h-full"
                >
                    <Card className='bg-white/5 border border-white/20 rounded-2xl !p-0 shadow-lg'>
                        <div className="w-full h-full p-4 lg:p-8 flex-1 max-w-sm flex flex-col items-center relative">
                            <span className="bg-white/10 text-white text-xs px-4 py-1 rounded-full border border-white/20 shadow backdrop-blur-lg">
                                Starter Plan
                            </span>
                            <div className="mt-6 mb-2 flex items-end gap-2">
                                <span className="text-4xl md:text-5xl font-bold text-white">$29</span>
                                <span className="text-white/60 text-base mb-1">/Month</span>
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2">Perfect Beginners</h4>
                            <button className="text-white w-full cursor-pointer bg-gradient-to-t from-[#392BD8] to-[#0054CA] font-semibold py-2.5 rounded-full mt-3 mb-5 transition hover:from-[#6BCBFF] hover:to-[#3A8DFF]">
                                Start Securing
                            </button>
                            <p className="text-white/60 text-sm mb-5 text-center">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, ut elit tellus.
                            </p>
                            <ul className="text-white/80 text-sm space-y-3 w-full">
                                <li>• AI-Powered Threat</li>
                                <li>• Basic Dashboard</li>
                                <li>• Daily Scan Reports</li>
                                <li>• 24/7 Monitoring</li>
                                <li>• Email Support</li>
                            </ul>
                        </div>
                    </Card>
                </motion.div>

                {/* Pro Plan */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="col-span-4 md:col-span-2 row-span-2 h-full"
                >
                    <Card className='!p-0'>
                        <div className="flex-1 w-full max-w-sm bg-gradient-to-t from-[#1A4DFF] to-[#0A1A3A] border-2 border-[#6BCBFF] rounded-2xl p-8 shadow-lg hover:shadow-2xl flex flex-col items-center relative z-10 lg:scale-110 transition-all duration-400 lg:hover:scale-115">
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1A4DFF] text-white text-xs px-5 py-2 rounded-full border border-white/20 shadow backdrop-blur-md">
                                Pro Plan
                            </span>
                            <div className="mt-6 mb-2 flex items-end gap-2">
                                <span className="text-4xl md:text-5xl font-bold text-white">$79</span>
                                <span className="text-white/60 text-base mb-1">/Month</span>
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2">Smart Protection</h4>
                            <button className="w-full bg-white text-[#012C79] font-semibold py-2.5 rounded-full mt-3 mb-5 transition hover:bg-[#e6f0ff]">
                                Start Securing
                            </button>
                            <p className="text-white/80 text-sm mb-5 text-center">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, ut elit tellus.
                            </p>
                            <ul className="text-white text-sm space-y-3 w-full">
                                <li>• All features Starter</li>
                                <li>• Real-Time Analysis</li>
                                <li>• Multi-Device</li>
                                <li>• Vulnerability Scan</li>
                                <li>• Priority Email</li>
                                <li>• Multi-Device</li>
                                <li>• Vulnerability Scan</li>
                                <li>• Priority Email</li>
                            </ul>
                        </div>
                    </Card>
                </motion.div>

                {/* Enterprise Plan */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="col-span-4 md:col-span-2 row-span-2 h-full"
                >
                    <Card className='bg-white/5 border border-white/20 rounded-2xl !p-0 shadow-lg'>
                        <div className="w-full h-full p-4 lg:p-8 flex-1 max-w-sm flex flex-col items-center relative">
                            <span className="bg-white/10 text-white text-xs px-4 py-1 rounded-full border border-white/20 shadow backdrop-blur-lg">
                                Enterprise Plan
                            </span>
                            <div className="mt-6 mb-2 flex items-end gap-2">
                                <span className="text-4xl md:text-5xl font-bold text-white">$29</span>
                                <span className="text-white/60 text-base mb-1">/Month</span>
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2">Perfect Beginners</h4>
                            <button className="text-white cursor-pointer w-full bg-gradient-to-t from-[#392BD8] to-[#0054CA] font-semibold py-2.5 rounded-full mt-3 mb-5 transition hover:from-[#6BCBFF] hover:to-[#3A8DFF]">
                                Start Securing
                            </button>
                            <p className="text-white/60 text-sm mb-5 text-center">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, ut elit tellus.
                            </p>
                            <ul className="text-white/80 text-sm space-y-3 w-full">
                                <li>• AI-Powered Threat</li>
                                <li>• Basic Dashboard</li>
                                <li>• Daily Scan Reports</li>
                                <li>• 24/7 Monitoring</li>
                                <li>• Email Support</li>
                            </ul>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </section>
    )
}

export default Pricing