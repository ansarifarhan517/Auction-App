import React from 'react'

type Props = {
  label?: React.ReactNode
  htmlFor?: string
  className?: string
  children?: React.ReactNode
}

export default function FormField({ label, htmlFor, className = '', children }: Props) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div>{children}</div>
    </div>
  )
}
