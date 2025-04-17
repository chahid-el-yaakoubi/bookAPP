import { useEffect, useState } from 'react';
import {
    ChevronDown,
    ChevronUp,
    X,
    Clock,
    Users,
    PawPrint,
    Music,
    Cigarette,
    AlertCircle,
    Bell,
    Camera,
    Mountain,
    Calendar,
    FileText,
    Baby,
    Shield,
    PenToolIcon
} from 'lucide-react';
import { FaHandPointLeft } from 'react-icons/fa';

// Icon mapping to make the component more maintainable
const getIcon = (label) => {
    const iconMap = {
        'Check-in': <Clock className="w-5 h-5 text-gray-600" />,
        'Checkout before': <Clock className="w-5 h-5 text-gray-600" />,
        'Maximum guests': <Users className="w-5 h-5 text-gray-600" />,
        'Pets': <PawPrint className="w-5 h-5 text-gray-600" />,
        'Parties or Events': <Music className="w-5 h-5 text-gray-600" />,
        'Smoking': <Cigarette className="w-5 h-5 text-gray-600" />,
        'Carbon monoxide alarm': <AlertCircle className="w-5 h-5 text-gray-600" />,
        'Smoke alarm': <Bell className="w-5 h-5 text-gray-600" />,
        'Security camera': <Camera className="w-5 h-5 text-gray-600" />,
        'Pool/hot tub': <PenToolIcon className="w-5 h-5 text-gray-600" />,
        'Heights': <Mountain className="w-5 h-5 text-gray-600" />,
        'Free cancellation before': <Calendar className="w-5 h-5 text-gray-600" />,
        'Review the policy': <FileText className="w-5 h-5 text-gray-600" />,
        'Not suitable for infants': <Baby className="w-5 h-5 text-gray-600" />,
        'Damage protection': <Shield className="w-5 h-5 text-gray-600" />
    };

    return iconMap[label] || <div className="w-5 h-5" />;
};

function Modal({ isOpen, onClose, title, items }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"; // Disable scrolling
        } else {
            document.body.style.overflow = "auto"; // Enable scrolling
        }

        return () => {
            document.body.style.overflow = "auto"; // Cleanup on unmount
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 md:p-4">
            <div className="bg-gray-100 p-6 rounded-lg md:max-w-2xl w-full md:max-h-[80vh] h-full overflow-y-auto shadow-xl animate-slide-up">
                <div className="flex justify-between items-center mb-6 border-b py-10">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 absolute top-2 left-2 rounded-full transition-colors md:hidden "
                        aria-label="Close modal"
                    >
                        <FaHandPointLeft className="w-6 h-6 " />
                    </button>
                </div>
                <div className="space-y-5">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-gray-700 py-3 border-b last:border-b-0">
                            <div className="flex items-center gap-3">
                                {getIcon(item.label)}
                                <span>{item.label}</span>
                            </div>
                            <span className="font-medium">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function CategoryItem({ label, value }) {
    return (
        <div className="flex items-center justify-between text-gray-700 py-2">
            <div className="flex items-center gap-3">
                {getIcon(label)}
                <span>{label}</span>
            </div>
            <span className="font-medium">{value}</span>
        </div>
    );
}

function Category({ title, items }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const displayItems = isExpanded ? items : items.slice(0, 3);

    const handleShowMore = () => {
        setIsModalOpen(true);
    };

    return (
        <div className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-4">{title}</h3>
            <div className="space-y-3">
                {displayItems.map((item, index) => (
                    <CategoryItem key={index} label={item.label} value={item.value} />
                ))}
            </div>
            {items.length > 3 && (
                <button
                    onClick={handleShowMore}
                    className="flex items-center gap-2 mt-4 text-pink-600 font-medium hover:text-pink-700 transition-colors"
                >
                    Show all {items.length} options
                    <ChevronDown className="w-4 h-4" />
                </button>
            )}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={title}
                items={items}
            />
        </div>
    );
}

export function ThingsToKnow({ data }) {
    console.log(data?.rules?.max_guests);
    const chekin = data?.checkInOutTimes;
    const categories = {
        houseRules: [
            { label: 'Check-in', value: `${chekin?.checkInWindow.start} - ${chekin?.checkInWindow.end}` },
            { label: 'Checkout before', value: chekin?.checkoutTime },
            { label: 'Maximum guests', value: `${data?.rules?.max_guests} guests maximum` },
            { label: 'Pets', value: data?.rules?.pets?.allowed ? 'allowed' : 'not allowed' },
            { label: 'Parties or Events', value: data?.rules?.events },
            { label: 'Smoking', value: data?.rules?.smoking }
        ],
        safetyAndProperty: [
            { label: 'Carbon monoxide alarm', value: 'Not reported' },
            { label: 'Smoke alarm', value: 'Not reported' },
            { label: 'Security camera', value: 'None reported' },
            { label: 'Pool/hot tub', value: 'No barriers' },
            { label: 'Heights', value: 'No protection' }
        ],
        cancellation: [
            { label: 'Free cancellation before', value: '48 hours' },
            { label: 'Review the policy', value: 'View details' },
            { label: 'Not suitable for infants', value: 'Under 2 years' },
            { label: 'Damage protection', value: 'Required' }
        ]
    };

    return (
        <div className="py-12 border-t">
            <h2 className="text-2xl font-semibold mb-8">Things to know</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Category title="House rules" items={categories.houseRules} />
                <Category title="Safety & property" items={categories.safetyAndProperty} />
                <Category title="Cancellation policy" items={categories.cancellation} />
            </div>
        </div>
    );
}
