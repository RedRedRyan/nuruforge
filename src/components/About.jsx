import gsap from 'gsap';
import { SplitText} from 'gsap/all'
import { useGSAP } from '@gsap/react'
import { Flip } from "gsap/Flip";
import Caterpillar from './Caterpillar';

gsap.registerPlugin(Flip);

const About = () => {
 useGSAP(() => {
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
		<div className="md:col-span-8">
		<h1 className='text-green flex-center text-8xl top-1/2'>	From The Experts</h1>
		</div>
		
		<div className="md:col-span-4">
		 <img src="/images/man.png" alt="grid-img-2" className='object-cover' />
		</div>
		
		
	 </div>
	
	 <div className="bottom-grid">
		<div className="md:col-span-2 bg-lgray">
		<img src="/images/quarry.png" alt="grid-img-2" />
		 
		</div>
		<div className="md:col-span-5 bg-gray">
		 <div  className="noisy" />
		 <h1 className='text-black flex-center lg:text-8xl text-2xl text-left'>Expect The Best</h1>
		</div>
		<div className="md:col-span-5 bg-dgray">
		 <div  className="noisy" />
		 <h1 className='text-black flex-center text-8xl text-left'>Expect The Best</h1>
		</div>
		
		
		
	 </div>
	 </div>
	</div>
 )
}
export default About