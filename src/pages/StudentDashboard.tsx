import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Upload, Clock, CheckCircle, AlertCircle, Bell, Eye } from "lucide-react";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { ApplicationStatusBadge } from "@/components/ApplicationStatusBadge";
import { DocumentUpload } from "@/components/DocumentUpload";
import { ApplicationStatusTracker } from "@/components/ApplicationStatusTracker";
import { NotificationCenter } from "@/components/NotificationCenter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [applicationProgress] = useState(60); // Demo progress
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    navigate('/');
  };

  const applications = [
    {
      id: 1,
      program: "M.Tech Computer Science",
      department: "Computer Science & Engineering",
      college: "School of Engineering",
      status: 'under-review' as const,
      submittedDate: "2024-01-15",
      lastUpdate: "2024-01-20"
    },
    {
      id: 2,
      program: "M.A. English Literature",
      department: "English",
      college: "School of Humanities",
      status: 'submitted' as const,
      submittedDate: "2024-01-10",
      lastUpdate: "2024-01-10"
    }
  ];

  const documents = [
    { name: "Academic Transcripts", status: "uploaded", required: true },
    { name: "Degree Certificate", status: "uploaded", required: true },
    { name: "Identity Proof", status: "uploaded", required: true },
    { name: "Passport Photo", status: "pending", required: true },
    { name: "Statement of Purpose", status: "uploaded", required: false }
  ];

  const notifications = [
    {
      id: 1,
      title: "Application Under Review",
      message: "Your M.Tech CS application is being reviewed by the department",
      time: "2 hours ago",
      type: "info"
    },
    {
      id: 2,
      title: "Document Required",
      message: "Please upload your passport photo to complete your application",
      time: "1 day ago",
      type: "warning"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Header 
        userRole="Student" 
        userName="John Doe" 
        onLogout={handleLogout}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">Track your applications and manage your profile</p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="status">Application Status</TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Applications"
                value={2}
                icon={FileText}
                trend={{ value: "+1 this month", isPositive: true }}
              />
              <StatsCard
                title="Under Review"
                value={1}
                icon={Clock}
                className="border-warning/20"
              />
              <StatsCard
                title="Accepted"
                value={0}
                icon={CheckCircle}
                className="border-success/20"
              />
              <StatsCard
                title="Documents Pending"
                value={1}
                icon={AlertCircle}
                className="border-destructive/20"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Applications */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>My Applications</CardTitle>
                      <CardDescription>Track the status of your program applications</CardDescription>
                    </div>
                    <Button onClick={() => navigate('/student-apply')}>
                      New Application
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <div key={app.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-primary">{app.program}</h3>
                              <p className="text-sm text-muted-foreground">{app.department}</p>
                              <p className="text-xs text-muted-foreground">{app.college}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <ApplicationStatusBadge status={app.status} />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveTab("status")}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Submitted:</span> {app.submittedDate}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Last Update:</span> {app.lastUpdate}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Application Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Application Progress</CardTitle>
                    <CardDescription>Complete your profile to improve your chances</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Profile Completion</span>
                        <span className="text-sm text-muted-foreground">{applicationProgress}%</span>
                      </div>
                      <Progress value={applicationProgress} className="h-2" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <Button 
                          variant="outline" 
                          className="justify-start"
                          onClick={() => setActiveTab("documents")}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Documents
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <FileText className="mr-2 h-4 w-4" />
                          Update Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Documents Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Document Status</CardTitle>
                    <CardDescription>Required documents for your applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{doc.name}</p>
                            {doc.required && <Badge variant="outline" className="text-xs">Required</Badge>}
                          </div>
                          <Badge 
                            variant={doc.status === 'uploaded' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {doc.status === 'uploaded' ? 'Uploaded' : 'Pending'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => setActiveTab("documents")}
                    >
                      Manage Documents
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Notifications</CardTitle>
                    <CardDescription>Stay updated with your application status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notifications.slice(0, 3).map((notification) => (
                        <div key={notification.id} className="space-y-1">
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm font-medium">{notification.title}</h4>
                            <Badge 
                              variant={notification.type === 'warning' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {notification.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => setActiveTab("notifications")}
                    >
                      View All Notifications
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <DocumentUpload />
          </TabsContent>

          <TabsContent value="status" className="mt-6">
            <ApplicationStatusTracker />
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <NotificationCenter />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}