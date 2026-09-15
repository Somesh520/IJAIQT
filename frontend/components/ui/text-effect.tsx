'use client'

import { motion, Variants } from 'motion/react'
import React from 'react'
import { cn } from '@/lib/utils'

type TextEffectProps = {
  children: string
  className?: string
  delay?: number
  per?: 'word' | 'char'
}

export function TextEffect({
  children,
  className,
  delay = 0,
  per = 'word',
}: TextEffectProps) {
  const words = children.split(' ')

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      },
    },
  }

  const item: Variants = {
    hidden: { 
      opacity: 0, 
      y: 10, 
      filter: 'blur(10px)' 
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn('inline-flex flex-wrap', className)}
    >
      {words.map((word, idx) => (
        <span key={idx} className="inline-block whitespace-pre">
          {per === 'word' ? (
            <motion.span variants={item} className="inline-block">
              {word}
            </motion.span>
          ) : (
            word.split('').map((char, charIdx) => (
              <motion.span key={charIdx} variants={item} className="inline-block">
                {char}
              </motion.span>
            ))
          )}
          {idx < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </motion.div>
  )
}
