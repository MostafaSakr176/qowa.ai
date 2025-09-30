import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ReadyForExperience = () => {
    return (
        <section className="w-full px-4 py-8 max-w-7xl mx-auto rounded-3xl flex justify-center items-center bg-transparent relative overflow-hidden">
            <Image
                src="/media/images/ready-for-experience-bg.svg"
                alt=""
                width={100}
                height={100}
                className="w-full absolute inset-0 transform -translate-y-1/4"
            // Responsive logo size
            />
            {/* Left: Text and CTA */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
                <Image
                    src="/media/images/logos/Logo.svg"
                    alt="Logo"
                    width={120}
                    height={80}
                    className="w-[90px] h-auto md:w-[120px] md:h-auto lg:w-[140px] lg:h-auto"
                // Responsive logo size
                />
                <h3 className="text-3xl leading-10 md:text-6xl md:leading-16 font-bold mb-3 bg-[linear-gradient(180deg,_#FFFFFF_0%,_#AD6EFF_100%)] bg-clip-text text-transparent">
                    Ready to Transform <br />
                    Your Scheduling?
                </h3>
                <p className="text-[#DEC4FF] text-lg">
                    Join thousands of professionals who have already streamlined their <br /> scheduling with our AI Assistant.                </p>
                {/* CTA Button */}
                {/* CTA Button */}
                <Link
                    href="/dashboard"
                    className="text-white text-[16px] font-medium flex items-center gap-3 px-8 py-4 rounded-full "
                    style={{
                        background: "linear-gradient(180deg, #9440FF 0%, #6505E0 100%)",
                        boxShadow: "inset 0px -14px 22.44px -12.09px #FFFFFFA3",
                        borderBottom: "solid 3px #6505E0",
                    }}
                    aria-label="Start your free trial"
                >
                    Start Your Free Trial
                    <ArrowRight size={20} />
                </Link>
            </div>
        </section>
    )
}

export default ReadyForExperience