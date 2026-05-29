import { useGSAP } from "@gsap/react";
import { SplitText, Draggable, InertiaPlugin, CustomEase, CustomWiggle } from "gsap/all";
import Radar from "./Radar";
import gsap from "gsap";
import { useEffect, useRef } from "react";

const Hero = () => {
  const zoneRef = useRef(null);
  const badgeRef = useRef(null);
  const strength = 0.42;

  useEffect(() => {
    const zone = zoneRef.current;
    const badge = badgeRef.current;
    if (!zone || !badge) return;

    CustomWiggle.create("myWiggle", { wiggles: 8, type: "easeOut" });

    const wiggle = gsap.to(badge, {
      rotation: 10,
      duration: 1.6,
      repeat: -1,
      ease: "myWiggle",
    });

    const onMove = (e) => {
      const rect = zone.getBoundingClientRect();
      const x = gsap.utils.mapRange(rect.left, rect.right, -rect.width / 2, rect.width / 2, e.clientX);
      const y = gsap.utils.mapRange(rect.top, rect.bottom, -rect.height / 2, rect.height / 2, e.clientY);
      gsap.to(badge, { x: x * strength, y: y * strength, duration: 0.4, ease: "power2.out", overwrite: "auto" });
    };

    const onLeave = () => {
      gsap.to(badge, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
    };

    zone.addEventListener("mousemove", onMove);
    zone.addEventListener("mouseleave", onLeave);

    return () => {
      wiggle.kill();
      zone.removeEventListener("mousemove", onMove);
      zone.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useGSAP(() => {
    Draggable.create(".planet-green", {
      bounds: ".drag-area",
      inertia: true,
    });

    gsap.to(".planet-green", {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "linear",
    });
    gsap.from(".planet-green", {
      xPercent: -800,
      duration: 60,
      ease: "expo.out",

    });

    const heroSplit = new SplitText(".hero-info", { type: "chars, words" });
    const paragraphSplit = new SplitText(".subtitle", { type: "lines" });

    heroSplit.chars.forEach((char) => char.classList.add("text-gradient"));

    gsap.from(heroSplit.chars, {
      xPercent: 1600,
      duration: 1.8,
      ease: "expo.out",
      stagger: 0.06,
    });

    gsap.from(paragraphSplit.lines, {
      opacity: 0,
      yPercent: 100,
      duration: 1.8,
      ease: "expo.out",
      stagger: 0.06,
      delay: 1,
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
      .to(".right-leaf", { y: 200 }, 0)
      .to(".left-leaf", { y: -200 }, 0)
      .to(".arrow", { y: 100 }, 0);
  }, []);

  return (
    <>
      <section id="hero">
        <div className="drag-area">
          <img src="/images/planetgreen.png" alt="left-leaf" className="planet-green" />
          <div className="absolute inset-0 z-0 h-screen w-screen">
            <Radar
              speed={0.1}
              scale={0.5}
              ringCount={1}
              spokeCount={2}
              ringThickness={0.05}
              spokeThickness={0.01}
              sweepSpeed={1}
              sweepWidth={2}
              sweepLobes={1}
              color="#ffffff"
              backgroundColor="#000000"
              falloff={2}
              brightness={0.8}
              enableMouseInteraction
              mouseInfluence={0.1}
            />
          </div>

          +
          <h1 className="">Forge The<br />Future</h1>
          <h2 className="hero-info">
            
            AI-powered <br /> Solutions For <br /> Smarter living.
          </h2>

          <div className="action-buttons absolute bottom-40 left-4 md:relative md:bottom-auto md:left-auto flex flex-col md:flex-row gap-5 mt-10">
  <div className="md:col-span-1">
    <p className="badge bg-white text-blackack lg:text-xl text-sm z-10 hover:scale-105 rounded-xl transition-transform duration-300 cursor-crosshair">
      Explore Services
    </p>
  </div>
  
  <div
    ref={zoneRef}
    className="md:col-span-1 flex items-center justify-center w-48 h-48"
    style={{ cursor: "pointer" }}
  >
    <a
      ref={badgeRef}
      className="badge text-xl bg-green"
      style={{ willChange: "transform", display: "inline-block" }}
    >
      <p>Call Us</p>
    </a>
  </div>
</div>

          <img src="/images/nuruforge.png" alt="grid-img-4" className="absolute right-0 bottom-0 xl:w-72" />
        </div>
      </section>
    </>
  );
};

export default Hero;