import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Button({
  children,
  variant = 'blue',
  onClick,
  className = '',
  ...props
}) {
  const base =
    'px-4 py-2 rounded-lg text-md font-medium hover:scale-105 transition focus:outline-none cursor-pointer';

  const variants = {
    blue: 'bg-[#0B3C5D] text-white hover:bg-[#1d5377]',
    gray: 'bg-gray-300 text-[#0B3C5D] hover:bg-gray-400'
  };

  return (
    <button
      onClick={onClick}
      className={twMerge(clsx(base, variants[variant], className))}
      {...props}
    >
      {children}
    </button>
  );
}
