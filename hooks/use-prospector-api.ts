import type { WorkflowState } from "@/types/prospector"

export function useProspectorApi() {
  const apiBase = "http://localhost:8000"  // Updated to use port 8000 instead of 5000

  const startWorkflow = async () => {
    const response = await fetch(`${apiBase}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to start workflow: ${response.status}`)
    }

    return response.json()
  }

  const getState = async (): Promise<WorkflowState> => {
    const response = await fetch(`${apiBase}/state`)

    if (!response.ok) {
      throw new Error(`Failed to get state: ${response.status}`)
    }

    return response.json()
  }

  const resetWorkflow = async () => {
    const response = await fetch(`${apiBase}/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to reset workflow: ${response.status}`)
    }

    return response.json()
  }

  return { startWorkflow, getState, resetWorkflow }
}
