export default function Icon({
    name,
    size,
    color = "CurrentColor",
    ...props
}) {
    return <svg
        width={size}
        height={size}
        fill={color}
        {...props}
        aria-hidden="true"
    >
        <use href={`/sprite.svg#icon-${name}`} />
    </svg>
}