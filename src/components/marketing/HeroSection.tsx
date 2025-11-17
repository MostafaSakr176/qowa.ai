import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Typed from "typed.js";
import Card from "@/components/ui/marketing/animated-card";
import AnimatedCounter from "@/components/ui/marketing/animated-counter";
import { ArrowRight } from "lucide-react";

const CLOUD_IMG_SRC = "/media/images/hero/cloud-img.svg";
const LOCK_IMG_SRC = "/media/images/hero/lock-img.svg";
const TYPED_STRINGS = ["Vulnerabilities", "Weak Points"];

export const HeroSection = () => {
  const typedEl = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!typedEl.current) return;
    const typed = new Typed(typedEl.current, {
      strings: TYPED_STRINGS,
      typeSpeed: 150,
      backSpeed: 150,
      loop: true,
    });
    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <>
      <section className="min-h-[80vh] lg:min-h-[80vh] pt-[20vh] flex flex-col items-center justify-center">

        {/* Tagline */}
        <div
          className="text-white text-[12px] md:text-base flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-[#9C4FFF33]"
          style={{
            background: "linear-gradient(270deg, #110522 0%, #381960 100%)",
            backdropFilter: "blur(8px)",
            boxShadow: "1px -2px 3px 0px #9C4FFF40 inset",
          }}
        >
          <Image src="/media/icons/Sparkle.svg" alt="Sparkle icon" width={20} height={20} />
          <span className="bg-gradient-to-b from-[#FFFFFF] to-[#ceb0f5] bg-clip-text text-transparent">
            Your Offensive Security Assistant
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-center mb-4 max-w-4xl text-[28px] md:text-[48px] leading-tight font-semibold bg-gradient-to-b from-[#FFFFFF] via-[#FAF5FF] to-[#D7B9FC] bg-clip-text text-transparent">
          Your Trusted Partner in Advanced Penetration Testing
        </h1>

        {/* Subheading */}
        <p className="max-w-4xl mb-4 text-[14px] md:text-xl text-center bg-gradient-to-b from-[#FFFFFF] via-[#FAF5FF] to-[#D7B9FC] bg-clip-text text-transparent">
          Identify vulnerabilities, expose hidden risks, and secure your systems before attackers do.
        </p>

        {/* CTA Button */}
        <Link
          href="/dashboard"
          className="text-white text-[16px] font-medium flex items-center gap-3 px-8 py-3 rounded-full"
          style={{
            background: "linear-gradient(180deg, #9440FF 0%, #6505E0 100%)",
            boxShadow: "inset 0px -14px 22.44px -12.09px #FFFFFFA3",
            borderBottom: "solid 3px #6505E0",
          }}
        >
          Start Your Security Assessment
          <ArrowRight size={20} />
        </Link>

        {/* Hero Image */}
        <Card className="!p-0 !py-0 max-w-4xl mx-auto my-16">
          <Image
            src="/media/dashboard.svg"
            alt="Hero illustration"
            width={600}
            height={400}
            className="w-full h-auto rounded-2xl shadow-2xl shadow-[#2b0e52]"
          />
        </Card>
      </section>

      {/* Cards Section */}
      <section className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center items-center">

        {/* Card 1 — Free Scan */}
        <Card>
          <div className="text-center min-h-[30vh] md:min-h-[25vh] lg:min-h-[35vh] flex flex-col justify-around h-full">
            <div className="flex justify-center">
              <button
                type="button"
                className="text-white text-[16px] font-medium flex items-center gap-3 px-8 py-4 rounded-full"
                style={{
                  background: "linear-gradient(180deg, #9440FF 0%, #6505E0 100%)",
                  boxShadow: "inset 0px -14px 22.44px -12.09px #FFFFFFA3",
                  borderBottom: "solid 3px #6505E0",
                }}
              >
                Run Free Security Scan
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">
                AI-Assisted Penetration Testing
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Leverage AI-driven scanning to uncover weaknesses before attackers find them.
              </p>
            </div>
          </div>
        </Card>

        {/* Card 2 — Deep Vulnerability Insights */}
        <Card className="lg:-translate-y-1/3">
          <div className="text-center min-h-[30vh] md:min-h-[25vh] lg:min-h-[35vh] w-full flex flex-col justify-between relative h-full">
            <div className="flex flex-col items-start text-start gap-2.5">
              <h3 className="text-xl font-bold text-white mb-3">
                Deep Vulnerability Insights
              </h3>
              <AnimatedCounter value={154.8} duration={2} />
              <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-[60%]">
                Accelerate vulnerability discovery and exploit detection in real time.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
                <span className="text-white text-center px-4 text-xs md:text-sm py-2 rounded-full bg-white/10 border border-white/30 hover:bg-white/20 transition">
                  Risk Identification
                </span>
                <span className="text-white text-center px-4 text-xs md:text-sm py-2 rounded-full bg-white/10 border border-white/30 hover:bg-white/20 transition">
                  Exploit Simulation
                </span>
              </div>
            </div>

            <div className="absolute top-6 right-2">
              <Image src={CLOUD_IMG_SRC} alt="Cloud illustration" width={120} height={120} />
            </div>
          </div>
        </Card>

        {/* Card 3 — Attack Simulation */}
        <Card>
          <div className="text-center min-h-[30vh] md:min-h-[25vh] lg:min-h-[35vh] flex flex-col justify-between h-full">
            <div className="flex justify-center">
              <Image src={LOCK_IMG_SRC} alt="Lock illustration" width={120} height={120} className="w-[40%]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">
                Full-Scope Attack Simulation
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Simulate real-world attack scenarios to validate your security posture end-to-end.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
};
