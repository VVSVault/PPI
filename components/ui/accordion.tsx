'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionContextType {
  openItems: string[]
  toggleItem: (value: string) => void
  allowMultiple: boolean
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined)

const useAccordion = () => {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion component')
  }
  return context
}

interface AccordionProps {
  children: ReactNode
  allowMultiple?: boolean
  defaultOpen?: string[]
  className?: string
}

const Accordion = ({
  children,
  allowMultiple = false,
  defaultOpen = [],
  className,
}: AccordionProps) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen)

  const toggleItem = (value: string) => {
    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      )
    } else {
      setOpenItems((prev) =>
        prev.includes(value) ? [] : [value]
      )
    }
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple }}>
      <div className={cn('divide-y divide-gray-200', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  value: string
  children: ReactNode
  className?: string
}

const AccordionItem = ({ value, children, className }: AccordionItemProps) => {
  return (
    <div className={cn('py-4', className)} data-value={value}>
      {children}
    </div>
  )
}

interface AccordionTriggerProps {
  value: string
  children: ReactNode
  className?: string
}

const AccordionTrigger = ({ value, children, className }: AccordionTriggerProps) => {
  const { openItems, toggleItem } = useAccordion()
  const isOpen = openItems.includes(value)

  return (
    <button
      onClick={() => toggleItem(value)}
      className={cn(
        'flex w-full items-center justify-between text-left font-medium text-gray-900 hover:text-pink-600 transition-colors',
        className
      )}
    >
      {children}
      <ChevronDown
        className={cn(
          'h-5 w-5 text-gray-500 transition-transform duration-200',
          isOpen && 'rotate-180'
        )}
      />
    </button>
  )
}

interface AccordionContentProps {
  value: string
  children: ReactNode
  className?: string
}

const AccordionContent = ({ value, children, className }: AccordionContentProps) => {
  const { openItems } = useAccordion()
  const isOpen = openItems.includes(value)

  if (!isOpen) return null

  return (
    <div className={cn('pt-3 text-gray-600 animate-slide-up', className)}>
      {children}
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
