# Outbound Sales Prospector Frontend Specification

## Overview

This document provides specifications for implementing the frontend of the Outbound Sales Prospector application using Next.js. The frontend is a single-page application that communicates with the Flask backend to trigger and display the results of the automated sales prospecting workflow.

## Backend Integration

The backend exposes the following RESTful API endpoints:

1. **Start Workflow**: `POST http://localhost:5000/start`
   - Triggers the outbound prospecting workflow
   - No request body needed
   - Returns: `{ "status": "started", "workflow_id": "..." }`

2. **Get Current State**: `GET http://localhost:5000/state`
   - Returns the current state of the workflow, all leads, and detailed progress information
   - Returns:
   ```json
   {
     "leads": [
       {
         "id": "lead1",
         "name": "Acme Corporation",
         "website": "https://acme.example.com",
         "industry": "Technology",
         "location": "San Francisco, CA",
         "insight": "Acme Corporation recently secured a $50M Series C funding round...",
         "email_content": "Subject: Quick question about Acme Corporation\n\nHi Acme Corporation,\n...",
         "status": "sent"
       },
       // more leads...
     ],
     "workflowStatus": "in_progress", // Can be "idle", "in_progress", or "completed"
     "currentStage": "generating_insights", // Current active stage: idle, fetching_leads, generating_insights, drafting_emails, polishing_emails, sending_emails, completed
     "stageProgress": {
       "fetching_leads": 100, // Percentage complete (0-100)
       "generating_insights": 60,
       "drafting_emails": 0,
       "polishing_emails": 0,
       "sending_emails": 0
     }
   }
   ```

3. **Reset Workflow**: `POST http://localhost:5000/reset`
   - Resets the workflow state for a new run
   - No request body needed
   - Returns: `{ "status": "reset" }`

## UI Components

### 1. Dashboard Page (Main Page)

Create a single page application with the following components:

#### Header Section
- **Title**: "Outbound Sales Prospector"
- **Subtitle**: "Automate your sales outreach workflow"
- **Actions**: Start and Reset buttons

#### Status Display
- Shows the current workflow status
- Visual indicator of progress (e.g., progress bar or status badge)
- Shows appropriate status messages:
  - When idle: "Ready to start"
  - When in progress: "Prospecting workflow running..."
  - When complete: "Prospecting complete!"

#### Leads Table/Cards
- Displays all leads with their details
- For each lead, show:
  - Company name
  - Industry and location
  - Generated insight (when available)
  - Email status (pending/sent)
  - Email preview button or expandable section

#### Email Preview Modal
- Popup modal to display the full email content for a lead
- Should include:
  - Subject line
  - Email body with proper formatting
  - Status indicator (drafted/sent)

### 2. Workflow Visualization Component

- Visual representation of the prospecting workflow steps with real-time progress tracking
- Highlights the current active step and shows completion percentage for each step
- A total of 5 distinct workflow steps to display:
  1. Fetching leads from Apify
  2. Generating insights with Perplexity
  3. Drafting emails
  4. Polishing emails with DeepL
  5. Sending emails with Arcade

#### Workflow Visualization Implementation

Create a dedicated `WorkflowSteps` component to visualize the workflow progress:

```tsx
// components/WorkflowSteps.tsx
import { useState, useEffect } from 'react';

const WORKFLOW_STAGES = [
  {
    id: 'fetching_leads',
    label: 'Fetching Leads',
    icon: '📊', // Replace with proper icon component
    description: 'Collecting lead data using Apify',
    detailText: 'Searching for potential sales prospects matching your criteria'
  },
  {
    id: 'generating_insights',
    label: 'Generating Insights',
    icon: '💡', // Replace with proper icon component
    description: 'Creating personalized insights with Perplexity Sonar',
    detailText: 'Researching each company to find relevant talking points'
  },
  {
    id: 'drafting_emails',
    label: 'Drafting Emails',
    icon: '✉️', // Replace with proper icon component
    description: 'Creating personalized email drafts',
    detailText: 'Crafting outreach messages based on company insights'
  },
  {
    id: 'polishing_emails',
    label: 'Polishing Content',
    icon: '✨', // Replace with proper icon component
    description: 'Refining email content with DeepL',
    detailText: 'Ensuring professional tone and error-free communication'
  },
  {
    id: 'sending_emails',
    label: 'Sending Emails',
    icon: '🚀', // Replace with proper icon component
    description: 'Delivering emails via Arcade.dev',
    detailText: 'Dispatching personalized outreach to each prospect'
  }
];

interface WorkflowStepsProps {
  currentStage: string;
  stageProgress: {
    [key: string]: number;
  };
}

export default function WorkflowSteps({ currentStage, stageProgress }: WorkflowStepsProps) {
  const calculateStatus = (stageId: string) => {
    if (currentStage === 'idle') return 'pending';
    if (currentStage === 'completed') {
      return WORKFLOW_STAGES.map(s => s.id).indexOf(stageId) >= 0 ? 'completed' : 'pending';
    }
    
    const stageIndex = WORKFLOW_STAGES.findIndex(s => s.id === stageId);
    const currentIndex = WORKFLOW_STAGES.findIndex(s => s.id === currentStage);
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex > currentIndex) return 'pending';
    return 'active';
  };

  return (
    <div className="workflow-steps">
      <h3 className="workflow-title">Workflow Progress</h3>
      
      <div className="steps-container">
        {WORKFLOW_STAGES.map((stage, index) => (
          <div key={stage.id} className="step-wrapper">
            <div className={`workflow-step ${calculateStatus(stage.id)}`}>
              <div className="step-icon">{stage.icon}</div>
              <div className="step-label">{stage.label}</div>
              <div className="step-progress">
                <div 
                  className="progress-bar"
                  style={{ width: `${stageProgress[stage.id]}%` }}
                ></div>
              </div>
            </div>
            {index < WORKFLOW_STAGES.length - 1 && (
              <div className={`connector ${calculateStatus(stage.id) === 'completed' ? 'active' : ''}`}></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Active step details */}
      {currentStage !== 'idle' && currentStage !== 'completed' && (
        <div className="active-step-details">
          <h4>
            {WORKFLOW_STAGES.find(s => s.id === currentStage)?.description || 'Processing...'}
          </h4>
          <p>
            {WORKFLOW_STAGES.find(s => s.id === currentStage)?.detailText || ''}
            {' '}({stageProgress[currentStage]}% complete)
          </p>
        </div>
      )}
    </div>
  );
}
```

#### Styling the Workflow Steps Component

Add these styles to make the workflow visualization visually appealing:

```css
/* styles/workflow-steps.css */
.workflow-steps {
  margin: 2rem 0;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.workflow-title {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  text-align: center;
}

.steps-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.step-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
}

.workflow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
}

.step-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  background-color: #e9ecef;
  transition: all 0.3s ease-in-out;
}

/* Status styles */
.workflow-step.pending .step-icon {
  background-color: #e9ecef;
  color: #6c757d;
}

.workflow-step.active .step-icon {
  background-color: #0d6efd;
  color: white;
  box-shadow: 0 0 0 5px rgba(13, 110, 253, 0.2);
  animation: pulse 1.5s infinite;
}

.workflow-step.completed .step-icon {
  background-color: #198754;
  color: white;
}

.step-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #495057;
}

.workflow-step.active .step-label {
  color: #0d6efd;
  font-weight: 600;
}

.step-progress {
  width: 100%;
  height: 6px;
  background-color: #e9ecef;
  border-radius: 3px;
  margin-top: 0.5rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #0d6efd;
  border-radius: 3px;
  transition: width 0.3s ease-in-out;
}

.workflow-step.completed .progress-bar {
  background-color: #198754;
  width: 100% !important;
}

.connector {
  flex: 1;
  height: 2px;
  background-color: #e9ecef;
  margin: 0 0.5rem;
  position: relative;
  top: -15px;
  transition: background-color 0.3s ease-in-out;
}

.connector.active {
  background-color: #198754;
}

.active-step-details {
  background-color: #fff;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 0.5rem;
  border-left: 4px solid #0d6efd;
}

.active-step-details h4 {
  color: #0d6efd;
  margin-bottom: 0.5rem;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(13, 110, 253, 0.7);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(13, 110, 253, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(13, 110, 253, 0);
  }
}

/* Responsive styling */
@media (max-width: 768px) {
  .steps-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .step-wrapper {
    width: 100%;
    margin-bottom: 1.5rem;
  }
  
  .connector {
    width: 2px;
    height: 20px;
    margin: 0.5rem 0;
    position: relative;
    left: 24px;
  }
}
```

#### Integration with Main Page

In your main page component, integrate the workflow visualization:

```tsx
// In page.tsx or wherever your main component is
import { useState, useEffect } from 'react';
import WorkflowSteps from '../components/WorkflowSteps';
import { useProspectorApi } from '../hooks/useProspectorApi';

export default function Home() {
  const [leads, setLeads] = useState([]);
  const [workflowStatus, setWorkflowStatus] = useState('idle');
  const [currentStage, setCurrentStage] = useState('idle');
  const [stageProgress, setStageProgress] = useState({
    fetching_leads: 0,
    generating_insights: 0,
    drafting_emails: 0,
    polishing_emails: 0,
    sending_emails: 0
  });
  const [isPolling, setIsPolling] = useState(false);
  
  const { startWorkflow, getState, resetWorkflow } = useProspectorApi();
  
  // Polling logic
  useEffect(() => {
    if (workflowStatus !== 'in_progress') return;
    
    setIsPolling(true);
    const interval = setInterval(async () => {
      try {
        const data = await getState();
        setLeads(data.leads);
        setWorkflowStatus(data.workflowStatus);
        setCurrentStage(data.currentStage);
        setStageProgress(data.stageProgress);
        
        if (data.workflowStatus === 'completed') {
          clearInterval(interval);
          setIsPolling(false);
        }
      } catch (error) {
        console.error('Error polling state:', error);
      }
    }, 1000); // Poll more frequently (1s) to show smooth progress updates
    
    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  }, [workflowStatus]);
  
  // Rest of your component...
  
  return (
    <div className="container">
      <Header onStart={handleStart} onReset={handleReset} />
      
      <WorkflowSteps 
        currentStage={currentStage}
        stageProgress={stageProgress}
      />
      
      <LeadsList leads={leads} />
      {/* Other components... */}
    </div>
  );
}
```

## State Management

Use React hooks (useState, useEffect) to manage the application state:

1. **Main states to track**:
   - `workflowStatus`: Overall status of the workflow (idle, in_progress, completed)
   - `leads`: Array of lead objects returned from the backend
   - `isPolling`: Whether the app is currently polling for updates
   - `selectedLead`: The currently selected lead (for email preview)

2. **Polling mechanism**:
   - Implement polling of the `/state` endpoint when the workflow is in progress
   - Recommended interval: 2 seconds
   - Start polling when workflow starts
   - Stop polling when workflow completes

## UI/UX Requirements

1. **Responsive Design**:
   - The application should work well on both desktop and mobile viewports
   - Table view should adapt to smaller screens

2. **Loading States**:
   - Show appropriate loading indicators when:
     - Starting the workflow
     - Polling for updates
     - Opening email previews

3. **Error Handling**:
   - Display user-friendly error messages if API calls fail
   - Provide retry options where appropriate

4. **Accessibility**:
   - Ensure proper contrast ratios
   - Include appropriate ARIA attributes
   - Ensure keyboard navigability

## Implementation Guidelines

1. **Component Structure**:
   ```
   app/
     page.tsx             # Main dashboard page
     components/
       Header.tsx         # App header with title and controls
       StatusDisplay.tsx  # Workflow status indicator
       LeadsList.tsx      # Table/cards of leads
       LeadItem.tsx       # Individual lead item
       EmailPreview.tsx   # Email preview modal
       WorkflowSteps.tsx  # (Optional) Workflow visualization
   ```

2. **API Integration**:
   - Create a custom hook for API calls:
   ```tsx
   // hooks/useProspectorApi.ts
   export function useProspectorApi() {
     const apiBase = 'http://localhost:5000';
     
     const startWorkflow = async () => {
       const response = await fetch(`${apiBase}/start`, { method: 'POST' });
       return response.json();
     };

     const getState = async () => {
       const response = await fetch(`${apiBase}/state`);
       return response.json();
     };

     const resetWorkflow = async () => {
       const response = await fetch(`${apiBase}/reset`, { method: 'POST' });
       return response.json();
     };

     return { startWorkflow, getState, resetWorkflow };
   }
   ```

3. **Polling Implementation**:
   ```tsx
   // Example polling code for the main page
   useEffect(() => {
     if (workflowStatus !== 'in_progress') return;
     
     const interval = setInterval(async () => {
       try {
         const data = await getState();
         setLeads(data.leads);
         setWorkflowStatus(data.workflowStatus);
         
         if (data.workflowStatus === 'completed') {
           clearInterval(interval);
         }
       } catch (error) {
         console.error('Error polling state:', error);
       }
     }, 2000);
     
     return () => clearInterval(interval);
   }, [workflowStatus]);
   ```

## UI Design Mockup

Below is a text representation of the expected layout:

```
+--------------------------------------------------------------+
|                Outbound Sales Prospector                     |
|           Automate your sales outreach workflow              |
|                                                              |
|  [Start Prospecting]                           [Reset]       |
|                                                              |
|  Status: In Progress [===========----------] 45% Complete    |
|                                                              |
|  +--------------------------------------------------------+  |
|  | Leads                                                  |  |
|  +-------------+------------+---------------+------------+  |
|  | Company     | Insight    | Email Status  | Actions    |  |
|  +-------------+------------+---------------+------------+  |
|  | Acme Corp   | Recently   | ✓ Sent        | [Preview]  |  |
|  |             | secured    |               |            |  |
|  |             | $50M...    |               |            |  |
|  +-------------+------------+---------------+------------+  |
|  | Globex      | Developed  | ✓ Sent        | [Preview]  |  |
|  | Industries  | sustainabl |               |            |  |
|  |             | process... |               |            |  |
|  +-------------+------------+---------------+------------+  |
|  | ...         | ...        | ...           | ...        |  |
|  +-------------+------------+---------------+------------+  |
|                                                              |
+--------------------------------------------------------------+
```

When the email preview button is clicked:

```
+--------------------------------------------------------------+
|  Preview Email - Acme Corporation                      [X]   |
|                                                              |
|  Subject: Quick question about Acme Corporation              |
|                                                              |
|  Hi Acme Corporation,                                        |
|                                                              |
|  I noticed that Acme Corporation recently secured a $50M     |
|  Series C funding round and is expanding its AI capabilities |
|  with a new research division. I was impressed by this and   |
|  it inspired me to reach out.                                |
|                                                              |
|  At [Your Company], we specialize in solutions that could    |
|  help your team streamline operations and boost              |
|  productivity.                                               |
|                                                              |
|  I'd love to learn more about your current challenges and    |
|  see if there might be a fit. Would you be open to a brief   |
|  conversation next week?                                     |
|                                                              |
|  Sincerely,                                                  |
|  [Your Name]                                                 |
|  [Your Company]                                              |
|                                                              |
|  -- Polished by DeepL (Simulated)                           |
|                                                              |
+--------------------------------------------------------------+
```

## Testing Guidelines

1. **Unit Testing**:
   - Test individual components using React Testing Library
   - Mock API responses for consistent testing

2. **Integration Testing**:
   - Test API integration with MSW (Mock Service Worker)
   - Ensure polling logic works correctly

3. **Manual Testing**:
   - Test the complete workflow from start to finish
   - Verify all UI states are displayed correctly
   - Test responsiveness on different screen sizes

## Getting Started

1. The backend expects to be running on `http://localhost:5000`
2. Start the Next.js development server:
   ```
   cd frontend
   npm run dev
   ```
3. Start the Flask backend with Temporal:
   ```
   cd backend
   python main.py --temporal-server
   ```
   Or if Temporal is already running:
   ```
   cd backend
   python main.py
   ```

This specification provides a comprehensive guide for implementing the frontend of the Outbound Sales Prospector application. Follow these guidelines to create a seamless, user-friendly interface that effectively demonstrates the automated sales prospecting workflow.
