import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  ChevronUp,
  ShieldAlert,
  FireExtinguisher,

  Building,
  Car,
  ArrowRightCircle,
  Bath,
  Toilet
} from 'lucide-react';
import { FaWheelchair } from 'react-icons/fa';

function PolicyItem({ label, value, isExpanded, onClick, getIconFunc }) {
  return (
    <div
      className={`flex items-center justify-between py-3 px-4 border-b hover:bg-gray-50 cursor-pointer transition ${isExpanded ? 'bg-gray-50' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {getIconFunc(label)}
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-700">{value}</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>
    </div>
  );
}

function PolicyDetails({ label, value, description, getIconFunc }) {
  return (
    <div className="p-6 bg-gray-50 border-b">
      <div className="mb-3 flex items-center gap-3">
        {getIconFunc(label)}
        <h4 className="text-lg font-semibold">{label}</h4>
      </div>
      <p className="text-gray-700 mb-2"><strong>{value}</strong></p>
      {description && <p className="text-gray-600 text-sm">{description}</p>}
    </div>
  );
}

function PolicyCategory({ title, items, getIconFunc }) {
  const [expandedItem, setExpandedItem] = useState(null);

  const toggleItem = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  return (
    <div className="mb-8 p-4 rounded bg-gray-100">
      <h3 className="font-semibold text-xl mb-4">{title}</h3>
      <div className="border rounded-lg overflow-hidden shadow-sm">
        {items.map((item, index) => (
          <div key={index}>
            <PolicyItem
              label={item.label}
              value={item.value}
              isExpanded={expandedItem === index}
              onClick={() => toggleItem(index)}
              getIconFunc={getIconFunc}
            />
            {expandedItem === index && (
              <PolicyDetails
                label={item.label}
                value={item.value}
                description={item.description}
                getIconFunc={getIconFunc}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TabSelector({ categories, activeTab, onTabChange, isRTL }) {
  return (
    <div className={`flex border-b mb-6 shadow-xl`}>
      {Object.keys(categories).map((category) => (
        <button
          key={category}
          className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === category
              ? 'border-b-2 border-blue text-xl text-blue'
              : 'text-gray-600 hover:text-primary'
            }`}
          onClick={() => onTabChange(category)}
        >
          {categories[category].title}
        </button>
      ))}
    </div>
  );
}

export function ThingsToKnow({ propertyData }) {
  console.log({ 'test data ': propertyData })
  const [activeTab, setActiveTab] = useState('houseRules');
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Format MongoDB data for component use
  const data = propertyData ? {
    checkInOutTimes: propertyData.policies?.checkInOutTimes || null,
    rules: propertyData.policies?.rules || {},
    safety_features: propertyData.safety_features?.safety || [],
    accessibility_features: propertyData.accessibility_features || {},
    cancellation: propertyData.cancellation || {}
  } : {};

  // Icon mapping function moved inside the component to access the t function
  const getIcon = (label) => {
    const iconMap = {
      [t('rules.checkIn')]: <Clock className="w-5 h-5 text-gray-600" />,
      [t('rules.checkoutBefore')]: <Clock className="w-5 h-5 text-gray-600" />,
      [t('rules.maximumGuests')]: <Users className="w-5 h-5 text-gray-600" />,
      [t('rules.pets')]: <PawPrint className="w-5 h-5 text-gray-600" />,
      [t('rules.partiesOrEvents')]: <Music className="w-5 h-5 text-gray-600" />,
      [t('rules.smoking')]: <Cigarette className="w-5 h-5 text-gray-600" />,
      [t('rules.carbonMonoxideAlarm')]: <AlertCircle className="w-5 h-5 text-gray-600" />,
      [t('rules.smokeAlarm')]: <Bell className="w-5 h-5 text-gray-600" />,
      [t('rules.securityCamera')]: <Camera className="w-5 h-5 text-gray-600" />,
      [t('rules.poolHotTub')]: <PenToolIcon className="w-5 h-5 text-gray-600" />,
      [t('rules.heights')]: <Mountain className="w-5 h-5 text-gray-600" />,
      [t('rules.freeCancellationBefore')]: <Calendar className="w-5 h-5 text-gray-600" />,
      [t('rules.reviewThePolicy')]: <FileText className="w-5 h-5 text-gray-600" />,
      [t('rules.notSuitableForInfants')]: <Baby className="w-5 h-5 text-gray-600" />,
      [t('rules.damageProtection')]: <Shield className="w-5 h-5 text-gray-600" />,
      [t('rules.fireExtinguisher')]: <FireExtinguisher className="w-5 h-5 text-gray-600" />,
      [t('rules.emergencyExit')]: <ShieldAlert className="w-5 h-5 text-gray-600" />,
      // Accessibility features icons
      [t('rules.stepFree')]: <FaWheelchair className="w-5 h-5 text-gray-600" />,
      [t('rules.elevator')]: <Building className="w-5 h-5 text-gray-600" />,
      [t('rules.parking')]: <Car className="w-5 h-5 text-gray-600" />,
      [t('rules.wideEntrance')]: <ArrowRightCircle className="w-5 h-5 text-gray-600" />,
      [t('rules.rollShower')]: <Bath className="w-5 h-5 text-gray-600" />,
      [t('rules.accessibleToilet')]: <Toilet className="w-5 h-5 text-gray-600" />
    };

    return iconMap[label] || <div className="w-5 h-5" />;
  };

  const hasSafetyFeature = (featureName) => {
    return data.safety_features && data.safety_features.includes(featureName);
  };

  const hasAccessibilityFeature = (featureName) => {
    return data.accessibility_features && data.accessibility_features[featureName] === true;
  };

  const isCancellationFlexible = () => {
    if (data.cancellation && data.cancellation.policyType === "flexible") {
      return true;
    }
    return false;
  };

  const getRefundDays = () => {
    if (data.cancellation && data.cancellation.policyDetails && data.cancellation.policyDetails.tiers) {
      const fullRefundTier = data.cancellation.policyDetails.tiers.find(tier => tier.refundPercent === 100);
      if (fullRefundTier) {
        return fullRefundTier.days;
      }
    }
    return 3; // Default value
  };

  const categories = {
    houseRules: {
      title: t('rules.houseRules'),
      items: [
        {
          label: t('rules.checkIn'),
          value: data.checkInOutTimes ?
            `${data.checkInOutTimes.checkInWindow.start} - ${data.checkInOutTimes.checkInWindow.end}` :
            t('rules.notSpecified'),
          description: t('rules.checkInDescription')
        },
        {
          label: t('rules.checkoutBefore'),
          value: data.checkInOutTimes?.checkoutTime || t('rules.notSpecified'),
          description: t('rules.checkoutDescription')
        },
        {
          label: t('rules.maximumGuests'),
          value: data.rules?.max_guests ? `${data.rules.max_guests} ${t('rules.guestsMaximum')}` : t('rules.notSpecified'),
          description: t('rules.maxGuestsDescription')
        },
        {
          label: t('rules.pets'),
          value: data.rules?.pets?.allowed ? t('rules.allowed') : t('rules.notAllowed'),
          description: t('rules.petsDescription')
        },
        {
          label: t('rules.partiesOrEvents'),
          value: data.rules?.events === "allowed" ? t('rules.allowed') : t('rules.notAllowed'),
          description: t('rules.partiesDescription')
        },
        {
          label: t('rules.smoking'),
          value: data.rules?.smoking === "allowed" ? t('rules.allowed') : t('rules.notAllowed'),
          description: t('rules.smokingDescription')
        }
      ]
    },
    safetyAndProperty: {
      title: t('rules.safetyAndProperty'),
      items: [
        {
          label: t('rules.carbonMonoxideAlarm'),
          value: hasSafetyFeature('carbon_monoxide_detector') ? t('rules.available') : t('rules.notReported'),
          description: t('rules.carbonMonoxideDescription')
        },
        {
          label: t('rules.smokeAlarm'),
          value: hasSafetyFeature('smoke_detector') ? t('rules.available') : t('rules.notReported'),
          description: t('rules.smokeAlarmDescription')
        },
        {
          label: t('rules.securityCamera'),
          value: hasSafetyFeature('security_camera') ? t('rules.available') : t('rules.noneReported'),
          description: t('rules.securityCameraDescription')
        },
        {
          label: t('rules.fireExtinguisher'),
          value: hasSafetyFeature('fire_extinguisher') ? t('rules.available') : t('rules.notAvailable'),
          description: t('rules.fireExtinguisherDescription')
        },
        {
          label: t('rules.emergencyExit'),
          value: hasSafetyFeature('emergency_exit') ? t('rules.available') : t('rules.notAvailable'),
          description: t('rules.emergencyExitDescription')
        },
        {
          label: t('rules.securityGuard'),
          value: hasSafetyFeature('security_guard') ? t('rules.available') : t('rules.notAvailable'),
          description: t('rules.securityGuardDescription')
        },
        {
          label: t('rules.firstAidKit'),
          value: hasSafetyFeature('first_aid_kit') ? t('rules.available') : t('rules.notAvailable'),
          description: t('rules.firstAidKitDescription')
        }
        

      ]
    },
    accessibility: {
      title: t('rules.title'),
      items: [
        {
          label: t('rules.stepFree'),
          value: hasAccessibilityFeature('step_free') ? t('rules.available') : t('rules.notAvailable'),
          description: t('rules.stepFreeDescription')
        },
        {
          label: t('rules.elevator'),
          value: hasAccessibilityFeature('elevator') ? t('rules.available') : t('rules.notAvailable'),
          description: t('rules.elevatorDescription')
        },
        {
          label: t('rules.parking'),
          value: hasAccessibilityFeature('parking') ? t('rules.available') : t('rules.notAvailable'),
          description: t('rules.parkingDescription')
        },
        {
          label: t('rules.wideEntrance'),
          value: hasAccessibilityFeature('wide_entrance') ? t('rules.available') : t('rules.notAvailable'),
          description: t('rules.wideEntranceDescription')
        },
        {
          label: t('rules.rollShower'),
          value: hasAccessibilityFeature('roll_shower') ? t('rules.available') : t('rules.notAvailable'),
          description: t('rules.rollShowerDescription')
        },
        {
          label: t('rules.accessibleToilet'),
          value: hasAccessibilityFeature('accessible_toilet') ? t('rules.available') : t('rules.notAvailable'),
          description: t('rules.accessibleToiletDescription')
        }
      ]
    },
    cancellation: {
      title: t('rules.cancellationPolicy'),
      items: [
        {
          label: t('rules.freeCancellationBefore'),
          value: `${getRefundDays()} ${t('rules.days')}`,
          description: t('rules.cancellationDescription')
        },
        {
          label: t('rules.reviewThePolicy'),
          value: t('rules.viewDetails'),
          description: t('rules.policyReviewDescription')
        },
        {
          label: t('rules.damageProtection'),
          value: t('rules.required'),
          description: t('rules.damageProtectionDescription')
        }
      ]
    }
  };

  return (
    <div className={`py-12 border-t  `}>
      <h2 className="text-2xl font-semibold mb-6">{t('rules.thingsToKnow')}</h2>

      <div>
        <TabSelector
          categories={categories}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isRTL={isRTL}
        />
        <PolicyCategory
          title={categories[activeTab].title}
          items={categories[activeTab].items}
          getIconFunc={getIcon}
        />
      </div>
    </div>
  );
}