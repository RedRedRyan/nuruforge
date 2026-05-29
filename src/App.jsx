import { ScrollTrigger, SplitText,Draggable, InertiaPlugin,CustomEase, CustomWiggle, MotionPathPlugin, Observer } from 'gsap/all';
import Hero from './components/Hero';
import gsap from 'gsap';
import Tech from './components/Tech'
import Info from './components/Info';
import About from './components/About';
import Footer from './components/Footer';
import Contact from './components/Contact';
import Navbar from './components/Navbar';



gsap.registerPlugin(ScrollTrigger, SplitText,Draggable, InertiaPlugin,CustomEase, CustomWiggle, MotionPathPlugin,Observer);

const App = () => {
    return (
        <>
            
                <Navbar/>

                <Hero />
                <About/>
                <Info/>
                <Tech/>
                <Contact/>
                <Footer/>
            
        </>
    );
};

export default App;