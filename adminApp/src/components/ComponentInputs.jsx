import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const FormSection = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 border-b pb-3 mb-6 flex items-center">
            <FontAwesomeIcon icon={icon} className="mr-3" />
            {title}
        </h3>
        {children}
    </div>
);

export const InputField = ({ label, name, value, onChange, type = "text", required = false, placeholder = "" }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        {type === "textarea" ? (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
        )}
    </div>
);

export const SelectField = ({ label, name, value, onChange, options, required = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
            <option value="">Select {label}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

export const CheckboxField = ({ label, name, checked, onChange }) => (
    <label className="flex items-center space-x-3">
        <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 text-blue-600"
        />
        <span className="text-sm text-gray-700">{label}</span>
    </label>
); 