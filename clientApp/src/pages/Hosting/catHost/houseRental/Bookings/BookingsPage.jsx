import React from 'react'
import { BookingsList } from './component/bookings_list'
import TopNavHost from '../../../ComponentHost/TopNavHost'
import HostLayout from '../../../ComponentHost/HostLayout'
import BookingDetailsPage from './page'

export const BookingsPage = (params) => {
    return (
        <>
            <HostLayout >
                <TopNavHost category="bookings" />
                <main className='flex-1 p-2 pt-20 md:p-6 md:pt-20 bg-blue/30'>
                {
                    params?.type === 'detail' ? <BookingDetailsPage /> : <BookingsList />
                }
                    
                </main>
            </HostLayout>
        </>
    )
}
