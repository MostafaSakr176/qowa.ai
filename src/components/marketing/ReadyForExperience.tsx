import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Card from '../ui/marketing/animated-card'

const ReadyForExperience = () => {
    return (
        <section className="w-full px-4 max-w-7xl mx-auto flex justify-center items-center bg-transparent">
            <Card
                className="relative w-full overflow-hidden !p-0 rounded-2xl bg-gradient-to-br from-[#0A1A3A] to-[#1A4DFF] shadow-xl border border-white/10"
            >
                <div className='relative z-[2] w-full h-full grid grid-cols-1 md:grid-cols-2 items-center'>
                    {/* Left: Text and CTA */}
                    <div className="p-10 flex-1 flex flex-col items-start justify-center space-y-6">
                        <h2 className="text-2xl md:text-5xl font-semibold leading-tight  bg-[radial-gradient(70.71%_70.71%_at_50%_50%,_#FFFFFF_0%,_#B5CFFF_56%)] bg-clip-text text-transparent">
                            Ready For<br />Experience
                        </h2>
                        <p className="text-white/70 text-sm">
                            No credit card required • 31-day risk-free trial • Cancel anytime.
                        </p>
                        {/* CTA Button */}
                        <Link
                            href="/dashboard"
                            className="mt-4 text-[#012C79] text-[16px] font-medium flex items-center gap-6 px-8 py-3 rounded-full transition-all duration-200 hover:bg-white/20"
                            style={{
                                background: "linear-gradient(180deg, #B5CFFF 0%, #FFFFFF 90%)",
                                border: "0.98px solid #5353533B",
                                boxShadow: "0px 0px 29.44px -4.91px #FFFFFFA3",
                            }}
                            aria-label="Start your free trial"
                        >
                            Start Your Free Trial
                        </Link>
                    </div>
                    {/* Right: Shield and icons */}
                    <div className="">
                        <Image src={'/media/images/hero/ready-for-experience.svg'} alt='ready for experience' width={100} height={100} className='w-full h-full' />
                    </div>
                </div>
                
                <Image src={'/media/images/hero/ready-for-experience-bg.svg'} alt='ready for experience' width={100} height={100} className='w-full h-full opacity-50 absolute top-0 right-0 object-cover' />

            </Card>
        </section>
    )
}

export default ReadyForExperience