import React from 'react';
import HeroSection from '../Components/HeroSection';
import SecondSection from '../Components/SecondSection';
import ThirdSection from '../Components/ThirdSection';
import Review from '../Components/Review';
import Faq from '../Components/Faq';

const Home = () => {
    return (
        <div>
    
            <HeroSection/>
            <SecondSection/>
            <ThirdSection/>
            <Review/>
            <Faq/>

            
        </div>
    );
};

export default Home;