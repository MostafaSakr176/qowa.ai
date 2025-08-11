import { Facebook } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className=' max-w-7xl mx-auto px-4 pb-12'>
            <div className="bg-gradient-to-tl from-white/10 to-white/0 text-white py-8 px-4 md:px-10 rounded-2xl shadow-lg border border-white/30">
                {/* Newsletter Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-white/10">
                    <div>
                        <h2 className="text-2xl md:text-5xl text-[#B5CFFF] mb-2">Subscribe to Our<br />Newsletter</h2>
                    </div>
                    <form className="flex w-full md:max-w-lg max-w-lg">
                        <input
                            type="email"
                            placeholder="Enter Your Email"
                            className="pl-5 pr-14 py-3 w-full text-md text-left focus:outline-none cursor-pointer rounded-full border border-white/20 focus:border-white/50 transition-all duration-300 bg-[#183A6A]/60 placeholder-white/70 outline-none -mr-10"
                        />
                        <button
                            type="submit"
                            className="rounded-full bg-[#2B4AF5] px-5 py-3 text-md font-medium hover:bg-[#1d36b8] transition-colors"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>

                {/* Footer Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                    {/* Brand */}
                    <div className='flex flex-col justify-between'>
                        <div className="text-2xl font-bold mb-2">
                            <Image
                                src="/media/images/logos/Logo.webp"
                                alt="Logo"
                                width={120}
                                height={80}
                                className="w-[90px] h-auto md:w-[120px] md:h-auto lg:w-[140px] lg:h-auto"
                            // Responsive logo size
                            />
                        </div>
                        <div>
                            <div className="font-semibold text-lg mb-1">AI Defense Pro</div>
                            <div className="text-xs text-white/60">Next-Gen Cybersecurity Powered by AI</div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <div className="font-semibold mb-3">Quick Links</div>
                        <div className='grid grid-cols-2 items'>
                        <ul className="space-y-2 text-white/80 text-sm">
                            <li><Link href="/" className="hover:underline">Home</Link></li>
                            <li><Link href="/about" className="hover:underline">About Us</Link></li>
                            <li><Link href="/features" className="hover:underline">Service</Link></li>
                            <li><Link href="/single-service" className="hover:underline">Single Service</Link></li>
                            <li><Link href="/team" className="hover:underline">Our Team</Link></li>
                        </ul>
                        <ul className="space-y-2 text-white/80 text-sm">
                            <li><Link href="/pricings" className="hover:underline">Pricing Plan</Link></li>
                            <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
                            <li><Link href="/404" className="hover:underline">404</Link></li>
                            <li><Link href="/blog" className="hover:underline">Blog</Link></li>
                            <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
                        </ul>
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div>
                        <div className="font-semibold mb-3">Why Choose Us?</div>
                        <div className="text-sm text-white/80 mb-3">We deliver cutting-edge AI security solutions.</div>
                        <div className="text-xs text-white/60 mb-1">
                            <span className="font-semibold">Call Us:</span> (123) 234-1234
                        </div>
                        <div className="text-xs text-white/60 mb-1">
                            We are open Monday to Friday
                        </div>
                        <div className="text-xs text-white/60">
                            08:00 AM - 17:00 PM
                        </div>
                    </div>
                </div>

                {/* Social Icons */}
                <div className="flex justify-center gap-5 mt-8 pt-8 border-t border-white/10">
                    <Link href="#" aria-label="Twitter" className="hover:text-[#2B4AF5] transition-colors"><Facebook /></Link>
                    <Link href="#" aria-label="Twitter" className="hover:text-[#2B4AF5] transition-colors"><Facebook /></Link>
                    <Link href="#" aria-label="Twitter" className="hover:text-[#2B4AF5] transition-colors"><Facebook /></Link>
                    <Link href="#" aria-label="Twitter" className="hover:text-[#2B4AF5] transition-colors"><Facebook /></Link>
                </div>
            </div>

        </footer>

    )
}

export default Footer