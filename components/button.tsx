import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  children: React.ReactNode
  icon?: React.ReactNode
}

export function Button({ variant = 'primary', children, icon, className = '', ...props }: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-3 px-10 py-5 text-base rounded-full font-body font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] shadow-[0_0_0_4px_rgba(0,0,0,0.8),0_0_0_5px_rgba(255,255,255,0.1)] relative overflow-hidden'
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 via-purple-500 to-pink-400 text-white hover:shadow-[0_0_0_4px_rgba(0,0,0,0.8),0_0_0_5px_rgba(255,255,255,0.2),0_12px_40px_rgba(147,51,234,0.5)] hover:scale-[1.02] active:scale-[0.98] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none',
    secondary: 'bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 hover:bg-white/20 hover:border-white/30 shadow-[0_0_0_2px_rgba(0,0,0,0.5)]',
    outline: 'border-2 border-purple-500 text-purple-500 dark:text-purple-400 hover:bg-purple-500 hover:text-white dark:hover:text-white shadow-[0_0_0_2px_rgba(0,0,0,0.5)]',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex items-center justify-center">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  )
}

