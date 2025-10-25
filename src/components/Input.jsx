export default function Input({
    label,
    type = 'text',
    value,
    onChange,
    onBlur,
    placeholder,
    name,
    icon,
}) {
    return (
        <div className="relative w-full">
            {/* Label */}
            {label && (
                <label className="block text-gray-700 font-semibold mb-1">
                    {label}
                </label>
            )}

            {/* Input Wrapper */}
            <div className="relative group">
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white/70
                               focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                               transition-all duration-300 pr-11 placeholder-gray-400
                               shadow-sm hover:shadow-md"
                />

                {/* Icon (ẩn/hiện mật khẩu, hoặc icon nhập liệu) */}
                {icon && (
                    <div
                        className="absolute right-3 top-1/2 -translate-y-1/2
                                   text-gray-400 transition-all duration-300 transform
                                   group-focus-within:text-blue-500"
                    >
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}
