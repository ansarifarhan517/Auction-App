import React from 'react'
import { motion } from 'framer-motion'

type Props = {
  title?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export default function Card({ title, className = '', children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`bg-gradient-to-b from-surface/80 to-surface p-5 rounded-lg shadow-lg ${className}`}
    >
      {title && <div className="mb-3 text-lg font-semibold text-white">{title}</div>}
      <div>{children}</div>
    </motion.div>
  )
}
