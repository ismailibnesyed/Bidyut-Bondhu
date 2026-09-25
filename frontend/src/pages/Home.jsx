import AboutSection from '../components/AboutSection';
import Herobanner from '../components/Herobanner';
import HowItWorks from '../components/HowItsWork';
import ServiceCards from '../components/ServiceCards';

const Home = () => {
    return (
        <>
            <Herobanner />
            <ServiceCards/>
            <HowItWorks />
            <AboutSection />
        </>
    );
};

export default Home;