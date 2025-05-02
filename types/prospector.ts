export type WorkflowStatus = "idle" | "in_progress" | "completed"

export interface Lead {
  id: string
  name: string
  website: string
  industry: string
  location: string
  insight: string
  email_content: string
  status: string
}

export interface WorkflowState {
  leads: Lead[]
  workflowStatus: WorkflowStatus
  currentStage?: string
  stageProgress?: Record<string, number>
}
