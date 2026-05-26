import Radar from "./Radar"

const Hero = () => {
  return (
    <section id='hero'>
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
      
      <h1>Forge The<br/>Future</h1>

   
    
      <h2 className="hero-info">AI-powered <br/> Solutions For <br/> Smarter living.</h2>
    
    <div className="hero-grid">
		<div className="md:col-span-1 bg-white hover:scale-105 transition-transform duration-300 hover:bg-green">
		 <div  className="noisy" />
		 <img src="/images/" alt="grid-img-3"  className="flex flex-col items-center"/>
		</div>
		
		<div className="md:col-span-1 bg-gray hover:scale-105 transition-transform duration-300 hover:bg-green">
		 <div  className="noisy" />
		 <img src="/images/nuruorge.png" alt="grid-img-4" className="object-cover w-full h-full" />
		</div>
    <div className="md:col-span-1 bg-dgray hover:scale-105 transition-transform duration-300 hover:bg-green">
		 <div  className="noisy" />
		 <img src="/images/abt4.png" alt="grid-img-4" className="object-cover w-full h-full"/>
		</div>
    
    
	
      </div>
      <img src="/images/nuruforge.png" alt="grid-img-4" className="absolute right-0 bottom-0 xl:w-72" />
    </section>
  )
}

export default Hero