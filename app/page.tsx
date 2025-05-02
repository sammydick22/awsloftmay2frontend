"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import StatusDisplay from "@/components/status-display"
import LeadsList from "@/components/leads-list"
import EmailPreview from "@/components/email-preview"
import WorkflowVisualization from "@/components/workflow-visualization"
import { useProspectorApi } from "@/hooks/use-prospector-api"
import type { Lead, WorkflowStatus } from "@/types/prospector"

export default function Dashboard() {
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>("idle")
  const [leads, setLeads] = useState<Lead[]>([])
  const [isPolling, setIsPolling] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStage, setCurrentStage] = useState<string>("fetching_leads")
  const [stageProgress, setStageProgress] = useState<Record<string, number>>({
    fetching_leads: 0,
    generating_insights: 0,
    drafting_emails: 0,
    polishing_emails: 0,
    sending_emails: 0,
  })

  const { startWorkflow, getState, resetWorkflow } = useProspectorApi()

  // Polling mechanism
  useEffect(() => {
    if (workflowStatus !== "in_progress") return

    setIsPolling(true)
    const interval = setInterval(async () => {
      try {
        const data = await getState()
        setLeads(data.leads)
        setWorkflowStatus(data.workflowStatus)

        // Update workflow visualization data
        if (data.currentStage) {
          setCurrentStage(data.currentStage)
        }

        if (data.stageProgress) {
          setStageProgress(data.stageProgress)
        }

        if (data.workflowStatus === "completed") {
          setIsPolling(false)
          clearInterval(interval)
        }
      } catch (error) {
        console.error("Error polling state:", error)
        setError("Failed to update workflow status. Please try again.")
        setIsPolling(false)
        clearInterval(interval)
      }
    }, 2000)

    return () => {
      clearInterval(interval)
      setIsPolling(false)
    }
  }, [workflowStatus, getState])

  const handleStartWorkflow = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await startWorkflow()
      setWorkflowStatus("in_progress")

      // Initial state fetch
      const stateData = await getState()
      setLeads(stateData.leads)

      // Initialize workflow visualization data
      if (stateData.currentStage) {
        setCurrentStage(stateData.currentStage)
      }

      if (stateData.stageProgress) {
        setStageProgress(stateData.stageProgress)
      }
    } catch (error) {
      console.error("Error starting workflow:", error)
      setError("Failed to start the workflow. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetWorkflow = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await resetWorkflow()
      setWorkflowStatus("idle")
      setLeads([])
      // Reset workflow visualization data
      setCurrentStage("fetching_leads")
      setStageProgress({
        fetching_leads: 0,
        generating_insights: 0,
        drafting_emails: 0,
        polishing_emails: 0,
        sending_emails: 0,
      })
    } catch (error) {
      console.error("Error resetting workflow:", error)
      setError("Failed to reset the workflow. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreviewEmail = (lead: Lead) => {
    setSelectedLead(lead)
    setIsEmailPreviewOpen(true)
  }

  const closeEmailPreview = () => {
    setIsEmailPreviewOpen(false)
    setSelectedLead(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <Header
          onStart={handleStartWorkflow}
          onReset={handleResetWorkflow}
          isLoading={isLoading}
          disabled={isLoading || isPolling}
        />

        {error && (
          <div
            className="bg-red-900/30 backdrop-blur-sm border border-red-700/50 text-red-100 px-4 py-3 rounded-xl relative mb-6 shadow-lg"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StatusDisplay
              status={workflowStatus}
              isPolling={isPolling}
              leadsCount={leads.length}
              completedLeadsCount={leads.filter((lead) => lead.status === "sent").length}
            />

            <LeadsList leads={leads} onPreviewEmail={handlePreviewEmail} isLoading={isLoading || isPolling} />
          </div>

          <div className="space-y-6">
            <WorkflowVisualization
              currentStage={currentStage}
              stageProgress={stageProgress}
              workflowStatus={workflowStatus}
            />
          </div>
        </div>

        {isEmailPreviewOpen && selectedLead && (
          <EmailPreview lead={selectedLead} isOpen={isEmailPreviewOpen} onClose={closeEmailPreview} />
        )}
      </div>
    </main>
  )
}
