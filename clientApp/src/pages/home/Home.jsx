import React from 'react'
import { Navbar } from '../../components/Navbar'
import { Header } from '../../components/Header'
import { Featured } from '../../components/featured/Featured'
import './Home.css'
import { PropertyList } from '../../components/propertyList/PropertyList'
import { Maillist } from '../../components/maillist/Maillist'
import Footer from '../../components/footer'
import { FeaturedProperties } from '../../components/featuredProperties/FeaturedProperties'
import { GuestFavorites } from '../../components/guestFavorites/GuestFavorites'
import { MoroccanExperiences } from '../../components/moroccanExperiences/MoroccanExperiences'
import { faBed, faHome, faMapLocation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
// import { MoroccanExperiences } from '../../components/moroccanExperiences/MoroccanExperiences'

export const Home = () => {
    const { t } = useTranslation();
    return (
        <div className="home bg-blue/40">
            {/* <div className="container-home"> </div> */}

            <Navbar />
            <Header />
            <div className="homeContainer container mx-auto px-4 lg:px-0">
                <Featured />

                <div className="flex flex-col items-center justify-start w-full">
                    <div className="flex items-start justify-start md:gap-5 gap-2 w-full">
                        <FontAwesomeIcon icon={faMapLocation} className="text-3xl text-blue" />
                        <h1 className="homeTitle text-2xl font-bold text-white">
                            {t("homeTitle.DiscoverNador")}
                        </h1>
                    </div>

                    <div className="h-1 w-full bg-orange-500 -mt-4"></div>
                </div>
                <MoroccanExperiences />

                <div className="flex flex-col items-center justify-start w-full">
                    <div className="flex items-start justify-start md:gap-5 gap-2 w-full">
                        <FontAwesomeIcon icon={faBed} className="text-3xl text-yellow-500" />
                        <h1 className="homeTitle text-2xl font-bold text-white">
                            {t("homeTitle.BrowseByPropertyType")}
                        </h1>
                    </div>

                    <div className="h-1 w-full bg-yellow-500"></div>
                </div>
                <PropertyList />

                

                    <div className="flex flex-col items-center justify-start w-full">
                    <div className="flex items-start justify-start md:gap-5 gap-2 w-full">
                        <FontAwesomeIcon icon={faHome} className="text-3xl text-green-500" />
                        <h1 className="homeTitle text-2xl font-bold text-white">
                            {t("homeTitle.HomesGuestsLove")}
                        </h1>
                    </div>

                    <div className="h-1 w-full bg-green-500"></div>
                </div>
                <FeaturedProperties />
                {/*                  
                <h1 className="homeTitle">Get inspiration for your next trip</h1>
                <GuestFavorites /> */}

                <Maillist />
            </div>
            <Footer />

        </div>
    )
}
