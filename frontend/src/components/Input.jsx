export default function Input({
    type, 
    value, 
    onChange,
    placeholder,
    className = "rounded-lg px-4 py-2 text-sm bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-gray-500",
    ...props
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            {...props}
        />
    )
}