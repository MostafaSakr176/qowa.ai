import React from 'react'
import Card from '../ui/marketing/animated-card'
import Image from 'next/image'
import { Timer } from 'lucide-react'
import { motion } from 'framer-motion'

const ServiceSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 flex flex-col justify-center items-center">
      {/* Project Timeline Card */}
      <span className="text-white text-center inline-block text-[14px] px-4 py-2 mb-10 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.05)]">
        Service
      </span>
      <h3 className="text-2xl leading-8 md:text-6xl md:leading-20 font-bold mb-3 text-center  bg-[radial-gradient(70.71%_70.71%_at_50%_50%,_#FFFFFF_0%,_#B5CFFF_56%)] bg-clip-text text-transparent">
        Cybersecurity Services
      </h3>
      <p className="text-white/70 text-lg mb-14 text-center max-w-3xl mx-auto">
        Our platform offers top-tier AI-driven cybersecurity and threat detection to help you stay ahead of cyber threats.
      </p>
      <div className='w-full grid grid-cols-4 grid-rows-2 gap-4 md:gap-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-4 md:col-span-2 row-span-2 h-full"
        >
          <Card>
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <Timer />  Project Timeline
            </h3>
            {/* Timeline Chart */}

            <div className="relative h-40 mt-2">
              {/* Timeline grid lines */}
              <div className="absolute inset-0 flex justify-between px-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="border-r border-white/10 h-full" />
                ))}
              </div>
              {/* Timeline months */}
              <div className="flex justify-between text-xs text-white/60 mb-2 px-1">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
              </div>
              {/* Timeline bars */}
              <div className="absolute left-0 top-8 w-full h-28">
                {/* Bar 1 */}
                <div
                  className="absolute left-[8%] top-2 h-8 bg-[#2B5CB8] rounded-lg flex items-center px-2 text-white text-xs font-medium shadow-md"
                  style={{ width: '38%' }}
                >
                  Jan-Feb
                </div>
                {/* Bar 2 */}
                <div
                  className="absolute left-[30%] top-12 h-8 bg-[#3A7BFF] rounded-lg flex items-center px-2 text-white text-[10px] font-medium shadow-md"
                  style={{ width: '55%' }}
                >
                  Design / Development Apps
                </div>
                {/* Bar 3 */}
                <div
                  className="absolute left-[60%] top-24 h-8 bg-[#2B5CB8] rounded-lg flex items-center px-2 text-white text-xs font-medium shadow-md"
                  style={{ width: '30%' }}
                >
                  Mar-Jun
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-4 md:col-span-1 row-span-1"
        >
          <Card>
            <h4 className="text-white font-semibold text-base mb-1 flex items-center gap-2">
              <Image src={'/media/images/hero/service section/Access Control.svg'} alt='icon' width={30} height={30} />

              File Sharing</h4>
            <p className="text-white/70 text-xs leading-snug">Quickly and safely upload and share your project files.</p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-4 md:col-span-1 row-span-1"
        >
          <Card>
            <h4 className="text-white font-semibold text-base mb-1 flex items-center gap-2">
              <Image src={'/media/images/hero/service section/Access Control.svg'} alt='icon' width={30} height={30} />

              File Sharing</h4>
            <p className="text-white/70 text-xs leading-snug">Quickly and safely upload and share your project files.</p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-4 md:col-span-1 row-span-1"
        >
          <Card>
            <h4 className="text-white font-semibold text-base mb-1 flex items-center gap-2">
              <Image src={'/media/images/hero/service section/Access Control.svg'} alt='icon' width={30} height={30} />

              File Sharing</h4>
            <p className="text-white/70 text-xs leading-snug">Quickly and safely upload and share your project files.</p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-4 md:col-span-1 row-span-1"
        >
          <Card>
            <h4 className="text-white font-semibold text-base mb-1 flex items-center gap-2">
              <Image src={'/media/images/hero/service section/Access Control.svg'} alt='icon' width={30} height={30} />

              File Sharing</h4>
            <p className="text-white/70 text-xs leading-snug">Quickly and safely upload and share your project files.</p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-4 md:col-span-2 row-span-1"
        >
          <Card>
            <h4 className="text-white font-semibold text-base mb-1 flex md:flex-col items-start gap-2">
              <Image src={'/media/images/hero/service section/Access Control.svg'} alt='icon' width={30} height={30} />

              File Sharing</h4>
            <p className="text-white/70 text-xs leading-snug">Quickly and safely upload and share your project files.</p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-4 md:col-span-2 row-span-1"
        >
          <Card>
            <h4 className="text-white font-semibold text-base mb-1 flex md:flex-col items-start gap-2">
              <Image src={'/media/images/hero/service section/Access Control.svg'} alt='icon' width={30} height={30} />

              File Sharing</h4>
            <p className="text-white/70 text-xs leading-snug">Quickly and safely upload and share your project files.</p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-4 md:col-span-2 row-span-1"
        >
          <Card>
            <h4 className="text-white font-semibold text-base mb-1 flex md:flex-col items-start gap-2">
              <Image src={'/media/images/hero/service section/Access Control.svg'} alt='icon' width={30} height={30} />

              File Sharing</h4>
            <p className="text-white/70 text-xs leading-snug">Quickly and safely upload and share your project files.</p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-4 md:col-span-2 row-span-1"
        >
          <Card>
            <h4 className="text-white font-semibold text-base mb-1 flex md:flex-col items-start gap-2">
              <Image src={'/media/images/hero/service section/Access Control.svg'} alt='icon' width={30} height={30} />

              File Sharing</h4>
            <p className="text-white/70 text-xs leading-snug">Quickly and safely upload and share your project files.</p>
          </Card>
        </motion.div>
      </div>
    </section >
  )
}

export default ServiceSection