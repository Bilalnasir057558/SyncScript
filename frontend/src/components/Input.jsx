export default function Input({
    type,
    value,
    onChange,
    placeholder,
    prefix,
    className = "rounded-lg px-4 py-2 text-sm bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-gray-500",
    ...props
}) {
    const inputClassName = prefix
        ? className.replace(/px-\d+/, 'pl-2 pr-4') // Reduce left padding when prefix is present
        : className;

    if (prefix) {
        return (
            <div className={`${className} flex items-center`}>
                <div className="flex-shrink-0 mr-2">
                    {prefix}
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={inputClassName}
                    {...props}
                />
            </div>
        );
    }

    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            {...props}
        />
    );
}