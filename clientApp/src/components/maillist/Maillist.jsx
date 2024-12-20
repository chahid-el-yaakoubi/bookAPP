import React from 'react'
import './Maillist.css'

export const Maillist = () => {
    return (
        <div className="bg-transparent mail flex items-center justify-center p-11">
            <div className="mailList flex flex-col items-center">
                <h1 className='text-3xl font-bold'>Stay Updated with Our Best Deals</h1>
                <span className='text-lg text-white pt-8 pb-5'>Subscribe to our newsletter for exclusive offers</span>
                <div className="mailInputContainer">
                    <input 
                        type="email" 
                        placeholder='Enter your email address' 
                        className="email-input"
                    />
                    <button className="subscribe-btn">Subscribe Now</button>
                </div>
            </div>
        </div>
    )
}
