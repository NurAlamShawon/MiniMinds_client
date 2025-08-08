import React from 'react';
import HeroSection from '../Components/HeroSection';
import SecondSection from '../Components/SecondSection';
import ThirdSection from '../Components/ThirdSection';
import Review from '../Components/Review';
import Faq from '../Components/Faq';
import ReviewBox from '../Components/ReviewBox';

const Home = () => {
    return (
        <div>
    
            <HeroSection/>
            <SecondSection/>
            <ThirdSection/>
            <Review/>
            <ReviewBox/>
            <Faq/>

            
        </div>
    );
};

export default Home;