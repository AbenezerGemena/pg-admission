import { CheckCircle, Clock, AlertCircle, XCircle, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ApplicationStatus } from "@/components/ApplicationStatusBadge";

interface StatusStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending' | 'rejected';
  date?: string;
  icon: React.ElementType;
}

interface Application {
  id: number;
  program: string;
  department: string;
  college: string;
  status: ApplicationStatus;
  submittedDate: string;
  lastUpdate: string;
  currentStep: number;
  steps: StatusStep[];
}

interface ApplicationStatusTrackerProps {
  applicationId?: number;
}

export function ApplicationStatusTracker({ applicationId }: ApplicationStatusTrackerProps) {
  // Mock data - in real app, this would come from props or API
  const application: Application = {
    id: 1,
    program: "M.Tech Computer Science",
    department: "Computer Science & Engineering",
    college: "School of Engineering",
    status: 'under-review',
    submittedDate: "2024-01-15",
    lastUpdate: "2024-01-20",
    currentStep: 2,
    steps: [
      {
        id: 'submitted',
        title: 'Application Submitted',
        description: 'Your application has been successfully submitted',
        status: 'completed',
        date: '2024-01-15',
        icon: FileText
      },
      {
        id: 'pg-office',
        title: 'PG Office Review',
        description: 'Application assigned to PG Coordination Office',
        status: 'completed',
        date: '2024-01-16',
        icon: CheckCircle
      },
      {
        id: 'department',
        title: 'Department Review',
        description: 'Under review by department faculty',
        status: 'current',
        date: '2024-01-18',
        icon: Clock
      },
      {
        id: 'registrar',
        title: 'Registrar Verification',
        description: 'Final verification and approval',
        status: 'pending',
        icon: AlertCircle
      },
      {
        id: 'decision',
        title: 'Final Decision',
        description: 'Admission decision communicated',
        status: 'pending',
        icon: CheckCircle
      }
    ]
  };

  const getStatusIcon = (status: StatusStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-success" />;
      case 'current':
        return <Clock className="h-6 w-6 text-warning" />;
      case 'rejected':
        return <XCircle className="h-6 w-6 text-destructive" />;
      default:
        return <AlertCircle className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: StatusStep['status']) => {
    switch (status) {
      case 'completed':
        return 'border-success bg-success/10';
      case 'current':
        return 'border-warning bg-warning/10';
      case 'rejected':
        return 'border-destructive bg-destructive/10';
      default:
        return 'border-muted bg-muted/10';
    }
  };

  const calculateProgress = () => {
    const completedSteps = application.steps.filter(step => step.status === 'completed').length;
    return (completedSteps / application.steps.length) * 100;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
          <CardDescription>Track your application progress in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Application Details */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-primary">{application.program}</h3>
                  <p className="text-sm text-muted-foreground">{application.department}</p>
                  <p className="text-xs text-muted-foreground">{application.college}</p>
                </div>
                <Badge 
                  variant={application.status === 'accepted' ? 'default' : 
                          application.status === 'rejected' ? 'destructive' : 'secondary'}
                >
                  {application.status.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Submitted:</span> {application.submittedDate}
                </div>
                <div>
                  <span className="text-muted-foreground">Last Update:</span> {application.lastUpdate}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(calculateProgress())}%</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>

            {/* Status Timeline */}
            <div className="space-y-4">
              <h4 className="font-medium">Application Timeline</h4>
              <div className="relative">
                {application.steps.map((step, index) => {
                  const isLast = index === application.steps.length - 1;
                  
                  return (
                    <div key={step.id} className="relative flex items-start gap-4 pb-8">
                      {/* Timeline Line */}
                      {!isLast && (
                        <div className="absolute left-3 top-8 w-0.5 h-full bg-border" />
                      )}
                      
                      {/* Status Icon */}
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${getStatusColor(step.status)}`}>
                        {step.status === 'completed' && <CheckCircle className="h-4 w-4 text-success" />}
                        {step.status === 'current' && <Clock className="h-4 w-4 text-warning" />}
                        {step.status === 'rejected' && <XCircle className="h-4 w-4 text-destructive" />}
                        {step.status === 'pending' && <div className="w-2 h-2 rounded-full bg-muted-foreground" />}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">{step.title}</h5>
                          {step.date && (
                            <span className="text-xs text-muted-foreground">{step.date}</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                        
                        {step.status === 'current' && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            In Progress
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Steps */}
            {application.status === 'under-review' && (
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">What's Next?</h5>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your application is currently being reviewed by the department faculty. 
                  You will be notified via email once the review is complete. This process typically takes 3-5 business days.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}