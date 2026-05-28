"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

const ITEMS = [
  { id: "one",   src: "/images/smartsensors.png",   label: "Motion, temperature, humidity, water leaks" },
  { id: "two",   src: "/images/homeautomation.png",  label: "Centralize control of all smart devices"   },
  { id: "three", src: "/images/smartcleaning.png",   label: "Robot Vacuums"                             },
  { id: "four",  src: "/images/smartenergy.png",     label: "Smart plugs, energy monitors, solar panel integration" },
];

// Card is wider on mobile (2 cards) and narrower on desktop (4 cards)
const CARD_CLASSES =
  "caterpillar-card w-[40vw] sm:w-[18vw] min-w-[80px] max-w-[180px] aspect-[3/4] rounded-lg bg-center bg-cover relative group flex-shrink-0";

const LABEL_CLASSES =
  "absolute bottom-3 left-3 text-white text-sm font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none";

function makeClone(sourceCard) {
  const clone = document.createElement("div");
  clone.className = CARD_CLASSES;
  clone.style.backgroundImage = sourceCard.style.backgroundImage;
  const span = document.createElement("span");
  span.className   = LABEL_CLASSES;
  span.textContent = sourceCard.querySelector("span")?.textContent ?? "";
  clone.appendChild(span);
  return clone;
}

export default function Caterpillar() {
  const containerRef   = useRef(null);
  const isAnimatingRef = useRef(false);

  // Start with 2 cards on mobile, 4 on desktop.
  // Initialise after mount so window is available (avoids SSR mismatch).
  const [initialItems, setInitialItems] = useState(ITEMS);

  useEffect(() => {
    const isMobile = window.innerWidth < 640; // matches Tailwind's `sm` breakpoint
    if (isMobile) setInitialItems(ITEMS.slice(0, 2));
  }, []);

  const updateCaterpillar = (forward) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const container = containerRef.current;
    const cards = gsap.utils.toArray(".caterpillar-card", container);
    const first = cards[0];
    const last  = cards[cards.length - 1];

    const state   = Flip.getState(cards);
    const newCard = makeClone(forward ? first : last);
    gsap.set(newCard, { scale: 0, opacity: 0 });

    if (forward) {
      container.append(newCard);
      first.classList.add("hidden"); // CSS class — lets absoluteOnLeave override display
    } else {
      container.prepend(newCard);
      last.classList.add("hidden");
    }

    Flip.from(state, {
      targets: ".caterpillar-card",
      fade: true,
      absoluteOnLeave: true,
      onEnter: (els) => {
        gsap.to(els, {
          opacity: 1,
          scale: 1,
          transformOrigin: forward ? "bottom right" : "bottom left",
        });
      },
      onLeave: (els) => {
        gsap.to(els, {
          opacity: 0,
          scale: 0,
          transformOrigin: forward ? "bottom left" : "bottom right",
          onComplete: () => {
            els[0].remove();
            isAnimatingRef.current = false;
          },
        });
      },
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-8 font-mono">

      {/* Card strip */}
      <div
        ref={containerRef}
        className="flex gap-3 p-1.5 border-2 border-dashed border-white/20 rounded-xl bg-white/[0.03] relative"
      >
        {initialItems.map((item) => (
          <div
            key={item.id}
            className={CARD_CLASSES}
            style={{ backgroundImage: `url(${item.src})` }}
          >
            <span className={LABEL_CLASSES}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => updateCaterpillar(false)}
          className="px-6 py-2 rounded-full border border-white/25 bg-transparent text-white text-xs tracking-widest cursor-pointer transition-colors duration-200 hover:bg-white/10 hover:border-white/50 active:bg-white/20"
        >
          ← Prev
        </button>
        <button
          onClick={() => updateCaterpillar(true)}
          className="px-6 py-2 rounded-full border border-white/25 bg-transparent text-white text-xs tracking-widest cursor-pointer transition-colors duration-200 hover:bg-white/10 hover:border-white/50 active:bg-white/20"
        >
          Next →
        </button>
      </div>
    </div>
  );
}