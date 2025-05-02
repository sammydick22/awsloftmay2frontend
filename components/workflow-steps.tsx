import type { WorkflowStatus } from "@/types/prospector"

interface WorkflowStepsProps {
  status: WorkflowStatus
  currentStep: number
}

export default function WorkflowSteps({ status, currentStep }: WorkflowStepsProps) {
  const steps = [
    { id: 1, name: "Fetching leads from Apify" },
    { id: 2, name: "Generating insights with Perplexity" },
    { id: 3, name: "Drafting emails" },
    { id: 4, name: "Polishing emails with DeepL" },
    { id: 5, name: "Sending emails with Arcade" },
  ]

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-lg font-medium mb-4">Workflow Progress</h2>

      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                step.id < currentStep
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                  : step.id === currentStep
                    ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                    : "bg-gray-100 text-gray-400 border border-gray-200"
              }`}
            >
              {step.id < currentStep ? "✓" : step.id}
            </div>
            <span
              className={`${
                step.id < currentStep
                  ? "text-emerald-700"
                  : step.id === currentStep
                    ? "text-yellow-700 font-medium"
                    : "text-gray-500"
              }`}
            >
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
