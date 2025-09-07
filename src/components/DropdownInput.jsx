export default function DropdownInput({ label, value, onChange, options = [] }) {
    return (
        <div>
            {label && <label className="block text-gray-700 mb-1">{label}</label>}
            <select
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                {options.map((opt, idx) => (
                    <option key={idx} value={opt.value || opt}>
                        {opt.label || opt}
                    </option>
                ))}
            </select>
        </div>
    );
}
