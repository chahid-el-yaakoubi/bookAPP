import { useState, useEffect } from 'react';
import { FaTrash, FaBroom, FaThermometerHalf, 
         FaLightbulb, FaDoorClosed, FaSave } from 'react-icons/fa';
import { selectProperty, UPDATE_PROPERTY } from '../../../../../../../redux/actions/propertyActions'; // Update the path as needed
import { useDispatch, useSelector } from 'react-redux';
import { updateProperty } from '../../../../../../../Lib/api';
         

const CheckoutInstructions = () => {
    const dispatch = useDispatch();
    const selectedProperty = useSelector(state => state.property.selectedProperty);
    const [isSaving, setIsSaving] = useState(false);
    
    const [standardTasks, setStandardTasks] = useState([
        {
            id: 'trash',
            title: 'Trash Disposal',
            icon: FaTrash,
            content: '',
            enabled: true
        },
        {
            id: 'cleaning',
            title: 'Basic Cleaning',
            icon: FaBroom,
            content: '',
            enabled: false
        },
        {
            id: 'thermostat',
            title: 'Thermostat Settings',
            icon: FaThermometerHalf,
            content: '',
            enabled: false
        },
        {
            id: 'lights',
            title: 'Lights & Electronics',
            icon: FaLightbulb,
            content: '',
            enabled: false
        },
        {
            id: 'lock_up',
            title: 'Lock Up Procedure',
            icon: FaDoorClosed,
            content: '',
            enabled: false
        }
    ]);
    const [additionalNotes, setAdditionalNotes] = useState('');

    // Load data from Redux store when component mounts
    useEffect(() => {
        if (selectedProperty?.checkout_instructions) {
            const savedTasks = selectedProperty.checkout_instructions.tasks || [];
            
            // Update standardTasks with saved data
            setStandardTasks(standardTasks.map(task => {
                const savedTask = savedTasks.find(saved => saved.id === task.id);
                if (savedTask) {
                    return {
                        ...task,
                        content: savedTask.content || '',
                        enabled: savedTask.enabled || false
                    };
                }
                return task;
            }));
        }
    }, [selectedProperty]);

    const toggleTask = (id) => {
        setStandardTasks(standardTasks.map(task =>
            task.id === id ? { ...task, enabled: !task.enabled } : task
        ));
    };

    const updateTaskContent = (id, content) => {
        setStandardTasks(standardTasks.map(task =>
            task.id === id ? { ...task, content } : task
        ));
    };

    const handleSave =  async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Create a simplified tasks array with only id, content, and enabled properties
        const simplifiedTasks = standardTasks.map(task => ({
            id: task.id,
            content: task?.enabled ? task.content : '',
            enabled: task.enabled
        }));
        
       
        const updatedProperty = {
            checkout_instructions: {
                tasks: simplifiedTasks,
            }
        };
        
       
        const res = await updateProperty(selectedProperty?._id, updatedProperty);

        if (res.status === 200) {
            dispatch(selectProperty(res.data));
            setIsSaving(false);

        }

    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Checkout Instructions</h2>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue transition-colors disabled:bg-blue"
                >
                    <FaSave className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
            
            <p className="text-gray-600 mb-6">
                Provide clear checkout instructions to ensure a smooth departure for your guests.
            </p>

            <div className="space-y-6"> 
                {/* Standard Tasks */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Checkout Tasks</h3>
                    {standardTasks.map(task => (
                        <div key={task.id} className="border rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between p-4 bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <task.icon className="w-5 h-5 text-gray-600" />
                                    <span className="font-medium">{task.title}</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={task.enabled}
                                        onChange={() => toggleTask(task.id)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
                                </label>
                            </div>
                            {task.enabled && (
                                <div className="p-4">
                                    <textarea
                                        value={task.content}
                                        onChange={(e) => updateTaskContent(task.id, e.target.value)}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[100px]"
                                        placeholder={`Describe ${task.title.toLowerCase()} instructions...`}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CheckoutInstructions;