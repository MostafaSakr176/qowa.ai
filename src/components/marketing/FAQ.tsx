import React from 'react'
import { motion } from 'framer-motion'

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
        <div className="w-full max-w-4xl space-y-3">
            {faqs.map((faq, idx) => {
                const open = openIdx === idx;
                return (
                    <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="col-span-4 md:col-span-2 row-span-2 h-full"
                >
                    <div
                        className={`transition-all duration-300 space-y-1`}
                    >
                        <button
                            className="w-full flex items-center justify-between p-5 text-left focus:outline-none cursor-pointer rounded-lg border border-white/20 bg-[#183A6A]/60 hover:bg-[#20457e]/80 transition-colors duration-200"
                            onClick={() => setOpenIdx(open ? null : idx)}
                            aria-expanded={open}
                            aria-controls={`faq-panel-${idx}`}
                            type="button"
                        >
                            <span className="text-white text-base md:text-lg font-normal">
                                {faq.question}
                            </span>
                            <span
                                className={`ml-4 flex items-center justify-center w-7 h-7 transition-transform duration-200 ${open ? "rotate-45" : ""}`}
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
                            className={`overflow-hidden transition-all duration-300 px-4 rounded-lg border border-white/20 bg-[#183A6A]/60 ${open
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
    );
}

const FAQ = () => {
    return (
        <section className="px-4 max-w-7xl mx-auto flex flex-col justify-center items-center ">
            <span className="text-white text-center inline-block text-[14px] px-4 py-2 mb-10 rounded-full bg-white/5 border border-white/30 shadow-soft backdrop-blur-md [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.05)]">
                FAQ
            </span>
            <h3 className="text-2xl leading-8 md:text-6xl md:leading-20 font-bold mb-3 text-center  bg-[radial-gradient(70.71%_70.71%_at_50%_50%,_#FFFFFF_0%,_#B5CFFF_56%)] bg-clip-text text-transparent">
                Smart Security Starts with <br /> the
                Right Answers
            </h3>
            <p className="text-white/70 text-lg mb-14 text-center max-w-3xl mx-auto">
                Our platform offers top-tier AI-driven cybersecurity and threat detection to help you stay ahead of cyber threats.
            </p>

            {FAQsection()}
        </section>

    )
}

export default FAQ