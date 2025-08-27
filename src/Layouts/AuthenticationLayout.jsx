import React from 'react';
import Navbar from '../Components/Navbar';
import { Outlet } from 'react-router';
import Footer from '../Components/Footer';

const AuthenticationLayout = () => {
    return (
        <div className='bg-gradient-to-r from-[#58A0C8] to-blue-50'>
            <Navbar/>
            <Outlet/>
            <Footer/>
            
        </div>
    );
};

export default AuthenticationLayout;