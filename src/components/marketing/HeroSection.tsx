import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Typed from "typed.js";
import Card from "@/components/ui/marketing/animated-card";
import AnimatedCounter from "@/components/ui/marketing/animated-counter";


const ARROW_ICON_SRC = "/media/icons/arroe-right-solid.svg";
const CLOUD_IMG_SRC = "/media/images/hero/cloud-img.svg";
const LOCK_IMG_SRC = "/media/images/hero/lock-img.svg";
const TYPED_STRINGS = ["Future", "Business"];


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
      <section className="min-h-[70vh] lg:min-h-screen flex flex-col items-center justify-center gap-6">
        {/* Tagline Link */}
        <Link
          href="/dashboard"
          className="text-white text-[14px] flex items-center px-6 py-2 rounded-full bg-white/10 border border-white/30 shadow-soft backdrop-blur-md [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.1)] hover:bg-white/20 transition-all duration-200"
          aria-label="Go to dashboard"
        >
          <span className="w-1 h-1 rounded-full bg-white mr-3 inline-block" />
          Cyber Security
        </Link>

        {/* Main Heading */}
        <h1 className="text-white text-[32px] leading-8 md:text-[56px] md:leading-14 xl:text-[72px] xl:leading-18 2xl:text-[96px] 2xl:leading-24 font-semibold">
          Secure Your&nbsp;
          <span ref={typedEl} />
        </h1>
        <h1 className="text-[32px] leading-8 md:text-[56px] md:leading-14 xl:text-[72px] xl:leading-18 2xl:text-[96px] 2xl:leading-24 font-semibold bg-[radial-gradient(70.71%_70.71%_at_50%_50%,_#FFFFFF_0%,_#B5CFFF_56%)] bg-clip-text text-transparent">
          World with AI Defense
        </h1>
        <p className="text-white max-w-4xl text-lg md:text-xl text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
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
          <Image src={ARROW_ICON_SRC} alt="Arrow right icon" width={20} height={20} />
        </Link>
      </section>
      {/* Cards Section */}
      <section className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center items-center md:pt-[10vh]">
        {/* Cyber Shield Card */}
        <Card>
          <div className="text-center min-h-[30vh] md:min-h-[35vh] flex flex-col justify-around h-full">
            <div className="flex justify-center">
              <button
                type="button"
                className="bg-gradient-to-t from-[#392BD8] to-[#0054CA] text-white px-8 py-3 rounded-full font-medium flex items-center gap-3"
                aria-label="Activate Free Shield"
              >
                Activate Free Shield
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Cyber Shield AI-Powered</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Experience real-time AI protection against evolving cyber threats.
              </p>
            </div>
          </div>
        </Card>

        {/* Threat Intelligence Card */}
        <Card className="lg:-translate-y-1/3">
          <div className="text-center min-h-[30vh] md:min-h-[35vh] w-full flex flex-col justify-between relative h-full">
            <div className="flex flex-col items-start text-start gap-2.5">
              <h3 className="text-xl font-bold text-white mb-3">Cyber Shield AI-Powered</h3>
              <AnimatedCounter value={154.8} duration={2} />
              <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-[60%]">
                Accelerate threat detection cyber attacks in real time.
              </p>
              <div className="flex gap-2 justify-center">
                <span className="text-white px-4 text-xs md:text-sm md:px-5 py-2 rounded-full bg-white/10 border border-white/30 shadow-soft backdrop-blur-md [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.1)] hover:bg-white/20 transition-all duration-200">
                  Detection Accuracy
                </span>
                <span className="text-white px-4 text-xs md:text-sm md:px-6 py-2 rounded-full bg-white/10 border border-white/30 shadow-soft backdrop-blur-md [box-shadow:inset_0_2px_8px_0_rgba(256,256,256,0.1)] hover:bg-white/20 transition-all duration-200">
                  Response Boost
                </span>
              </div>
            </div>
            <div className="absolute top-6 right-2">
              <Image src={CLOUD_IMG_SRC} alt="Cloud illustration" width={120} height={120} />
            </div>
          </div>
        </Card>

        {/* Threat Detection Card */}
        <Card>
          <div className="text-center min-h-[30vh] md:min-h-[35vh] flex flex-col justify-between h-full">
            <div className="flex justify-center">
              <Image src={LOCK_IMG_SRC} alt="Lock illustration" width={120} height={120} className="w-[40%]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Cyber Shield AI-Powered</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Experience real-time AI protection against evolving cyber threats.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </>
  )
}
