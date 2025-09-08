export default function Input({ label, type = 'text', value, onChange, onBlur, placeholder, name }) {
    return (
        <div>
            {label && <label className="block text-gray-700 mb-1">{label}</label>}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        </div>
    );
}
