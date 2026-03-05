import { useEffect, useRef, useState } from "react";
import { heroVideo } from "@/assets";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

/**
 * Hero section — Tudor Rose blooming from seed.
 * Lazy-loaded video backdrop (BioGenesis pattern), radial gradient from text outward.
 */
export function HeroSection() {
  const [, setLocation] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  // Lazy load video when section enters viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Play video once loaded
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
      video.play().catch(() => {});
    };

    video.addEventListener("canplaythrough", handleCanPlay);
    return () => video.removeEventListener("canplaythrough", handleCanPlay);
  }, [shouldLoadVideo]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden origami-paper -mt-px"
    >
      {/* Video backdrop — lazy loaded, fades in */}
      <div className="!absolute inset-0 !z-[2]" aria-hidden="true">
        {/* Poster fallback */}
        <img
          src={heroVideo.poster}
          alt=""
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? "opacity-0" : "opacity-100"
          }`}
        />
        {shouldLoadVideo && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            preload="none"
            poster={heroVideo.poster}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              isVideoLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src={heroVideo.src} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Radial gradient anchored at left text, fading outward */}
      <div
        className="!absolute inset-0 !z-[3]"
        style={{
          background:
            "radial-gradient(ellipse at 15% 50%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.35) 30%, transparent 65%)",
        }}
      />

      {/* Content — left-aligned, vertically centered, flush top */}
      <div className="relative !z-[4] w-full px-6 md:px-16 lg:px-24 py-8 md:py-0">
        <div className="max-w-lg">
          <h1
            className="font-heading text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight tracking-tight"
            style={{
              fontWeight: 900,
              color: "#D4AF37",
              textShadow: "0 1px 0 #b8860b, 0 2px 2px rgba(0,0,0,0.5), 0 0 15px rgba(212,175,55,0.3)",
            }}
          >
            Tend Your Inner Garden
          </h1>
          <p className="text-base md:text-lg text-white/90 mb-10 leading-relaxed" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
            A living ecosystem connecting seekers with trusted holistic guides.
          </p>
          <div className="flex flex-row gap-2">
            <Button
              size="sm"
              onClick={() => setLocation("/auth/signup?role=practitioner")}
              className="text-white bg-red-700 hover:bg-red-800 px-4 py-1.5 text-xs font-medium tracking-wide transition-colors"
            >
              I'm a Facilitator
            </Button>
            <Button
              size="sm"
              onClick={() => setLocation("/auth/signup?role=client")}
              className="text-white bg-gold hover:bg-gold/90 border-0 px-4 py-1.5 text-xs font-medium tracking-wide transition-colors"
            >
              I'm a Client
            </Button>
          </div>
        </div>
      </div>

      {/* Origami crease — fold between sections */}
      <div className="origami-crease" />
    </section>
  );
}

export default HeroSection;
