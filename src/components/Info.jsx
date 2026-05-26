"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, Flip);

export default function Info() {
  const galleryRef = useRef(null);
  const wrapRef    = useRef(null);
  const flipCtxRef = useRef(null);

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

  return (
    <>
      <style>{`
        .bento--final {
          grid-template-columns: repeat(3, 100vw) !important;
          grid-template-rows:    repeat(4, 49.5vh) !important;
        }
      `}</style>

      {/* Wrap — pinned by ScrollTrigger */}
      <div
        ref={wrapRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Bento grid */}
        <div
          ref={galleryRef}
          className="relative w-full h-full grid gap-[1vh] [grid-template-columns:repeat(3,32.5vw)] [grid-template-rows:repeat(4,23vh)] justify-center content-center"
        >

          {/* 1 — rows 1-2, col 1 */}
          <div className="bento__item relative overflow-hidden" style={{ gridArea: "1/1/3/2" }}>
            <img src="https://assets.codepen.io/16327/portrait-pattern-1.jpg" alt="" className="object-cover w-full h-full block" />
          </div>

          {/* 2 — row 1, col 2 */}
          <div className="bento__item relative overflow-hidden bg-green" style={{ gridArea: "1/2/2/3" }} />

          {/* 3 — rows 2-3, col 2 */}
          <div className="bento__item relative overflow-hidden" style={{ gridArea: "2/2/4/3" }}>
            <img src="https://assets.codepen.io/16327/portrait-image-8.jpg" alt="" className="object-cover w-full h-full block" />
          </div>

          {/* 4 — rows 1-2, col 3 */}
          <div className="bento__item relative overflow-hidden" style={{ gridArea: "1/3/3/4" }}>
            <img src="https://assets.codepen.io/16327/portrait-pattern-2.jpg" alt="" className="object-cover w-full h-full block" />
          </div>

          {/* 5 — row 3, col 1 */}
          <div className="bento__item relative overflow-hidden" style={{ gridArea: "3/1/4/2" }}>
            <img src="https://assets.codepen.io/16327/portrait-image-4.jpg" alt="" className="object-cover w-full h-full block" />
          </div>

          {/* 6 — rows 3-4, col 3 */}
          <div className="bento__item relative overflow-hidden bg-black" style={{ gridArea: "3/3/5/4" }} />

          {/* 7 — row 4, col 1 */}
          <div className="bento__item relative overflow-hidden bg-white" style={{ gridArea: "4/1/5/2" }} />

          {/* 8 — row 4, col 2 */}
          <div className="bento__item relative overflow-hidden" style={{ gridArea: "4/2/5/3" }}>
            <img src="https://assets.codepen.io/16327/portrait-image-1.jpg" alt="" className="object-cover w-full h-full block" />
          </div>

        </div>
      </div>

      {/* Content section */}
      <div className="px-20 py-8">
        <h2 className="text-6xl font-semibold mb-4 text-white">Inroducing Kiota</h2>
        ,<p className="text-white font-comfortaa text-3xl">Kiota, which means 'nest' in Swahili, is a smart bedside lamp
             designed to be a peaceful, intelligent presence in your bedroom.
              It uses cutting-edge radar sensing and on-device machine learning for 
              contactless sleep tracking and environmental awareness.</p>
      </div>
    </>
  );
}