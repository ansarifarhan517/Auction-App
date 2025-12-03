import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export default function Button({ variant = 'primary', className = '', ...props }: Props) {
  const base = 'px-3 py-2 rounded font-semibold transition'
  const variants: Record<string,string> = {
    primary: 'bg-primary text-black',
    secondary: 'bg-accent text-black',
    ghost: 'bg-transparent text-gray-300 border border-gray-700'
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}
