import { ScrollTrigger,ScrambleTextPlugin ,SplitText,Draggable, InertiaPlugin,CustomEase, CustomWiggle, MotionPathPlugin, Observer } from 'gsap/all';
import Hero from './components/Hero';
import gsap from 'gsap';
import Tech from './components/Tech'
import Info from './components/Info';
import About from './components/About';
import Footer from './components/Footer';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import ResilienceTest from './components/ResilienceTest';



gsap.registerPlugin(ScrollTrigger, SplitText,Draggable, InertiaPlugin,CustomEase, CustomWiggle, MotionPathPlugin,Observer, ScrambleTextPlugin);

const App = () => {
    return (
        <>
            
                <Navbar/>

                <Hero />
                <About/>
                
                <Info/>
              <ResilienceTest/>
                <Tech/>
                <Contact/>
                <Footer/>
            
        </>
    );
};

export default App;