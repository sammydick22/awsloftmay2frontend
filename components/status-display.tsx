import type { WorkflowStatus } from "@/types/prospector"

interface StatusDisplayProps {
  status: WorkflowStatus
  isPolling: boolean
  leadsCount: number
  completedLeadsCount: number
}

export default function StatusDisplay({ status, isPolling, leadsCount, completedLeadsCount }: StatusDisplayProps) {
  const getStatusMessage = () => {
    switch (status) {
      case "idle":
        return "Ready to start"
      case "in_progress":
        return "Prospecting workflow running..."
      case "completed":
        return "Prospecting complete!"
      default:
        return "Unknown status"
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "idle":
        return "bg-gray-700 text-gray-300"
      case "in_progress":
        return "bg-yellow-700/50 text-yellow-100"
      case "completed":
        return "bg-emerald-700/50 text-emerald-100"
      default:
        return "bg-gray-700 text-gray-300"
    }
  }

  const calculateProgress = () => {
    if (leadsCount === 0) return 0
    return Math.round((completedLeadsCount / leadsCount) * 100)
  }

  const progress = calculateProgress()

  return (
    <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="font-medium mr-2 text-gray-300">Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm ${getStatusColor()} shadow-inner transition-colors duration-300`}
          >
            {getStatusMessage()}
          </span>
        </div>

        {isPolling && (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500 mr-2"></div>
            <span className="text-sm text-gray-400">Updating...</span>
          </div>
        )}
      </div>

      {status !== "idle" && (
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-300">Progress</span>
            <span className="text-sm font-medium text-gray-300">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-600 to-teal-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-400 flex items-center justify-between">
            <span>
              {completedLeadsCount} of {leadsCount} leads processed
            </span>
            {progress === 100 && (
              <span className="text-emerald-400 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Complete
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
