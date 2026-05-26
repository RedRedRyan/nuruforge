"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

const ITEMS = [
  {
    id: "one",
    src: "https://assets.codepen.io/16327/portrait-image-14.jpg",
    label: "No. 01",
  },
  {
    id: "two",
    src: "https://assets.codepen.io/16327/portrait-image-1.jpg",
    label: "No. 02",
  },
  {
    id: "three",
    src: "https://assets.codepen.io/16327/portrait-image-12.jpg",
    label: "No. 03",
  },
  {
    id: "four",
    src: "https://assets.codepen.io/16327/portrait-image-3.jpg",
    label: "No. 04",
  }
];

export default function FlipModal() {
  const modalRef        = useRef(null);
  const modalContentRef = useRef(null);
  const overlayRef      = useRef(null);
  const boxRefs         = useRef([]);        // parent .box divs
  const contentRefs     = useRef([]);        // .box-content divs (the ones that move)
  const activeIndexRef  = useRef(undefined);

  const handleClick = (i) => {
    const box     = contentRefs.current[i];
    const modal   = modalRef.current;
    const content = modalContentRef.current;
    const overlay = overlayRef.current;

    // ── CLOSE ──────────────────────────────────────────
    if (activeIndexRef.current !== undefined) {
      const state = Flip.getState(box);
      boxRefs.current[activeIndexRef.current].appendChild(box);
      activeIndexRef.current = undefined;

      gsap.to([modal, overlay], {
        autoAlpha: 0,
        ease: "power1.inOut",
        duration: 0.35,
      });

      gsap.set(box, { zIndex: 1002 });
      Flip.from(state, {
        duration: 0.7,
        ease: "power1.inOut",
        absolute: true,
        onComplete: () => gsap.set(box, { zIndex: "auto" }),
      });

    // ── OPEN ───────────────────────────────────────────
    } else {
      const state = Flip.getState(box);
      content.appendChild(box);
      activeIndexRef.current = i;

      gsap.set(modal, { autoAlpha: 1 });
      Flip.from(state, { duration: 0.7, ease: "power1.inOut" });
      gsap.to(overlay, { autoAlpha: 0.65, duration: 0.35 });
    }
  };

  return (
    <section className="w-full min-h-screen bg-black px-6 py-16">
      <h1 className="text-white text-center font-comfortaa text-6xl" >How It Works</h1>
    <div className=" flex items-center justify-center mt-20 ">
      
      {/* 1 × 3 grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full max-w-[260px] sm:max-w-4xl mx-auto">
        {ITEMS.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => (boxRefs.current[i] = el)}
            className="aspect-[3/4] border border-dashed border-white/20 rounded-xl p-2 flex items-center justify-center relative"
          >
            <div
              ref={(el) => (contentRefs.current[i] = el)}
              onClick={() => handleClick(i)}
              className="w-full h-full rounded-lg bg-center bg-cover cursor-pointer relative group"
              style={{ backgroundImage: `url(${item.src})` }}
            >
              {/* hover label */}
              <span className="absolute bottom-3 left-3 text-white text-xs font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <div
        ref={modalRef}
        className="fixed inset-0 z-[1000] flex items-center justify-center invisible opacity-0"
      >
        {/* overlay — click to close whichever item is active */}
        <div
          ref={overlayRef}
          onClick={() => {
            if (activeIndexRef.current !== undefined) {
              handleClick(activeIndexRef.current);
            }
          }}
          className="absolute inset-0 bg-black opacity-0 cursor-pointer"
        />

        {/* content slot — the moving card lands here */}
        <div
          ref={modalContentRef}
          className="relative z-10 h-[90vh] [aspect-ratio:4/5]"
        />
      </div>
    </div>
    </section>
  );
}