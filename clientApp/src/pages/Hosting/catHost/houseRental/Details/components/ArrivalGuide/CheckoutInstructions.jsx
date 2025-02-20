import { useState } from 'react';
import { FaClock, FaKey, FaTrash, FaBroom, FaThermometerHalf, 
         FaLightbulb, FaDoorClosed, FaPlus } from 'react-icons/fa';

const CheckoutInstructions = () => {
    const [checkoutTime, setCheckoutTime] = useState('11:00');
    const [keyInstructions, setKeyInstructions] = useState('');
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
            enabled: true
        },
        {
            id: 'thermostat',
            title: 'Thermostat Settings',
            icon: FaThermometerHalf,
            content: '',
            enabled: true
        },
        {
            id: 'lights',
            title: 'Lights & Electronics',
            icon: FaLightbulb,
            content: '',
            enabled: true
        },
        {
            id: 'lock_up',
            title: 'Lock Up Procedure',
            icon: FaDoorClosed,
            content: '',
            enabled: true
        }
    ]);
    const [customTasks, setCustomTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', content: '' });
    const [additionalNotes, setAdditionalNotes] = useState('');

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

    const addCustomTask = () => {
        if (newTask.title.trim() && newTask.content.trim()) {
            setCustomTasks([...customTasks, {
                id: `custom-${Date.now()}`,
                ...newTask
            }]);
            setNewTask({ title: '', content: '' });
        }
    };

    const removeCustomTask = (id) => {
        setCustomTasks(customTasks.filter(task => task.id !== id));
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Checkout Instructions</h2>
            <p className="text-gray-600 mb-6">
                Provide clear checkout instructions to ensure a smooth departure for your guests.
            </p>

            <div className="space-y-6">
                {/* Checkout Time */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Checkout Time
                    </label>
                    <div className="relative w-full md:w-1/3">
                        <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="time"
                            value={checkoutTime}
                            onChange={(e) => setCheckoutTime(e.target.value)}
                            className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                        />
                    </div>
                </div>

                {/* Key Return Instructions */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Key Return Instructions
                    </label>
                    <div className="relative">
                        <FaKey className="absolute left-3 top-3 text-gray-400" />
                        <textarea
                            value={keyInstructions}
                            onChange={(e) => setKeyInstructions(e.target.value)}
                            className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[100px]"
                            placeholder="Explain how and where to return keys..."
                        />
                    </div>
                </div>

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
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
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

                {/* Custom Tasks */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Additional Tasks</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            placeholder="Task title"
                            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                        />
                        <button
                            onClick={addCustomTask}
                            disabled={!newTask.title.trim() || !newTask.content.trim()}
                            className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90 disabled:bg-gray-300"
                        >
                            <FaPlus className="inline-block mr-2" />
                            Add Task
                        </button>
                    </div>
                    <textarea
                        value={newTask.content}
                        onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
                        placeholder="Task instructions"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[100px]"
                    />

                    {customTasks.map(task => (
                        <div key={task.id} className="border rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between p-4 bg-gray-50">
                                <span className="font-medium">{task.title}</span>
                                <button
                                    onClick={() => removeCustomTask(task.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-600">{task.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Notes */}
                <div>
                    <h3 className="text-lg font-medium mb-3">Additional Notes</h3>
                    <textarea
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[100px]"
                        placeholder="Add any additional checkout instructions or notes..."
                    />
                </div>
            </div>
        </div>
    );
};

export default CheckoutInstructions; 