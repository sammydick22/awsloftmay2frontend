import type { Lead } from "@/types/prospector"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface EmailPreviewProps {
  lead: Lead
  isOpen: boolean
  onClose: () => void
}

export default function EmailPreview({ lead, isOpen, onClose }: EmailPreviewProps) {
  // Extract subject from email_content
  const getSubject = () => {
    const subjectMatch = lead.email_content.match(/Subject: (.*?)(?:\n|$)/)
    return subjectMatch ? subjectMatch[1] : "No subject"
  }

  // Get email body without the subject line
  const getEmailBody = () => {
    const withoutSubject = lead.email_content.replace(/Subject: .*?(?:\n|$)/, "")
    return withoutSubject.trim()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-gray-800/90 backdrop-blur-sm border-gray-700/50 text-gray-100 shadow-2xl rounded-xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-gray-100 flex items-center">
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
            Preview Email - {lead.name}
          </DialogTitle>
          <DialogClose asChild>
            <button className="rounded-full p-1.5 hover:bg-gray-700 text-gray-400 hover:text-gray-100 transition-colors duration-200">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-200">Subject:</h3>
            <Badge
              className={
                lead.status === "sent"
                  ? "bg-emerald-900/30 text-emerald-100 border border-emerald-700/50 shadow-inner"
                  : "bg-yellow-900/30 text-yellow-100 border border-yellow-700/50 shadow-inner"
              }
            >
              {lead.status === "sent" ? (
                <span className="flex items-center">
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
                  Sent
                </span>
              ) : (
                <span className="flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                  </svg>
                  Drafted
                </span>
              )}
            </Badge>
          </div>

          <div className="p-4 bg-gray-700/50 backdrop-blur-sm rounded-lg font-medium text-gray-200 shadow-inner">
            {getSubject()}
          </div>

          <h3 className="font-semibold text-gray-200">Email Body:</h3>

          <div className="p-5 bg-gray-700/50 backdrop-blur-sm rounded-lg whitespace-pre-line text-gray-300 shadow-inner">
            {getEmailBody()}
          </div>

          <div className="text-xs text-gray-500 italic border-t border-gray-700/50 pt-3 flex items-center justify-end">
            <svg
              className="w-4 h-4 mr-1 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            Polished by DeepL (Simulated)
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
