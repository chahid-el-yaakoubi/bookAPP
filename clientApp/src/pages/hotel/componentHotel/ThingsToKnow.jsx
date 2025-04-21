import { useEffect, useState } from 'react';
import {
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
  PenToolIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

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

function PolicyItem({ label, value, isExpanded, onClick }) {
  return (
    <div 
      className={`flex items-center justify-between py-3 px-4 border-b hover:bg-gray-50 cursor-pointer transition ${isExpanded ? 'bg-gray-50' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {getIcon(label)}
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-700">{value}</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>
    </div>
  );
}

function PolicyDetails({ label, value, description }) {
  return (
    <div className="p-6 bg-gray-50 border-b">
      <div className="mb-3 flex items-center gap-3">
        {getIcon(label)}
        <h4 className="text-lg font-semibold">{label}</h4>
      </div>
      <p className="text-gray-700 mb-2"><strong>{value}</strong></p>
      {description && <p className="text-gray-600 text-sm">{description}</p>}
    </div>
  );
}

function PolicyCategory({ title, items }) {
  const [expandedItem, setExpandedItem] = useState(null);

  const toggleItem = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  return (
    <div className="mb-8">
      <h3 className="font-semibold text-xl mb-4">{title}</h3>
      <div className="border rounded-lg overflow-hidden shadow-sm">
        {items.map((item, index) => (
          <div key={index}>
            <PolicyItem 
              label={item.label} 
              value={item.value} 
              isExpanded={expandedItem === index}
              onClick={() => toggleItem(index)}
            />
            {expandedItem === index && (
              <PolicyDetails 
                label={item.label} 
                value={item.value} 
                description={item.description} 
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TabSelector({ categories, activeTab, onTabChange }) {
  return (
    <div className="flex border-b mb-6">
      {Object.keys(categories).map((category) => (
        <button
          key={category}
          className={`px-6 py-3 font-medium text-sm transition-colors ${
            activeTab === category
              ? 'border-b-2 border-pink-600 text-pink-600'
              : 'text-gray-600 hover:text-pink-600'
          }`}
          onClick={() => onTabChange(category)}
        >
          {categories[category].title}
        </button>
      ))}
    </div>
  );
}

export function ThingsToKnow({ data }) {
  const [activeTab, setActiveTab] = useState('houseRules');

  const checkIn = data?.checkInOutTimes;
  
  const categories = {
    houseRules: {
      title: "House Rules",
      items: [
        { 
          label: 'Check-in', 
          value: checkIn ? `${checkIn.checkInWindow.start} - ${checkIn.checkInWindow.end}` : 'Not specified',
          description: 'Please respect the check-in time window. If you arrive outside these hours, contact the host in advance to make arrangements.'
        },
        { 
          label: 'Checkout before', 
          value: checkIn?.checkoutTime || 'Not specified',
          description: 'Please ensure you check out before this time to allow for cleaning and preparation for the next guests.'
        },
        { 
          label: 'Maximum guests', 
          value: data?.rules?.max_guests ? `${data.rules.max_guests} guests maximum` : 'Not specified',
          description: 'The property has capacity limits for safety and comfort. Additional guests beyond this number are not permitted.'
        },
        { 
          label: 'Pets', 
          value: data?.rules?.pets?.allowed ? 'Allowed' : 'Not allowed',
          description: 'Please respect the pet policy. If pets are allowed, ensure they are well-behaved and clean up after them.'
        },
        { 
          label: 'Parties or Events', 
          value: data?.rules?.events || 'Not allowed',
          description: 'The property has specific policies regarding gatherings and events to respect neighbors and maintain the property.'
        },
        { 
          label: 'Smoking', 
          value: data?.rules?.smoking || 'Not allowed',
          description: 'Please respect the smoking policy to keep the property clean and comfortable for all guests.'
        }
      ]
    },
    safetyAndProperty: {
      title: "Safety & Property",
      items: [
        { 
          label: 'Carbon monoxide alarm', 
          value: 'Not reported',
          description: 'This property may not have a carbon monoxide alarm. We recommend bringing a portable detector for additional safety.'
        },
        { 
          label: 'Smoke alarm', 
          value: 'Not reported',
          description: 'This property may not have a smoke alarm. Please be extra cautious and aware of fire safety during your stay.'
        },
        { 
          label: 'Security camera', 
          value: 'None reported',
          description: 'To our knowledge, there are no security cameras on the property. For your privacy and security awareness.'
        },
        { 
          label: 'Pool/hot tub', 
          value: 'No barriers',
          description: 'If present, pools or hot tubs may not have safety barriers. Please supervise children at all times.'
        },
        { 
          label: 'Heights', 
          value: 'No protection',
          description: 'The property may have areas with heights and no protective barriers. Exercise caution, especially with children.'
        }
      ]
    },
    cancellation: {
      title: "Cancellation Policy",
      items: [
        { 
          label: 'Free cancellation before', 
          value: '48 hours',
          description: 'You can cancel without penalty up to 48 hours before check-in for a full refund.'
        },
        { 
          label: 'Review the policy', 
          value: 'View details',
          description: 'Please review the complete cancellation policy which includes information on partial refunds and exceptions.'
        },
        { 
          label: 'Not suitable for infants', 
          value: 'Under 2 years',
          description: 'This property may not be equipped with appropriate safety features for infants under 2 years old.'
        },
        { 
          label: 'Damage protection', 
          value: 'Required',
          description: 'A damage protection fee or deposit is required for your stay to cover any potential damages.'
        }
      ]
    }
  };

  return (
    <div className="py-12 border-t">
      <h2 className="text-2xl font-semibold mb-6">Things to know</h2>
      
    
        <div>
          <TabSelector 
            categories={categories} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          <PolicyCategory 
            title={categories[activeTab].title} 
            items={categories[activeTab].items} 
          />
        </div>
    </div>
  );
}