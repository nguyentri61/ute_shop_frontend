export default function Input({ label, type = 'text', value, onChange, placeholder }) {
    return (
        <div className="mb-4">
            {label && <label className="block text-gray-700 mb-1">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        </div>
    );
}
