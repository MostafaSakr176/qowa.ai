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
        Autonomous Penetration Testing
      </h3>
      <p className="text-white/70 text-lg mb-14 text-center max-w-3xl mx-auto">
        AI agents that run real attacks, find vulnerabilities, and auto-generate fixes to secure your apps.
      </p>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6'>
        {/* Scale without waiting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Card className="!bg-gradient-to-br !from-[#2E0A5C] !to-[#16062B] md:!px-4 md:!py-6">
            <h3 className="text-white font-semibold text-xl mb-4 flex gap-2">
              <Timer /> Validated Findings
            </h3>
            <p className="text-white/70 text-base">
              Every finding includes a PoC and exploit evidenbaseso you don&apos;t deal with false positives.
            </p>
          </Card>
        </motion.div>
        {/* Cover the entire attack surface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="!bg-gradient-to-br !from-[#2E0A5C] !to-[#16062B] md:!px-4 md:!py-6">
            <h3 className="text-white font-semibold text-xl mb-4 flex gap-2">
              <Globe />Complete Coverage
            </h3>
            <p className="text-white/70 text-base">
              Scans APIs, web apps, networks, GitHub/GitLab cbase and CI/CD pipelines.
            </p>
          </Card>
        </motion.div>
        {/* Built for development velocity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <Card className="!bg-gradient-to-br !from-[#2E0A5C] !to-[#16062B] md:!px-4 md:!py-6 ">
            <h3 className="text-white font-semibold text-xl mb-4 flex gap-2">
              <Shield /> Real-World Attacks
            </h3>
            <p className="text-white/70 text-base">
              Launches actual exploits to validate vulnerabilbases like elite penetration testers.
            </p>
          </Card>
        </motion.div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
        {/* Secure against AI, with AI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="!bg-gradient-to-br !from-[#2E0A5C] !to-[#16062B] md:!px-4 md:!py-6">
            <h3 className="text-white text-xl font-semibold mb-4 flex gap-2">
              <Zap /> Auto-Fix & Reports
            </h3>
              <p className="text-white/80 text-base">
                Writes detailed reports and generates production-ready fixes automatically.
              </p>
          </Card>
        </motion.div>
        {/* Secure against AI, with AI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="!bg-gradient-to-br !from-[#2E0A5C] !to-[#16062B] md:!px-4 md:!py-6">
            <h3 className="text-white text-xl font-semibold mb-4 flex gap-2">
              <Zap />24/7 Continuous Testing
            </h3>
              <p className="text-white/80 text-base">
                Never stops protecting your apps with round-the-clock monitoring.
              </p>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

export default ServiceSection