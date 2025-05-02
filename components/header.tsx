"use client"

import { Button } from "@/components/ui/button"

interface HeaderProps {
  onStart: () => void
  onReset: () => void
  isLoading: boolean
  disabled: boolean
}

export default function Header({ onStart, onReset, isLoading, disabled }: HeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600 mb-2">
            Outbound Sales Prospector
          </h1>
          <p className="text-lg text-gray-400">Automate your sales outreach workflow</p>
        </div>

        <div className="flex gap-4 mt-4 md:mt-0">
          <Button
            onClick={onStart}
            disabled={disabled}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg shadow-emerald-900/20 transition-all duration-300"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Starting...
              </div>
            ) : (
              "Start Prospecting"
            )}
          </Button>

          <Button
            onClick={onReset}
            variant="outline"
            disabled={disabled}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-all duration-300"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
