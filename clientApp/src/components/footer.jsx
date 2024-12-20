import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-gray-800 text-gray-200 w-full py-8 flex justify-center">
            <div className="container">
                <div className="container mx-auto px-4 flex flex-wrap md:flex-nowrap">
                    {/* Contact Info */}
                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <h4 className="text-lg font-semibold mb-3">{t('footer.contactUs')}</h4>
                        <p>{t('footer.companyName')}</p>
                        <p>{t('footer.phone', { phone: '(555) 123-4567' })}</p>
                        <p>{t('footer.email', { email: 'support@propertybooking.com' })}</p>
                    </div>

                    {/* Services Links */}
                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <h4 className="text-lg font-semibold mb-3">{t('footer.ourServices')}</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">{t('footer.services.hotelBookings')}</a></li>
                            <li><a href="#" className="hover:underline">{t('footer.services.vacationRentals')}</a></li>
                            <li><a href="#" className="hover:underline">{t('footer.services.carRentals')}</a></li>
                            <li><a href="#" className="hover:underline">{t('footer.services.propertySales')}</a></li>
                            <li><a href="#" className="hover:underline">{t('footer.services.businessTravel')}</a></li>
                        </ul>
                    </div>

                    {/* Company Info */}
                    <div className="w-full md:w-1/3">
                        <h4 className="text-lg font-semibold mb-3">{t('footer.company.companyName')}</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">{t('footer.company.aboutUs')}</a></li>
                            <li><a href="#" className="hover:underline">{t('footer.company.terms')}</a></li>
                            <li><a href="#" className="hover:underline">{t('footer.company.privacy')}</a></li>
                            <li><a href="#" className="hover:underline">{t('footer.company.partner')}</a></li>
                        </ul>
                    </div>

                    {/* Social Media Section */}
                <div className="flex justify-center h-[50px] space-x-6 mt-8">
                    {/* Facebook */}
                    <div className="group relative">
                        <a href="#" className="block text-white">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#1877f2] shadow-[0_0_15px_rgba(24,119,242,0.7)] group-hover:rotate-[-35deg] group-hover:skew-y-[20deg] transition-transform duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                                </svg>
                            </div>
                            <span className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-bottom-8 -bottom-2 transition-all duration-300">
                                {t('footer.social.facebook')}
                            </span>
                        </a>
                    </div>

                    {/* Instagram */}
                    <div className="group relative">
                        <a href="#" className="block text-white">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#e4405f] shadow-[0_0_15px_rgba(228,64,95,0.7)] group-hover:rotate-[-35deg] group-hover:skew-y-[20deg] transition-transform duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </div>
                            <span className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-bottom-8 -bottom-2 transition-all duration-300">
                                {t('footer.social.instagram')}
                            </span>
                        </a>
                    </div>

                    {/* TikTok */}
                    <div className="group relative">
                        <a href="#" className="block text-white">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#00f2ea] shadow-[0_0_15px_rgba(0,242,234,0.7)] group-hover:rotate-[-35deg] group-hover:skew-y-[20deg] transition-transform duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                                </svg>
                            </div>
                            <span className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-bottom-8 -bottom-2 transition-all duration-300">
                                {t('footer.social.tiktok')}
                            </span>
                        </a>
                    </div>
                </div>
                </div>

                

                <div className="text-center mt-8 text-sm text-gray-400">
                    {t('footer.copyright', { year: new Date().getFullYear() })}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
