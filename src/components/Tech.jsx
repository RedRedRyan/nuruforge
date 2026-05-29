import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Tech = () => {
  const techRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.panel', techRef.current);

      // Set initial states via GSAP directly — don't rely on CSS
      // CSS visibility can block GSAP's autoAlpha from working
      gsap.set(panels[0], { autoAlpha: 1, scale: 1 });
      gsap.set(panels.slice(1), { autoAlpha: 0, scale: 0.8 });

      let currentIndex = 0; // track by index, not element reference

      function goToPanel(index) {
        if (index === currentIndex) return;
        gsap.to(panels[currentIndex], { scale: 0.8, autoAlpha: 0, duration: 0.3, overwrite: true });
        gsap.to(panels[index],        { scale: 1,   autoAlpha: 1, duration: 0.3, overwrite: true });
        currentIndex = index;
      }

      ScrollTrigger.create({
        trigger: techRef.current,
        pin: true,
        start: 'top top',
        end: `+=${(panels.length - 1) * window.innerHeight}`,
        pinSpacing: true,
        snap: 1 / (panels.length - 1), // snaps to each panel cleanly
        onUpdate: (self) => {
          const index = Math.round(self.progress * (panels.length - 1));
          goToPanel(index);
        },
      });

    }, techRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={techRef} id="tech">
      {/* Description Panel */}
      <section className="first panel description">
        
        <div className='sm:px-10 pb-20 container mx-auto'>
        <h1 className='relative'>The<br />Craft</h1>
        <div className="tech-grid">
    
		<div className="md:col-span-3 bg-green">
		 
     <p>1<br/>Craft</p>
		</div>
		
		
		
		<div className="md:col-span-3 bg-gray">
		 <div  className="noisy" />
    <p>2 <br/>Craft</p>
		</div>
    <div className="md:col-span-3 bg-dgray">
		 <div  className="noisy" />
    <p>3<br/>Craft</p>
		</div>
    
	 </div>
   
        
        
        </div>
      </section>

      {/* Panel One */}
      <section className="panel one">
      <img src='/images/cube.png' className='lg:left-40 bottom-20 absolute' />
      <div className='sm:px-10 pb-20 container mx-auto'>
      <h1 className='text-5xl md:text-[8vw] leading-none text-right font-comfortaa text-white mr-10'>Edge-first<br />Intelligence</h1>
        
        </div>
      </section>
      {/* Panel Two */}
      <section className="panel two">
  <img src='/images/stairs1r.png' className='right-0 bottom-0 absolute size-160 ' />
  <img src='/images/wgraph.png' className='-left-40 top-0 absolute ' />
  
  <div className="container mx-auto px-4 sm:px-10 pt-10 pb-20">
    <h1 className='text-5xl md:text-[7vw] leading-none text-left lg:text-center font-comfortaa text-white mb-10 relative z-10'>
      Resilient By<br/> Design
    </h1>
    
    
  </div>
</section>
      {/* Panel Three */}
      <section className="panel three">
      <img src='/images/monsterlook.png' className=' top-10  absolute w-72' />
      <img src='/images/tube.png' className=' lg:right-40 absolute' />
      <div className='sm:px-10 pb-20 container mx-auto'>
      <h1 className='text-5xl md:text-[6vw] leading-none text-left font-comfortaa text-green ml-5'>Privacy & <br />Sovereignity </h1>
       
        </div>
      </section>
      {/* Panel Four */}
      <section className="panel four">
        <img src='/images/column.png' className='absolute -left-40'/>
      <div className='sm:px-10 pb-20 container mx-auto'>
      <h1 className='text-6xl md:text-[8vw] leading-none text-right font-comfortaa text-white mr-10'>Continuous <br />Support</h1>
        
        </div>
      </section>
    </div>
  );
};

export default Tech;