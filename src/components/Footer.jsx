import { navLinks,socials } from '../../constants';


const Footer = () => {
  return (
    <section id="footer">
    <div className='footer-grid'>
	<div className="md:col-span-2  space-y-2">
    <div className="flex-center gap-5">
			{socials.map((social) => (
			 <a
			 	key={social.name}
				href={social.url}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={social.name}
			 >
				<img src={social.icon} className='size-8' />
			 </a>
			))}
		 </div>
         <p>+254 705 447903</p>
		 <p>contact@nuruforge.com</p>
		
            </div>
		
		
		<div className="md:col-span-2 ">
		 <div  className="info2" />
            <ul className='font-arvo text-xl text-white list-none font-schibsted-grotesk'>
		 {navLinks.map((link) => (
			<li key={link.id}>
			 <a href={`/${link.id}`}  className='hover:text-black font-nunito'>{link.title}</a>
			</li>
		 ))}
		</ul>
		</div>
		<div className="md:col-span-2">
		 <div  className="info1" />
         
		 
		 <div className="flex-center gap-5">
			<img src='/images/nuruforge.png' className='h-36' />
		 </div>
         
         <p className='text-white font-bold'>&copy; {new Date().getFullYear()} Nuruforge. All Rights Reserved.</p>
         <p className=''><a className='text-gray text-xs' href='https://ystudios.co.ke/'>Website made by  Ystudios</a></p>
		 
		 
		</div>

        
        
		
		
     </div>
    </section>
  )
}

export default Footer