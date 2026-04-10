export default function Input({
    type, 
    value, 
    onChange,
    placeholder,
    className = "rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 placeholder:text-gray-500",
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