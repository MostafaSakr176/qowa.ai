'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface GradientBorderProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'purple' | 'glow' | 'animated'
  borderWidth?: number
  borderRadius?: string
  hover?: boolean
}

export default function GradientBorder({ 
  children, 
  className = '', 
  variant = 'default',
  borderWidth = 2,
  borderRadius = 'inherit',
  hover = false
}: GradientBorderProps) {
  const baseClasses = 'relative'
  const variantClasses = {
    default: 'gradient-border',
    purple: 'gradient-border-purple',
    glow: 'gradient-border-glow',
    animated: 'gradient-border-animated'
  }

  const Component = hover ? motion.div : 'div'
  const motionProps = hover ? {
    whileHover: { scale: 1.02 },
    transition: { duration: 0.2 }
  } : {}

  return (
    <Component
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        borderRadius,
        '--border-width': `${borderWidth}px`
      } as React.CSSProperties}
      {...motionProps}
    >
      {children}
    </Component>
  )
} 