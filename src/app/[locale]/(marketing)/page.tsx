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

const HERO_BG_SRC = "/media/images/hero/Hero-bg.svg";
// const HERO_SHEILD_BG = "/media/images/hero/sheild.svg";



export default function Home() {


  return (
    <div className="bg-[#090014]">


      <Header />
      <div className="space-y-10 md:space-y-28">
        <main className="relative md:pb-18 md:mb-18">
          {/* Hero Background */}
          {/* <div
            className="w-full h-screen overflow-hidden absolute top-[30vh] left-0 z-2 opacity-70"
          //  style={{ transform: "translateY(30px)" }}
          >
            <Image
              src={HERO_SHEILD_BG}
              alt="Hero background"
              width={1920}
              height={600}
              className="h-full w-full object-contain scale-150 md:scale-120 -translate-y-12 md:-translate-y-0"
              priority
            />
          </div> */}

          <div
            className="w-full h-full overflow-hidden absolute top-0 left-0 right-0 z-3 opacity-70"
          //  style={{ transform: "translateY(30px)" }}
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
        <ReadyForExperience />
        <Footer />
      </div>
    </div>
  );
}