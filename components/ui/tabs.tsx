'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TabsContextType {
  activeTab: string
  setActiveTab: (tab: string) => void
  variant: 'default' | 'pills' | 'underline'
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

const useTabs = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component')
  }
  return context
}

interface TabsProps {
  defaultValue: string
  children: ReactNode
  variant?: 'default' | 'pills' | 'underline'
  className?: string
}

const Tabs = ({ defaultValue, children, variant = 'default', className }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: ReactNode
  className?: string
}

const TabsList = ({ children, className }: TabsListProps) => {
  const { variant } = useTabs()

  const listVariants = {
    default: 'bg-gray-100 p-1 rounded-lg',
    pills: 'space-x-2',
    underline: 'border-b border-gray-200 space-x-6',
  }

  return (
    <div className={cn('flex', listVariants[variant], className)}>
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: ReactNode
  className?: string
}

const TabsTrigger = ({ value, children, className }: TabsTriggerProps) => {
  const { activeTab, setActiveTab, variant } = useTabs()
  const isActive = activeTab === value

  const triggerVariants = {
    default: cn(
      'px-4 py-2 text-sm font-medium rounded-md transition-all',
      isActive
        ? 'bg-white text-pink-600 shadow-sm'
        : 'text-gray-600 hover:text-gray-900'
    ),
    pills: cn(
      'px-4 py-2 text-sm font-medium rounded-full transition-all',
      isActive
        ? 'bg-pink-500 text-white'
        : 'text-gray-600 hover:bg-gray-100'
    ),
    underline: cn(
      'pb-3 text-sm font-medium border-b-2 -mb-px transition-all',
      isActive
        ? 'border-pink-500 text-pink-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    ),
  }

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(triggerVariants[variant], className)}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}

const TabsContent = ({ value, children, className }: TabsContentProps) => {
  const { activeTab } = useTabs()

  if (activeTab !== value) return null

  return (
    <div className={cn('mt-4 animate-fade-in', className)}>
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
