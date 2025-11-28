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
                Trusted by security teams worldwide.
            </h3>
            <p className="text-white/70 text-lg mb-14 text-center max-w-3xl mx-auto">
                Protecting applications at scale across industries.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4 md:px-0">
                {/* Complete Coverage */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card className="flex flex-col justify-center items-center h-full w-full">
                        <h3 className="text-4xl font-bold text-white mb-2">
                            11.3K
                        </h3>
                        <p className="text-white/70 text-lg">
                            GitHub stars
                        </p>
                    </Card>
                </motion.div>

                {/* Battle-Tested Intelligence */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Card className="flex flex-col justify-center items-center h-full w-full">
                        <h3 className="text-4xl font-bold text-white mb-2">
                            20K
                        </h3>
                        <p className="text-white/70 text-lg">
                            Downloads
                        </p>
                    </Card>
                </motion.div>

                {/* (Optional) Social/Trust Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Card className="flex flex-col justify-center items-center h-full w-full">
                        <h3 className="text-4xl font-bold text-white mb-2">
                             30×
                        </h3>
                        <p className="text-white/70 text-lg">
                             Faster than manual pentesting
                        </p>
                    </Card>
                </motion.div>

            </div>
        </section>
    )
}
