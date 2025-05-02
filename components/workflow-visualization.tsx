"use client"
import { motion } from "framer-motion"
import type { WorkflowStatus } from "@/types/prospector"

interface WorkflowVisualizationProps {
  currentStage: string
  stageProgress: Record<string, number>
  workflowStatus: WorkflowStatus
}

export default function WorkflowVisualization({
  currentStage,
  stageProgress,
  workflowStatus,
}: WorkflowVisualizationProps) {
  const stages = [
    {
      id: "fetching_leads",
      name: "Fetching Leads",
      description: "Collecting lead data from Apify",
      icon: "📊",
    },
    {
      id: "generating_insights",
      name: "Generating Insights",
      description: "Creating personalized insights with Perplexity",
      icon: "💡",
    },
    {
      id: "drafting_emails",
      name: "Drafting Emails",
      description: "Creating personalized email drafts",
      icon: "✉️",
    },
    {
      id: "polishing_emails",
      name: "Polishing Emails",
      description: "Refining email content with DeepL",
      icon: "✨",
    },
    {
      id: "sending_emails",
      name: "Sending Emails",
      description: "Delivering emails via Arcade.dev",
      icon: "🚀",
    },
  ]

  return (
    <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 transition-all duration-300">
      <h2 className="text-lg font-medium mb-6 text-gray-100 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-emerald-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          ></path>
        </svg>
        Workflow Visualization
      </h2>

      <div className="space-y-6">
        {stages.map((stage) => {
          const isActive = currentStage === stage.id
          const isCompleted = stageProgress[stage.id] === 100
          const progress = stageProgress[stage.id] || 0

          return (
            <div key={stage.id} className="relative">
              <div className="flex items-start mb-2">
                <div
                  className={`
                flex items-center justify-center w-10 h-10 rounded-full mr-3 flex-shrink-0 transition-all duration-300
                ${
                  isActive
                    ? "bg-yellow-900/30 text-yellow-100 border-2 border-yellow-600/70 shadow-lg shadow-yellow-900/20"
                    : isCompleted
                      ? "bg-emerald-900/30 text-emerald-100 border-2 border-emerald-600/70 shadow-lg shadow-emerald-900/20"
                      : "bg-gray-700/50 text-gray-400 border border-gray-600/50"
                }
              `}
                >
                  <span className="text-lg">{stage.icon}</span>
                </div>
                <div>
                  <h3
                    className={`font-medium transition-colors duration-300 ${
                      isActive ? "text-yellow-100" : isCompleted ? "text-emerald-100" : "text-gray-300"
                    }`}
                  >
                    {stage.name}
                    {isActive && workflowStatus === "in_progress" && (
                      <span className="ml-2 inline-flex">
                        <span className="animate-pulse">.</span>
                        <span className="animate-pulse delay-150">.</span>
                        <span className="animate-pulse delay-300">.</span>
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-400">{stage.description}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="ml-5 pl-8 relative">
                <div className="w-full bg-gray-700/50 rounded-full h-1.5 mb-1 overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-1.5 rounded-full ${
                      isActive
                        ? "bg-gradient-to-r from-yellow-500 to-amber-500"
                        : isCompleted
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                          : "bg-gray-600/50"
                    }`}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{progress}%</span>
                  {isCompleted && (
                    <span className="text-emerald-400 flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Complete
                    </span>
                  )}
                </div>

                {/* Vertical connector line to next stage */}
                {stages.indexOf(stage) < stages.length - 1 && (
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-700/50 via-gray-600/30 to-gray-700/50 h-full" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
