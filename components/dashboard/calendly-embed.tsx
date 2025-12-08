'use client'

import { useEffect } from 'react'

interface CalendlyEmbedProps {
  url: string
  height?: number
}

const CalendlyEmbed = ({ url, height = 630 }: CalendlyEmbedProps) => {
  useEffect(() => {
    // Load Calendly script
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div
      className="calendly-inline-widget rounded-lg overflow-hidden border border-gray-200"
      data-url={url}
      style={{ minWidth: '320px', height: `${height}px` }}
    />
  )
}

// Placeholder component for when Calendly URL is not configured
const CalendlyPlaceholder = () => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
      <div className="w-16 h-16 mx-auto bg-pink-100 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-pink-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">
        Scheduling Calendar
      </h3>
      <p className="mt-2 text-gray-500 max-w-sm mx-auto">
        Select an available date and time for your installation. The calendar
        will load shortly.
      </p>
    </div>
  )
}

export { CalendlyEmbed, CalendlyPlaceholder }
