"use client";

import Image from "next/image";
import TrustSection from "@/components/marketing/TrustSection";
import AboutUs from "@/components/marketing/AboutUs";
import ServiceSection from "@/components/marketing/ServiceSection";
import { HeroSection } from "@/components/marketing/HeroSection";
import Pricing from "@/components/marketing/Pricing";
import Testimonials from "@/components/marketing/Testimonials";
import FAQ from "@/components/marketing/FAQ";
import ReadyForExperience from "@/components/marketing/ReadyForExperience";
import Header from "@/components/layout/marketing/header";
import Footer from "@/components/layout/marketing/footer";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay'; // Import Swiper autoplay styles if needed

const HERO_BG_SRC = "/media/images/hero/ooooo.webp";



export default function Home() {


  return (
    <div className="bg-[linear-gradient(180deg,_#0054CA_0%,_#01276C_100%)]">
      <Header />
      <div className="space-y-10 md:space-y-28">
        <main className="relative">
          {/* Hero Background */}
          <div
            className="w-full overflow-hidden opacity-0 md:opacity-100 absolute top-0 left-0 right-0 z-1"
            style={{ height: "calc(100% - 30px)" }}
          >
            <Image
              src={HERO_BG_SRC}
              alt="Hero background"
              width={1920}
              height={600}
              className="w-full h-full object-cover"
              style={{ transform: "translateY(-30px)" }}
              priority
            />
          </div>

          {/* Main Content */}
          <div className="pt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-2">
            <HeroSection />
          </div>

        </main>
        <TrustSection />
        <AboutUs />
        <ServiceSection />
        <Pricing />
        <Testimonials />
        <FAQ />
        <ReadyForExperience />
        <Footer />
      </div>

    </div>
  );
}