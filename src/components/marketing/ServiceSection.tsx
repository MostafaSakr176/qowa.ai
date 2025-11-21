import React from 'react'
import Card from '../ui/marketing/animated-card'
import Image from 'next/image'
import { Shield, Zap, Globe, Timer } from 'lucide-react'
import { motion } from 'framer-motion'

const ServiceSection = () => {
  return (
    <section className="max-w-7xl mx-auto flex flex-col justify-center items-center">
      {/* Section Tagline */}
      <div
        className="text-white text-[12px] md:text-base flex items-center gap-2 px-4 py-2 rounded-full border border-[#9C4FFF33] mb-8"
        aria-label="Go to dashboard"
        style={{
          background: "linear-gradient(270deg, #110522 0%, #381960 100%)",
          backdropFilter: "blur(8px)",
          boxShadow: "1px -2px 3px 0px #9C4FFF40 inset",
        }}
      >
        <Image src="/media/icons/Sparkle.svg" alt="Sparkle icon" width={20} height={20} />
        <span className="bg-gradient-to-b from-[#FFFFFF] to-[#ceb0f5] bg-clip-text text-transparent">Our Services</span>
      </div>
      <h3 className="text-3xl leading-10 md:text-5xl md:leading-12 font-bold mb-3 text-center bg-[linear-gradient(180deg,_#FFFFFF_0%,_#AD6EFF_100%)] bg-clip-text text-transparent">
        Comprehensive security at development speed
      </h3>
      <p className="text-white/70 text-lg mb-14 text-center max-w-3xl mx-auto">
        Penetration testing built for modern development. Secure every release, every app, every endpoint—at the speed you ship.
      </p>
      <div className='w-full grid grid-cols-4 grid-rows-2 gap-4 md:gap-4'>
        {/* Secure against AI, with AI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-4 md:col-span-2 row-span-2 h-full"
        >
          <Card className="!bg-gradient-to-br !from-[#2E0A5C] !to-[#16062B] md:!px-4 md:!py-6">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap /> Secure against AI, with AI
            </h3>
            <div className="relative h-40 mt-2 flex flex-col justify-center">
              <p className="text-white/80 text-base mb-4">
                Fight fire with fire—run AI-powered attacks before attackers do.
              </p>
              <div className="flex items-center justify-center mt-4">
                <Image src={'/media/images/hero/about-us/icon-1.svg'} alt='icon' width={100} height={100} />
              </div>
            </div>
          </Card>
        </motion.div>
        {/* Scale without waiting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="col-span-4 md:col-span-1 row-span-1"
        >
          <Card className="!bg-gradient-to-br !from-[#2E0A5C] !to-[#16062B] md:!px-4 md:!py-6">
            <h4 className="text-white font-semibold text-base mb-1 flex items-center gap-2">
              <Timer /> Scale without waiting
            </h4>
            <p className="text-white/70 text-xs leading-snug">
              Remove bottlenecks in pentesting capacity. Validate every app, every update, in hours.
            </p>
          </Card>
        </motion.div>
        {/* Cover the entire attack surface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="col-span-4 md:col-span-1 row-span-1"
        >
          <Card className="!bg-gradient-to-br !from-[#2E0A5C] !to-[#16062B] md:!px-4 md:!py-6">
            <h4 className="text-white font-semibold text-base mb-1 flex items-center gap-2">
              <Globe /> Cover the entire attack surface
            </h4>
            <p className="text-white/70 text-xs leading-snug">
              Test every application without resource constraints or vendor capacity limits.
            </p>
          </Card>
        </motion.div>
        {/* Built for development velocity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="col-span-4 md:col-span-2 row-span-1"
        >
          <Card className="!bg-gradient-to-br !from-[#2E0A5C] !to-[#16062B] md:!px-4 md:!py-6 ">
            <h4 className="text-white font-semibold text-base mb-1 flex md:flex-col items-start gap-2">
              <Shield /> Built for development velocity
            </h4>
            <p className="text-white/70 text-xs leading-snug">
              Security testing that keeps up with how fast you ship—comprehensive results when you need them, not weeks later.
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

export default ServiceSection