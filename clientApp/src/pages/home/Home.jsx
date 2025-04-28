import React, { useEffect, useState } from 'react'
import { Navbar } from '../../components/Navbar'
import { Header } from '../../components/Header'
import { Featured } from '../../components/featured/Featured'
import './home.css'
import { PropertyList } from '../../components/propertyList/PropertyList'
import { Maillist } from '../../components/maillist/Maillist'
import Footer from '../../components/footer'
import { FeaturedProperties } from '../../components/featuredProperties/FeaturedProperties'
import { GuestFavorites } from '../../components/guestFavorites/GuestFavorites'
import { MoroccanExperiences } from '../../components/moroccanExperiences/MoroccanExperiences'
import { faBed, faHome, faMapLocation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import HotelsDisplay from '../list/listItem/HotelsDisplay'
import HotelsList from '../list/listItem/HotelsList'
import { MapComponent } from '../maps/maps'
import { FaMap } from 'react-icons/fa'
// import { MoroccanExperiences } from '../../components/moroccanExperiences/MoroccanExperiences'


export const Home = () => {




    const { t } = useTranslation();
    const [showHotelsMap, setShowHotelsMap] = React.useState(false);

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY) {
                setIsVisible(false); // Hide when scrolling up
            } else {
                setIsVisible(true); // Show when scrolling down
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);

    return (
        <div className="home bg-blue/50 ">
            <div className="fixed bg-blue/90   top-0 left-0 right-0 -z-10 max-h-screen"></div>

            {/* <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
                <button
                    className="bg-black text-white px-5 py-3 text-base md:text-lg lg:text-xl rounded-xl flex items-center gap-2 md:gap-4"
                    onClick={() => setShowHotelsMap(!showHotelsMap)}
                >
                    Show Maps
                    <FaMap />
                </button>
            </div> */}

            {showHotelsMap && <MapComponent showHotelsMap={showHotelsMap} setShowHotelsMap={setShowHotelsMap} />}

            {/* <div className="container-home"> </div> */}

            <div
                className={`w-full sticky top-0 z-50 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
                    }`}
            >


            </div>
            <Navbar />
            <Header type = {"house_rental"}  />
            <div className="mb-10 md:mb-10"> </div>
            <HotelsList city={''} />    


            {/* <Featured /> */}


            {/* 
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
                <div className="flex flex-col items-center justify-start w-full">
                <div className="flex items-start justify-start md:gap-5 gap-2 w-full">
        <FontAwesomeIcon icon={faHome} className="text-3xl text-green-500" />
        <h1 className="homeTitle text-2xl font-bold text-white">
          {t('favorites.title')}
        </h1>
      </div>

                    <div className="h-1 w-full bg-green-500"></div>
                </div>
       
                <GuestFavorites />

                <Maillist />
            </div>  */}
            <HotelsDisplay />
            <Footer />

        </div>
    )
}
