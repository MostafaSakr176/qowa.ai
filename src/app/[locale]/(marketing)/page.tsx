"use client";

import Image from "next/image";
import TrustSection from "@/components/marketing/TrustSection";
import AboutUs from "@/components/marketing/AboutUs";
import ServiceSection from "@/components/marketing/ServiceSection";
import { HeroSection } from "@/components/marketing/HeroSection";
// import Pricing from "@/components/marketing/Pricing";
import Testimonials from "@/components/marketing/Testimonials";
import FAQ from "@/components/marketing/FAQ";
import ReadyForExperience from "@/components/marketing/ReadyForExperience";
import Header from "@/components/layout/marketing/header";
import Footer from "@/components/layout/marketing/footer";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay'; // Import Swiper autoplay styles if needed
import StartPentestingForm from "@/components/marketing/startPentestingForm";
import Link from "next/link";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const HERO_BG_SRC = "/media/images/hero/Hero-bg.svg";
// const HERO_SHEILD_BG = "/media/images/hero/sheild.svg";



export default function Home() {
  const [showSuccess, setShowSuccess] = useState(false);

  // Scroll to top when success message is shown
  React.useEffect(() => {
    if (showSuccess) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showSuccess]);

  return (
    <div className="bg-[#090014]">
      <Header />
      <div className="space-y-10 md:space-y-28">
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh] mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">Thanks for your interest!</h2>
            <p className="text-lg text-white mb-8 text-center max-w-xl">Someone from our team will be in touch shortly to confirm if your application meets the requirements.</p>
            <div className="flex gap-4">
              <Button onClick={()=>setShowSuccess(false)} size={"lg"}>Back to homepage</Button>
              <Button variant={"outline"} size={"lg"}>Read our blog</Button>
            </div>
          </div>
        ) : (
          <>
            <main className="relative md:pb-18 md:mb-18">
              {/* Hero Background */}
              {/* ...existing code... */}
              <div
                className="w-full h-full overflow-hidden absolute top-0 left-0 right-0 z-3 opacity-70"
              >
                <Image
                  src={"/media/images/trtr.svg"}
                  alt="Hero background"
                  width={1920}
                  height={600}
                  className="h-full w-full object-cover object-top"
                  priority
                />
              </div>
              <div
                className="w-full overflow-hidden absolute top-0 left-0 right-0 z-1"
                style={{ height: "calc(100% - 30px)" }}
              >
                <Image
                  src={HERO_BG_SRC}
                  alt="Hero background"
                  width={1920}
                  height={600}
                  className="w-full h-full object-cover object-top"
                  style={{ transform: "translateY(-30px)" }}
                  priority
                />
              </div>
              {/* Main Content */}
              <div className="pt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-4 space-y-10 md:space-y-30">
                <HeroSection />
                <AboutUs />
                <ServiceSection />
              </div>
            </main>
            {/* <Pricing /> */}
            <TrustSection />
            <Testimonials />
            <FAQ />
            <StartPentestingForm onSuccess={() => setShowSuccess(true)} />
            <ReadyForExperience />
          </>
        )}
        <Footer />
      </div>
    </div>
  );
}