'use client'
 
import * as React from 'react'
import { cn } from '@/lib/utils'
 
interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}
 
export function Switch({ checked, onCheckedChange, className, ...props }: SwitchProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked)
  }
 
  return (
    <label className={cn("relative inline-flex items-center cursor-pointer", className)}>
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={checked} 
        onChange={handleChange}
        {...props}
      />
      <div className="w-11 h-6 bg-app-text/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary transition-colors duration-[var(--transition-speed)] ease-[var(--transition-easing)]"></div>
    </label>
  )
}
