import React, { useState } from 'react'
import { Header } from '../../components/Header'
import { Navbar } from '../../components/Navbar'
import Footer from '../../components/footer'
import { HomeReviews } from '../hotel/Reviews/homeReviews'
import { set } from 'date-fns'

export const HomeCars = () => {
 

    return (
        <>
            <Navbar />
            <Header type={"location"} />

           <h1 className='h-[90vh]'>page cars</h1>

            <Footer />
        </>
    )
}
