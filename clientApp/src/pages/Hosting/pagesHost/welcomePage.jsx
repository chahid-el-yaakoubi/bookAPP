import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
const WelcomePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue to-white">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        {t('partnerWelcome.hero.title')}
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        {t('partnerWelcome.hero.subtitle')}
                    </p>
                    <button onClick={() => navigate('/hosting/login')} className="bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors">
                        {t('partnerWelcome.hero.becomePartner')}
                    </button>
                </div>

                {/* Business Categories Section */}
                <div className="mt-20">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        {t('partnerWelcome.categories.title')}
                    </h2>
                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
                        {['realEstate', 'rentalHomes', 'carRental', 'shops', 'homeServices'].map((category) => (
                            <div key={category} className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-blue text-4xl mb-4">
                                    {category === 'realEstate' && '🏠'}
                                    {category === 'rentalHomes' && '🏢'}
                                    {category === 'carRental' && '🚗'}
                                    {category === 'shops' && '🏪'}
                                    {category === 'homeServices' && '🛠️'}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {t(`partnerWelcome.categories.${category}.title`)}
                                </h3>
                                <p className="text-gray-600">
                                    {t(`partnerWelcome.categories.${category}.description`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="mt-20">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        {t('partnerWelcome.benefits.title')}
                    </h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {['platform', 'customers', 'payments', 'growth'].map((benefit) => (
                            <div key={benefit} className="text-center p-6">
                                <div className="text-blue text-4xl mb-4">
                                    {benefit === 'platform' && '📱'}
                                    {benefit === 'customers' && '👥'}
                                    {benefit === 'payments' && '💳'}
                                    {benefit === 'growth' && '📈'}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {t(`partnerWelcome.benefits.${benefit}.title`)}
                                </h3>
                                <p className="text-gray-600">
                                    {t(`partnerWelcome.benefits.${benefit}.description`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Getting Started Section */}
                <div className="mt-20 text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        {t('partnerWelcome.getStarted.title')}
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        {t('partnerWelcome.getStarted.subtitle')}
                    </p>
                    <button onClick={() => navigate('/hosting/login')} className="bg-blue text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue transition-colors">
                        {t('partnerWelcome.getStarted.createListing')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
