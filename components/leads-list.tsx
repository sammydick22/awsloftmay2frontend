"use client"

import type { Lead } from "@/types/prospector"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Building2, MapPin, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-media-query"

interface LeadsListProps {
  leads: Lead[]
  onPreviewEmail: (lead: Lead) => void
  isLoading: boolean
}

export default function LeadsList({ leads, onPreviewEmail, isLoading }: LeadsListProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Update the empty state
  if (leads.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-12 text-center flex flex-col items-center justify-center">
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mb-4"></div>
            <p className="text-gray-400">Loading leads...</p>
          </>
        ) : (
          <>
            <svg
              className="w-16 h-16 text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              ></path>
            </svg>
            <p className="text-gray-400">No leads available. Start the prospecting workflow to generate leads.</p>
          </>
        )}
      </div>
    )
  }

  // Update the desktop view
  if (isDesktop) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-gray-800/50 border-gray-700/50">
              <TableHead className="text-gray-300">Company</TableHead>
              <TableHead className="text-gray-300">Industry & Location</TableHead>
              <TableHead className="text-gray-300">Insight</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow
                key={lead.id}
                className="hover:bg-gray-700/30 border-gray-700/50 transition-colors duration-150"
              >
                <TableCell className="font-medium text-gray-200">{lead.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="flex items-center text-sm text-gray-400">
                      <Briefcase className="h-4 w-4 mr-1" /> {lead.industry}
                    </span>
                    <span className="flex items-center text-sm text-gray-400">
                      <MapPin className="h-4 w-4 mr-1" /> {lead.location}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="truncate text-sm text-gray-300">{lead.insight}</p>
                </TableCell>
                <TableCell>
                  <StatusBadge status={lead.status} />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreviewEmail(lead)}
                    className="flex items-center border-gray-600/50 text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-all duration-200"
                  >
                    <Eye className="h-4 w-4 mr-1" /> Preview
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Update the mobile view
  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <Card
          key={lead.id}
          className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-lg flex items-center text-gray-200">
                  <Building2 className="h-4 w-4 mr-1 text-emerald-500" /> {lead.name}
                </h3>
                <div className="text-sm text-gray-400 mt-1">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" /> {lead.industry}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" /> {lead.location}
                  </div>
                </div>
              </div>
              <StatusBadge status={lead.status} />
            </div>

            <div className="mb-3">
              <h4 className="text-sm font-medium mb-1 text-gray-300">Insight:</h4>
              <p className="text-sm text-gray-400 line-clamp-2">{lead.insight}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPreviewEmail(lead)}
              className="w-full flex items-center justify-center border-gray-600/50 text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-all duration-200"
            >
              <Eye className="h-4 w-4 mr-1" /> Preview Email
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Update the StatusBadge function
function StatusBadge({ status }: { status: string }) {
  if (status === "sent") {
    return (
      <Badge className="bg-emerald-900/30 text-emerald-100 border border-emerald-700/50 shadow-inner hover:bg-emerald-900/30">
        <span className="flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
          Sent
        </span>
      </Badge>
    )
  }

  if (status === "drafted") {
    return (
      <Badge className="bg-yellow-900/30 text-yellow-100 border border-yellow-700/50 shadow-inner hover:bg-yellow-900/30">
        <span className="flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
          </svg>
          Drafted
        </span>
      </Badge>
    )
  }

  return (
    <Badge className="bg-gray-700/50 text-gray-300 border border-gray-600/50 shadow-inner hover:bg-gray-700/50">
      {status}
    </Badge>
  )
}
