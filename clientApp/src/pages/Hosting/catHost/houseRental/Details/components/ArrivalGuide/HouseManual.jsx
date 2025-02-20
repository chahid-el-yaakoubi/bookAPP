import { useState } from 'react';
import { FaThermometerHalf, FaTv, FaWater, FaTrash, FaPlus, 
         FaLightbulb, FaWifi, FaKey, FaUpload } from 'react-icons/fa';

const HouseManual = () => {
    const [sections, setSections] = useState([
        {
            id: 'climate',
            title: 'Climate Control',
            icon: FaThermometerHalf,
            content: '',
            expanded: true
        },
        {
            id: 'entertainment',
            title: 'Entertainment Systems',
            icon: FaTv,
            content: '',
            expanded: false
        },
        {
            id: 'utilities',
            title: 'Utilities',
            icon: FaWater,
            content: '',
            expanded: false
        },
        {
            id: 'lighting',
            title: 'Lighting',
            icon: FaLightbulb,
            content: '',
            expanded: false
        }
    ]);
    const [customSections, setCustomSections] = useState([]);
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [attachments, setAttachments] = useState([]);

    const toggleSection = (id) => {
        setSections(sections.map(section => 
            section.id === id 
                ? { ...section, expanded: !section.expanded }
                : section
        ));
    };

    const updateSectionContent = (id, content) => {
        setSections(sections.map(section =>
            section.id === id
                ? { ...section, content }
                : section
        ));
    };

    const addCustomSection = () => {
        if (newSectionTitle.trim()) {
            setCustomSections([
                ...customSections,
                {
                    id: `custom-${Date.now()}`,
                    title: newSectionTitle,
                    content: '',
                    expanded: true
                }
            ]);
            setNewSectionTitle('');
        }
    };

    const removeCustomSection = (id) => {
        setCustomSections(customSections.filter(section => section.id !== id));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const newAttachments = files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            file
        }));
        setAttachments([...attachments, ...newAttachments]);
    };

    const removeAttachment = (index) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">House Manual</h2>
            <p className="text-gray-600 mb-6">
                Create a comprehensive guide for your guests about how to use everything in your property.
            </p>

            <div className="space-y-6">
                {/* Standard Sections */}
                {sections.map(section => (
                    <div key={section.id} className="border rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50"
                        >
                            <div className="flex items-center gap-3">
                                <section.icon className="w-5 h-5 text-gray-600" />
                                <span className="font-medium">{section.title}</span>
                            </div>
                            <span>{section.expanded ? '−' : '+'}</span>
                        </button>
                        
                        {section.expanded && (
                            <div className="p-4">
                                <textarea
                                    value={section.content}
                                    onChange={(e) => updateSectionContent(section.id, e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[150px]"
                                    placeholder={`Add instructions for ${section.title.toLowerCase()}...`}
                                />
                            </div>
                        )}
                    </div>
                ))}

                {/* Custom Sections */}
                {customSections.map(section => (
                    <div key={section.id} className="border rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between p-4 bg-gray-50">
                            <span className="font-medium">{section.title}</span>
                            <button
                                onClick={() => removeCustomSection(section.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <FaTrash className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4">
                            <textarea
                                value={section.content}
                                onChange={(e) => {
                                    const updatedSections = customSections.map(s =>
                                        s.id === section.id
                                            ? { ...s, content: e.target.value }
                                            : s
                                    );
                                    setCustomSections(updatedSections);
                                }}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[150px]"
                                placeholder="Add custom instructions..."
                            />
                        </div>
                    </div>
                ))}

                {/* Add Custom Section */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newSectionTitle}
                        onChange={(e) => setNewSectionTitle(e.target.value)}
                        placeholder="New section title"
                        className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                    />
                    <button
                        onClick={addCustomSection}
                        className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90"
                    >
                        <FaPlus />
                    </button>
                </div>

                {/* Attachments */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Attachments</h3>
                    
                    <div className="flex items-center justify-center w-full">
                        <label className="w-full flex flex-col items-center justify-center px-4 py-6 bg-white text-blue rounded-lg tracking-wide uppercase border border-dashed border-gray-400 cursor-pointer hover:bg-blue/5">
                            <FaUpload className="w-8 h-8" />
                            <span className="mt-2 text-base leading-normal">Upload files</span>
                            <input
                                type="file"
                                className="hidden"
                                multiple
                                onChange={handleFileUpload}
                            />
                        </label>
                    </div>

                    {attachments.length > 0 && (
                        <div className="space-y-2">
                            {attachments.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <span className="truncate">{file.name}</span>
                                    <button
                                        onClick={() => removeAttachment(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HouseManual; 