import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image';

const FAQsection = () => {
    const faqs = [
        {
            question: "Is my data secure with your AI service?",
            answer:
                "I am item content. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. I am item content. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
        },
        {
            question: "Is my data secure with your AI service?",
            answer:
                "I am item content. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. I am item content. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
        },
        {
            question: "Is my data secure with your AI service?",
            answer:
                "I am item content. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. I am item content. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
        },
        {
            question: "Is my data secure with your AI service?",
            answer:
                "I am item content. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. I am item content. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
        },
        {
            question: "Is my data secure with your AI service?",
            answer:
                "I am item content. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. I am item content. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
        },
    ];

    // React state and handler logic
    const [openIdx, setOpenIdx] = React.useState<number | null>(1);

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className='flex flex-col gap-3'>
                {faqs.map((faq, idx) => {
                    const open = openIdx === idx;
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <div
                                className={`transition-all duration-300 rounded-lg border border-[#281545]`}
                                style={{
                                    background: "linear-gradient(180deg, #1C053A 0%, #0B0019 24%)",
                                    boxShadow: "0px -1px 0px #9440FF"
                                }}
                            >
                                <button
                                    className="w-full flex items-center justify-between px-4 py-3 text-left focus:outline-none cursor-pointer"
                                    onClick={() => setOpenIdx(open ? null : idx)}
                                    aria-expanded={open}
                                    aria-controls={`faq-panel-${idx}`}
                                    type="button"
                                >
                                    <span className="text-white text-base md:text-lg font-normal">
                                        {faq.question}
                                    </span>
                                    <span
                                        className={`ml-4 flex items-center justify-center w-10 h-10 transition-transform duration-200 ${open ? "rotate-45" : ""}`}
                                    >
                                        {/* Plus/Minus icon */}
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <rect
                                                x="9"
                                                y="4"
                                                width="2"
                                                height="12"
                                                rx="1"
                                                fill="#fff"
                                                opacity="0.8"
                                            />
                                            <rect
                                                x="4"
                                                y="9"
                                                width="12"
                                                height="2"
                                                rx="1"
                                                fill="#fff"
                                                opacity="0.8"
                                            />
                                        </svg>
                                    </span>
                                </button>
                                <div
                                    id={`faq-panel-${idx}`}
                                    className={`overflow-hidden transition-all duration-300 px-4 ${open
                                        ? "max-h-[500px] py-4 opacity-100"
                                        : "max-h-0 py-0 opacity-0"
                                        }`}
                                    aria-hidden={!open}
                                >
                                    <p className="text-white/80 text-sm leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            <div className='flex flex-col gap-3'>
                {faqs.map((faq, idx) => {
                    const open = openIdx === idx;
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <div
                                className={`transition-all duration-300 rounded-lg border border-[#281545]`}
                                style={{
                                    background: "linear-gradient(180deg, #1C053A 0%, #0B0019 24%)",
                                    boxShadow: "0px -1px 0px #9440FF"
                                }}
                            >
                                <button
                                    className="w-full flex items-center justify-between py-3 px-4 text-left focus:outline-none cursor-pointer"
                                    onClick={() => setOpenIdx(open ? null : idx)}
                                    aria-expanded={open}
                                    aria-controls={`faq-panel-${idx}`}
                                    type="button"
                                >
                                    <span className="text-white text-base md:text-lg font-normal">
                                        {faq.question}
                                    </span>
                                    <span
                                        className={`ml-4 flex items-center justify-center w-10 h-10 transition-transform duration-200 ${open ? "rotate-45" : ""}`}
                                    >
                                        {/* Plus/Minus icon */}
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <rect
                                                x="9"
                                                y="4"
                                                width="2"
                                                height="12"
                                                rx="1"
                                                fill="#fff"
                                                opacity="0.8"
                                            />
                                            <rect
                                                x="4"
                                                y="9"
                                                width="12"
                                                height="2"
                                                rx="1"
                                                fill="#fff"
                                                opacity="0.8"
                                            />
                                        </svg>
                                    </span>
                                </button>
                                <div
                                    id={`faq-panel-${idx}`}
                                    className={`overflow-hidden transition-all duration-300 px-4 ${open
                                        ? "max-h-[500px] py-4 opacity-100"
                                        : "max-h-0 py-0 opacity-0"
                                        }`}
                                    aria-hidden={!open}
                                >
                                    <p className="text-white/80 text-sm leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

const FAQ = () => {
    return (
        <section className="px-4 max-w-7xl mx-auto relative">
            <Image
                src="/media/images/faq-bg.svg"
                alt=""
                width={100}
                height={100}
                className="w-3/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1"
            // Responsive logo size
            />
            <div className='flex flex-col justify-center items-center relative z-2'>
                <div
                    className="text-white text-[12px] md:text-base flex items-center gap-2 px-4 py-2 rounded-full border border-[#9C4FFF33] mb-8"
                    aria-label="Go to dashboard"
                    style={{
                        background: "linear-gradient(270deg, #110522 0%, #381960 100%)",
                        backdropFilter: "blur(8px)",
                        boxShadow: "1px -2px 3px 0px #9C4FFF40 inset"
                    }}
                >
                    <Image src="/media/icons/Sparkle.svg" alt="Rocket icon" width={20} height={20} />
                    <span className="bg-gradient-to-b from-[#FFFFFF] to-[#ceb0f5] bg-clip-text text-transparent">FAQ</span>
                </div>
                <h3 className="text-3xl leading-10 md:text-5xl md:leading-12 font-bold mb-3 text-center  bg-[linear-gradient(180deg,_#FFFFFF_0%,_#AD6EFF_100%)] bg-clip-text text-transparent">
                    Smart Security Starts with <br /> 
                    the Right Answers
                </h3>
                <p className="text-white/70 text-lg mb-14 text-center max-w-3xl mx-auto">
                    Our platform offers top-tier AI-driven cybersecurity and threat detection to help you stay ahead of cyber threats.
                </p>
                {FAQsection()}
            </div>

        </section>

    )
}

export default FAQ