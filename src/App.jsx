import { ScrollTrigger, SplitText } from 'gsap/all';
import Hero from './components/Hero';
import gsap from 'gsap';
import Tech from './components/Tech'
import Info from './components/Info';
import FlipModal from './components/Flipmodal';
import About from './components/About';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger, SplitText);

const App = () => {
    return (
        <>
            

                <Hero />
                <About/>
                <FlipModal/>
                <Info/>

                <Tech/>
                <Footer/>
            
        </>
    );
};

export default App;