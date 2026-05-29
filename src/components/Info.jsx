"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger,Observer } from "gsap/all";
import { Flip } from "gsap/Flip";

import { useGSAP } from "@gsap/react";

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

  useGSAP(() => {
    gsap.to(".green-grid-background", {
      backgroundPosition: "200% 200%",
      duration: 20,
      ease: "linear",
      repeat: -1,
    });

    const scrollingText = gsap.utils.toArray('.rail h4');

const tl = horizontalLoop(scrollingText, {
  repeat: -1,
  paddingRight: 30,
});

Observer.create({
  onChangeY(self) {
    let factor = 2.5;
    if (self.deltaY < 0) {
      factor *= -1;
    } 
    gsap.timeline({
      defaults: {
        ease: "none",
      }
    })
      .to(tl, { timeScale: factor * 2.5, duration: 0.2, overwrite: true, })
      .to(tl, { timeScale: factor / 2.5, duration: 1 }, "+=0.3");
  }
});

/*
This helper function makes a group of elements animate along the x-axis in a seamless, responsive loop.

Features:
 - Uses xPercent so that even if the widths change (like if the window gets resized), it should still work in most cases.
 - When each item animates to the left or right enough, it will loop back to the other side
 - Optionally pass in a config object with values like "speed" (default: 1, which travels at roughly 100 pixels per second), paused (boolean),  repeat, reversed, and paddingRight.
 - The returned timeline will have the following methods added to it:
   - next() - animates to the next element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
   - previous() - animates to the previous element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
   - toIndex() - pass in a zero-based index value of the element that it should animate to, and optionally pass in a vars object to control duration, easing, etc. Always goes in the shortest direction
   - current() - returns the current index (if an animation is in-progress, it reflects the final index)
   - times - an Array of the times on the timeline where each element hits the "starting" spot. There's also a label added accordingly, so "label1" is when the 2nd element reaches the start.
 */
function horizontalLoop(items, config) {
	items = gsap.utils.toArray(items);
	config = config || {};
	let tl = gsap.timeline({repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
		length = items.length,
		startX = items[0].offsetLeft,
		times = [],
		widths = [],
		xPercents = [],
		curIndex = 0,
		pixelsPerSecond = (config.speed || 1) * 100,
		snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
		totalWidth, curX, distanceToStart, distanceToLoop, item, i;
	gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
		xPercent: (i, el) => {
			let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
			xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
			return xPercents[i];
		}
	});
	gsap.set(items, {x: 0});
	totalWidth = items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0);
	for (i = 0; i < length; i++) {
		item = items[i];
		curX = xPercents[i] / 100 * widths[i];
		distanceToStart = item.offsetLeft + curX - startX;
		distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
		tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
		  .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
		  .add("label" + i, distanceToStart / pixelsPerSecond);
		times[i] = distanceToStart / pixelsPerSecond;
	}
	function toIndex(index, vars) {
		vars = vars || {};
		(Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
		let newIndex = gsap.utils.wrap(0, length, index),
			time = times[newIndex];
		if (time > tl.time() !== index > curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
			vars.modifiers = {time: gsap.utils.wrap(0, tl.duration())};
			time += tl.duration() * (index > curIndex ? 1 : -1);
		}
		curIndex = newIndex;
		vars.overwrite = true;
		return tl.tweenTo(time, vars);
	}
	tl.next = vars => toIndex(curIndex+1, vars);
	tl.previous = vars => toIndex(curIndex-1, vars);
	tl.current = () => curIndex;
	tl.toIndex = (index, vars) => toIndex(index, vars);
	tl.times = times;
	tl.progress(1, true).progress(0, true); // pre-render for performance
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
          <div className="bento__item relative overflow-hidden white-grid-background" style={{ gridArea: "1/1/3/2" }}>
            
          </div>

          {/* 2 — row 1, col 2 */}
          <div className="bento__item relative overflow-hidden bg-green" style={{ gridArea: "1/2/2/3" }} />

          {/* 3 — rows 2-3, col 2 */}
          <div className="bento__item relative overflow-hidden white-grid-background" style={{ gridArea: "2/2/4/3" }}>
         
          </div>

          {/* 4 — rows 1-2, col 3 */}
          <div className="bento__item relative overflow-hidden  bg-green" style={{ gridArea: "1/3/3/4" }}>
            
          </div>

          {/* 5 — row 3, col 1 */}
          <div className="bento__item relative overflow-hidden green-grid-background" style={{ gridArea: "3/1/4/2" }}>
          <div class="scrolling-text">
  <div class="rail text-white">
    <h4>Animate Anything...</h4>
    <h4>Delivering silky-smooth performance</h4>
    <h4>so you can focus on the fun stuff.</h4>
  </div>
</div>
          </div>

          {/* 6 — rows 3-4, col 3 */}
          <div className="bento__item relative overflow-hidden bg-green" style={{ gridArea: "3/3/5/4" }} />

          {/* 7 — row 4, col 1 */}
          <div className="bento__item relative overflow-hidden" style={{ gridArea: "4/1/5/2" }} />

          {/* 8 — row 4, col 2 */}
          <div className="bento__item relative overflow-hidden" style={{ gridArea: "4/2/5/3" }}>
          <h4 className="text-white object-cover text-5xl flex-center bottom-0 font-comfortaa ">focus</h4>
          </div>

        </div>
      </div>

      {/* Content section */}
      <section className="min-h-screen flex flex-col items-start justify-center gap-5 px-10">

        <h2 className="text-6xl font-semibold mb-4 text-white">Founded in <span className="text-green">2025</span></h2>
        ,<p className="text-white font-comfortaa text-3xl max-w-lg">Explore the latest innovations, tips, and insights about our smart home products and technology
              contactless sleep tracking and environmental awareness.</p>
      </section>
      </section>
    </>
  );
}