import React from 'react'
import HostLayout from '../ComponentHost/HostLayout'
import RegionCityManager from './AddCities'

export const Cities = () => {
  return (
    <HostLayout>
            <main className="flex-1  bg-gray-50">
            <RegionCityManager />
            </main>

    </HostLayout>
  )
}
