'use client'
import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface CardProps {
  children?: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Motion values for tilt effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring animations for smooth movement
  const springConfig = { damping: 25, stiffness: 700 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig)
  const scale = useSpring(isHovered ? 1.02 : 1, springConfig)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate mouse position relative to card center
    const mouseXFromCenter = event.clientX - centerX
    const mouseYFromCenter = event.clientY - centerY

    // Normalize values to -0.5 to 0.5 range
    mouseX.set(mouseXFromCenter / (rect.width / 2))
    mouseY.set(mouseYFromCenter / (rect.height / 2))
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative w-full`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      <motion.div
        className={`w-full h-full rounded-3xl backdrop-blur-lg border border-white/20 bg-gradient-to-br from-[#B5CFFF]/20 via-white/5 to-[#392BD8]/30 shadow-2xl p-4 md:p-6 ${className}`}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d'
        }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 700
        }}
      >
          {children}
      </motion.div>
    </motion.div>
  )
}
