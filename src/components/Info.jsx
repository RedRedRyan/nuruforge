"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger, Observer } from "gsap/all";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, Flip, Observer);

export default function Info() {
  const galleryRef = useRef(null);
  const wrapRef    = useRef(null);
  const flipCtxRef = useRef(null);

  // Flip swap animation
  useGSAP(() => {
    gsap
	.timeline({
	 scrollTrigger: {
		trigger: ".test-planet",
		start: "bottom bottom",
		end: "120% bottom",
		scrub: true,
	 },
	})
	.to(".test-planet", { x: 300 }, 0)

  });

  // Bento flip on scroll
  useEffect(() => {
    const createTween = () => {
      const galleryElement = galleryRef.current;
      const wrapElement    = wrapRef.current;
      if (!galleryElement || !wrapElement) return;

      const galleryItems = galleryElement.querySelectorAll(".bento__item");

      flipCtxRef.current?.revert();
      galleryElement.classList.remove("bento--final");

      flipCtxRef.current = gsap.context(() => {
        galleryElement.classList.add("bento--final");
        const flipState = Flip.getState(galleryItems);
        galleryElement.classList.remove("bento--final");

        const flip = Flip.to(flipState, {
          simple: true,
          ease: "expoScale(1, 5)",
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: galleryElement,
            start: "center center",
            end: "+=100%",
            scrub: true,
            pin: wrapElement,
          },
        });

        tl.add(flip);
        return () => gsap.set(galleryItems, { clearProps: "all" });
      });
    };

    createTween();
    window.addEventListener("resize", createTween);
    return () => {
      window.removeEventListener("resize", createTween);
      flipCtxRef.current?.revert();
    };
  }, []);

  // Scrolling text rail + background animation
  useGSAP(() => {
    gsap.to(".green-grid-background", {
      backgroundPosition: "200% 200%",
      duration: 20,
      ease: "linear",
      repeat: -1,
    });

    const scrollingText = gsap.utils.toArray(".rail h4");

    const tl = horizontalLoop(scrollingText, {
      repeat: -1,
      paddingRight: 30,
    });

    Observer.create({
      onChangeY(self) {
        let factor = 2.5;
        if (self.deltaY < 0) factor *= -1;
        gsap
          .timeline({ defaults: { ease: "none" } })
          .to(tl, { timeScale: factor * 2.5, duration: 0.2, overwrite: true })
          .to(tl, { timeScale: factor / 2.5, duration: 1 }, "+=0.3");
      },
    });

    function horizontalLoop(items, config) {
      items = gsap.utils.toArray(items);
      config = config || {};
      let tl = gsap.timeline({
        repeat: config.repeat,
        paused: config.paused,
        defaults: { ease: "none" },
        onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
      }),
        length = items.length,
        startX = items[0].offsetLeft,
        times = [],
        widths = [],
        xPercents = [],
        curIndex = 0,
        pixelsPerSecond = (config.speed || 1) * 100,
        snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1),
        totalWidth, curX, distanceToStart, distanceToLoop, item, i;

      gsap.set(items, {
        xPercent: (i, el) => {
          let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px")));
          xPercents[i] = snap(
            (parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 +
              gsap.getProperty(el, "xPercent")
          );
          return xPercents[i];
        },
      });
      gsap.set(items, { x: 0 });
      totalWidth =
        items[length - 1].offsetLeft +
        (xPercents[length - 1] / 100) * widths[length - 1] -
        startX +
        items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") +
        (parseFloat(config.paddingRight) || 0);

      for (i = 0; i < length; i++) {
        item = items[i];
        curX = (xPercents[i] / 100) * widths[i];
        distanceToStart = item.offsetLeft + curX - startX;
        distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
        tl.to(item, { xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
          .fromTo(
            item,
            { xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) },
            { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false },
            distanceToLoop / pixelsPerSecond
          )
          .add("label" + i, distanceToStart / pixelsPerSecond);
        times[i] = distanceToStart / pixelsPerSecond;
      }

      function toIndex(index, vars) {
        vars = vars || {};
        Math.abs(index - curIndex) > length / 2 &&
          (index += index > curIndex ? -length : length);
        let newIndex = gsap.utils.wrap(0, length, index),
          time = times[newIndex];
        if (time > tl.time() !== index > curIndex) {
          vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
          time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        curIndex = newIndex;
        vars.overwrite = true;
        return tl.tweenTo(time, vars);
      }

      tl.next = (vars) => toIndex(curIndex + 1, vars);
      tl.previous = (vars) => toIndex(curIndex - 1, vars);
      tl.current = () => curIndex;
      tl.toIndex = (index, vars) => toIndex(index, vars);
      tl.times = times;
      tl.progress(1, true).progress(0, true);
      if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
      }
      return tl;
    }
  });

  return (
    <>
      <section id="info">

     
        <style>{`
          .bento--final {
            grid-template-columns: repeat(3, 100vw) !important;
            grid-template-rows:    repeat(4, 49.5vh) !important;
          }
        `}</style>

        <div
          ref={wrapRef}
          className="relative w-full h-screen flex items-center justify-center overflow-hidden"
        >
          <div
            ref={galleryRef}
            className="relative w-full h-full grid gap-[1vh] grid-cols-[repeat(3,32.5vw)] grid-rows-[repeat(4,23vh)] justify-center content-center"
          >
            <div className="bento__item relative overflow-hidden white-grid-background" style={{ gridArea: "1/1/3/2" }} />
            <div className="bento__item relative overflow-hidden bg-green" style={{ gridArea: "1/2/2/3" }} />
            <div className="bento__item relative overflow-hidden white-grid-background" style={{ gridArea: "2/2/4/3" }} />
            <div className="bento__item relative overflow-hidden bg-green" style={{ gridArea: "1/3/3/4" }} />
            <div className="bento__item relative overflow-hidden green-grid-background" style={{ gridArea: "3/1/4/2" }}>
              <div className="scrolling-text">
                <div className="rail text-white">
                  <h4>Forge the future...</h4>
                  <h4>Intelligent spaces. Human values</h4>
                  <h4>Smarter living, stronger privacy.</h4>
                </div>
              </div>
            </div>
            <div className="bento__item relative overflow-hidden bg-green" style={{ gridArea: "3/3/5/4" }} />
            <div className="bento__item relative overflow-hidden" style={{ gridArea: "4/1/5/2" }} />
            <div className="bento__item relative overflow-hidden bg-green" style={{ gridArea: "4/2/5/3" }}>
              <h1 className="text-8xl h-full flex-center bottom-0 font-source">Info</h1>
            </div>
          </div>
        </div>

        <section className="min-h-dvh">
          <div className="container mx-auto px-4 sm:px-10 py-20 relative z-10">
            <h2 className="text-6xl font-semibold mt-4 text-white">
              Founded in <span className="text-green">2025</span>
            </h2>

            <div className="info-grid">
              <div className="md:col-span-1 flex flex-col items-start justify-center gap-5 px-10 bg-transparent">
                <p className="text-white font-comfortaa text-3xl max-w-lg">
                  Explore the latest innovations, tips, and insights about our smart home products and technology.
                </p>
                <a className="badge bg-green px-4 py-2 rounded-full text-white">Blog</a>
              </div>

              <div className="md:col-span-1 rounded-3xl flex flex-col p-8">
                <h2 className="text-green font-comfortaa text-4xl font-bold mb-6 tracking-wide">
                  Partnerships
                </h2>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://www.infineon.com/"
                    className="group flex items-center gap-4 rounded-2xl px-5 py-4 transition-colors duration-300 hover:bg-green cursor-pointer"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 group-hover:bg-black/10 transition-colors duration-300 overflow-hidden shrink-0">
                      <img src="./images/infineon.svg" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-comfortaa text-white group-hover:text-black font-semibold text-lg transition-colors duration-300">
                      Infineon
                    </span>
                  </a>

                  <a
                    href="https://www.umemesense.com/"
                    className="group flex items-center gap-4 rounded-2xl px-5 py-4 transition-colors duration-300 hover:bg-green cursor-pointer"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 group-hover:bg-black/10 transition-colors duration-300 overflow-hidden shrink-0">
                      <img src="./images/umemesense.png" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-comfortaa text-white group-hover:text-black font-semibold text-lg transition-colors duration-300">
                      UmemeSense
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}