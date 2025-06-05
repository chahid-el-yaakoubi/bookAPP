import { MdDashboard } from 'react-icons/md';
import { FaHome, FaCar, FaTools, FaStore, FaBars, FaCity, FaHandshake } from 'react-icons/fa';
import NavItem from './NavItem';
import { useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../../../components/Navbar';
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { FaPeopleLine } from 'react-icons/fa6';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, isMobile }) => {
    const { state } = useContext(AuthContext);
    const isAdmin = state.user;

    const navigate = useNavigate();
    const location = useLocation();

    const isActivePath = (path) => {
        return location.pathname.includes(path);
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };
    // mobile
    if (isMobile) {
        return (
            <>
                <div className="fixed top-0 left-0 right-0 bg-primary shadow-lg z-40 p-4 ">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-xl text-blue"><Logo /></h2>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                        >
                            <FaBars />
                        </button>
                    </div>
                </div>
                {isSidebarOpen && (
                    <>
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 mt-[73px]" onClick={() => setIsSidebarOpen(false)} />
                        <nav className="fixed top-[60px] left-0 right-0 bg-primary shadow-lg z-50">
                            <NavItem icon={<MdDashboard />} text="Overview" className='' showText={isSidebarOpen} active={isActivePath('/hosting')} onClick={() => handleNavigation('/hosting')} />

                            {
                                (isAdmin.isAdmin && isAdmin.roles.hotels) && (
                                    <NavItem icon={<FaHome />} text="Properties" showText={isSidebarOpen} active={isActivePath('/host/properties')} onClick={() => handleNavigation('/host/properties/listining')} />
                                )
                            }
                            {
                                (isAdmin.isAdmin && isAdmin.roles.users) && (
                                    <NavItem icon={<FaHandshake />} text="Partners" showText={isSidebarOpen} active={isActivePath('/iAmAdmin/partners')} onClick={() => handleNavigation('/iAmAdmin/partners')} />
                                )
                            }
                            {
                                (isAdmin.isAdmin && isAdmin.roles.hotels) && (
                                    <NavItem icon={<FaPeopleLine />} text="Users" showText={isSidebarOpen} active={isActivePath('/iAmAdmin/users')} onClick={() => handleNavigation('/iAmAdmin/users')} />
                                )
                            }
                            {
                                (isAdmin.isAdmin && isAdmin.roles.cars) && (
                                    <NavItem icon={<FaCar />} text="Vehicles" showText={isSidebarOpen} active={isActivePath('/host/cars')} onClick={() => handleNavigation('/host/cars')} />
                                )
                            }
                            {
                                (isAdmin.isAdmin && isAdmin.roles.cars) && (
                                    <NavItem icon={<FaTools />} text="Services" showText={isSidebarOpen} active={isActivePath('/host/services')} onClick={() => handleNavigation('/host/services')} />
                                )
                            }
                            {
                                (isAdmin.isAdmin && isAdmin.roles.shops) && (
                                    <NavItem icon={<FaStore />} text="Shops" showText={isSidebarOpen} active={isActivePath('/host/shops')} onClick={() => handleNavigation('/host/shops')} />
                                )
                            }
                            {
                                (isAdmin.isAdmin && isAdmin.roles.users) && (
                                    <NavItem icon={<FaCity />} text="Cities" showText={isSidebarOpen} active={isActivePath('/host/cities')} onClick={() => handleNavigation('/host/cities')} />
                                )
                            }
                        </nav>
                    </>
                )}
            </>
        );
    }

    return (
        <aside className={`
            ${isSidebarOpen ? 'w-64' : 'w-14'}
            fixed md:sticky
            top-0
            h-screen
            bg-primary shadow-lg 
            transition-all duration-300
            z-30
        `}>
            <div className="p-4 flex items-center justify-between">
                <h2 className={`${!isSidebarOpen && 'hidden'} font-bold text-xl text-blue`}><Logo /></h2>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100 "
                >
                    <FaBars />
                </button>
            </div>

            <nav className="mt-8">
                <NavItem icon={<MdDashboard />} text="Overview" className='' showText={isSidebarOpen} active={isActivePath('/hosting')} onClick={() => handleNavigation('/hosting')} />
                {
                    (isAdmin.isAdmin && isAdmin.roles.users) && (
                        <NavItem icon={<FaHandshake />} text="Partners" showText={isSidebarOpen} active={isActivePath('/iAmAdmin/partners')} onClick={() => handleNavigation('/iAmAdmin/partners')} />
                    )
                }
                {
                    (isAdmin.isAdmin && isAdmin.roles.users) && (
                        <NavItem icon={<FaPeopleLine />} text="Users" showText={isSidebarOpen} active={isActivePath('/iAmAdmin/users')} onClick={() => handleNavigation('/iAmAdmin/users')} />
                    )
                }
                {
                    (isAdmin.isAdmin && isAdmin.roles.hotels) && (
                        <NavItem icon={<FaHome />} text="Properties" showText={isSidebarOpen} active={isActivePath('/host/properties')} onClick={() => handleNavigation('/host/properties/listining')} />
                    )
                }
                {
                    (isAdmin.isAdmin && isAdmin.roles.cars) && (
                        <NavItem icon={<FaCar />} text="Vehicles" showText={isSidebarOpen} active={isActivePath('/host/cars')} onClick={() => handleNavigation('/host/cars')} />
                    )
                }
                {/* {
                    (isAdmin.isAdmin && isAdmin.roles.cars) && (
                        <NavItem icon={<FaTools />} text="Services" showText={isSidebarOpen} active={isActivePath('/host/services')} onClick={() => handleNavigation('/host/services')} />
                    )
                } */}
                {/* {
                    (isAdmin.isAdmin && isAdmin.roles.shops) && (
                        <NavItem icon={<FaStore />} text="Shops" showText={isSidebarOpen} active={isActivePath('/host/shops')} onClick={() => handleNavigation('/host/shops')} />
                    )
                } */}
                {
                    (isAdmin.isAdmin && isAdmin.roles.users) && (
                        <NavItem icon={<FaCity />} text="Cities" showText={isSidebarOpen} active={isActivePath('/host/cities')} onClick={() => handleNavigation('/host/cities')} />
                    )
                }
            </nav>
        </aside>
    );
};

export default Sidebar; 