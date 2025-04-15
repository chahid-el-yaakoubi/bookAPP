import React from 'react'
import { Header } from '../../components/Header'
import { Navbar } from '../../components/Navbar'
import Footer from '../../components/footer'

export const HomeCars = () => {
    return (
        <>
            <Navbar />
            <Header type={"location"} />

            <div className='h-screen mt-20'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis maxime quam eligendi mollitia ab eveniet nostrum sunt voluptatem fugit! Excepturi sed aliquid atque dolorem dolor nulla voluptate eum molestiae nemo!
            </div>

            <Footer />
        </>
    )
}
