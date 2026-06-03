import gsap from 'gsap';
import { SplitText} from 'gsap/all'
import { useGSAP } from '@gsap/react'
import { Flip } from "gsap/Flip";
import Caterpillar from './Caterpillar';
import ResilienceTest from './ResilienceTest';

gsap.registerPlugin(Flip);

const About = () => {
 useGSAP(() => {

	// Multi-layer parallax
gsap.to(".bg", {
	scrollTrigger: {trigger: ".bottom-grid", scrub: 1},
	y: 100
  });
  gsap.to(".fg", {
	scrollTrigger: {trigger: ".container", scrub: 1},
	y: -80,
	duration: 10,
	ease: "power1.inOut"
  });
	const titleSplit = SplitText.create('#about h2', {
	 type: 'words'
	})
	
	const scrollTimeline = gsap.timeline({
	 scrollTrigger: {
		trigger: '#about',
		start: 'top center'
	 }
	})
	
	scrollTimeline
	 .from(titleSplit.words, {
		opacity: 0, duration: 1, yPercent: 100, ease: 'expo.out', stagger: 0.02
	})
	 .from('.top-grid div, .bottom-grid div', {
		opacity: 0, duration: 1, ease: 'power1.inOut', stagger: 0.04,
	}, '-=0.5')
 })
 
 return (
	<div id="about">
		<div className=" py-28 2xl:px-0 px-5 container mx-auto">
	 <div className=" md:px-0 px-5">
		<div className="content">
		
		 {/*SUB CONTENT*/}
		 <div className="sub-content">
			<p>
			Our growth no longer necessitates the recruitment and education of additional smart home integration specialists.
			</p>
			
			<div>
			 <p className="md:text-3xl text-xl font-bold">
				<span>4.5</span>/5
			 </p>
			 <p className="text-sm text-white-100">
				More than +12000 customers
			 </p>
			</div>
		 </div>
		 	{/* MAIN CONTENT */ }
			 <div className="md:col-span-8 flex flex-col items-end">
  <p className="badge">AI + IoT</p>
  <h2 className="text-right">
    Artificial Intelligence 
    <span className="text-white"> +</span>
    Internet of Things 
  </h2>
</div>
		</div>
	 </div>
	 <Caterpillar/>
	
	 <div className="top-grid">
		<div className="md:col-span-8 text-left">
		<h1 className='text-green text-8xl top-1/2'>	From The Experts   </h1>
		<h1 className='text-white  text-8xl '>	Expect the Best  </h1>
		</div>
		
		<div className="md:col-span-4">
		 <img src="/images/man.png" alt="grid-img-2" className='object-cover' />
		</div>
		
		
	 </div>
	
	 <div className="bottom-grid">
	 <div className="md:col-span-6 relative flex items-center justify-center">
  <img src="/images/infra.png" alt="infra-img" className=" absolute" />
  <img src="/images/application.png" alt="application-img" className="fg bottom-0 z-10" />
</div>
		
		<div className="md:col-span-6">
		 <div  className="noisy" />
		 <h1 className='text-white lg:text-5xl text-4xl text-left font-source bottom-0'> "Whoever coined the term, coined the term, coined the term, coined the term."  <br/> Mahatma Ghandi </h1>
		</div>

		
		
		
		
	 </div>
	 </div>
	 <ResilienceTest/>
	</div>
 )
}
export default About