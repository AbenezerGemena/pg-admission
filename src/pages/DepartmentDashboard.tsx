import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Users, CheckCircle, XCircle, Clock, Eye, Download, MessageSquare, TrendingUp } from "lucide-react";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { ApplicationStatusBadge } from "@/components/ApplicationStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function DepartmentDashboard() {
  const navigate = useNavigate();
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [remarks, setRemarks] = useState<{[key: number]: string}>({});

  const handleLogout = () => {
    navigate('/');
  };

  const departmentStats = [
    { title: "Pending Review", value: 12, icon: Clock, trend: { value: "+3 from last month", isPositive: true } },
    { title: "Under Review", value: 8, icon: FileText, trend: { value: "+1 from last month", isPositive: true } },
    { title: "Accepted", value: 25, icon: CheckCircle, trend: { value: "+5 from last month", isPositive: true } },
    { title: "Rejected", value: 5, icon: XCircle, trend: { value: "-2 from last month", isPositive: false } }
  ];

  const applications = [
    {
      id: 1,
      student: "Alice Johnson",
      email: "alice.j@email.com",
      program: "M.Tech Computer Science",
      gpa: 8.5,
      status: 'submitted' as const,
      submittedDate: "2024-01-20",
      documents: ["Transcript", "Degree Certificate", "Statement of Purpose"],
      scores: { gate: 785, english: 7.5 },
      contact: { phone: "+91-9876543210", address: "123 Main St, City" },
      remarks: ""
    },
    {
      id: 2,
      student: "Bob Smith",
      email: "bob.s@email.com",
      program: "M.Tech Computer Science",
      gpa: 9.1,
      status: 'under-review' as const,
      submittedDate: "2024-01-19",
      documents: ["Transcript", "Degree Certificate", "Statement of Purpose", "Research Paper"],
      scores: { gate: 820, english: 8.0 },
      contact: { phone: "+91-9876543211", address: "456 Oak Ave, City" },
      remarks: "Strong academic background, excellent research experience"
    },
    {
      id: 3,
      student: "Carol Brown",
      email: "carol.b@email.com",
      program: "M.Tech Computer Science",
      gpa: 8.8,
      status: 'accepted' as const,
      submittedDate: "2024-01-18",
      documents: ["Transcript", "Degree Certificate", "Statement of Purpose"],
      scores: { gate: 795, english: 7.8 },
      contact: { phone: "+91-9876543212", address: "789 Pine Rd, City" },
      remarks: "Meets all admission criteria, recommended for admission"
    },
    {
      id: 4,
      student: "David Wilson",
      email: "david.w@email.com",
      program: "M.Tech Computer Science",
      gpa: 7.9,
      status: 'rejected' as const,
      submittedDate: "2024-01-17",
      documents: ["Transcript", "Degree Certificate"],
      scores: { gate: 720, english: 6.5 },
      contact: { phone: "+91-9876543213", address: "321 Elm St, City" },
      remarks: "Incomplete documentation, GPA below minimum requirement"
    }
  ];

  const handleAccept = (applicationId: number) => {
    console.log("Accepting application:", applicationId);
    // Update application status logic here
  };

  const handleReject = (applicationId: number) => {
    console.log("Rejecting application:", applicationId);
    // Update application status logic here
  };

  const handleViewDetails = (applicationId: number) => {
    setSelectedApplication(applicationId);
  };

  const handleRemarksChange = (applicationId: number, newRemarks: string) => {
    setRemarks(prev => ({ ...prev, [applicationId]: newRemarks }));
  };

  const handleMarkUnderReview = (applicationId: number) => {
    console.log("Marking application under review:", applicationId);
    // Update application status logic here
  };

  const handleDownloadDocument = (docName: string) => {
    console.log("Downloading document:", docName);
    // Simulate document download
  };

  const selectedApp = applications.find(app => app.id === selectedApplication);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Header 
        userRole="Department Head" 
        userName="Dr. John Smith" 
        onLogout={handleLogout}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Department Dashboard</h1>
          <p className="text-muted-foreground">Computer Science & Engineering Department</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {departmentStats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Applications</CardTitle>
                <CardDescription>Review and manage applications for your department</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="reviewing">Reviewing</TabsTrigger>
                    <TabsTrigger value="accepted">Accepted</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="pending" className="space-y-4 mt-4">
                    {applications.filter(app => app.status === 'submitted').map((app) => (
                      <div key={app.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-primary">{app.student}</h3>
                            <p className="text-sm text-muted-foreground">{app.email}</p>
                            <p className="text-sm">{app.program}</p>
                          </div>
                          <ApplicationStatusBadge status={app.status} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">GPA:</span> {app.gpa}
                          </div>
                          <div>
                            <span className="text-muted-foreground">GATE:</span> {app.scores.gate}
                          </div>
                          <div>
                            <span className="text-muted-foreground">English:</span> {app.scores.english}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Docs:</span> {app.documents.length}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button size="sm" variant="outline" onClick={() => handleViewDetails(app.id)}>
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>
                          <Button size="sm" onClick={() => handleMarkUnderReview(app.id)} className="bg-warning hover:bg-warning/90 text-warning-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            Review
                          </Button>
                          <Button size="sm" onClick={() => handleAccept(app.id)} className="bg-success hover:bg-success/90 text-success-foreground">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Accept
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleReject(app.id)}>
                            <XCircle className="mr-1 h-3 w-3" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="reviewing" className="space-y-4 mt-4">
                    {applications.filter(app => app.status === 'under-review').map((app) => (
                      <div key={app.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-primary">{app.student}</h3>
                            <p className="text-sm text-muted-foreground">{app.email}</p>
                            <p className="text-sm">{app.program}</p>
                          </div>
                          <ApplicationStatusBadge status={app.status} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">GPA:</span> {app.gpa}
                          </div>
                          <div>
                            <span className="text-muted-foreground">GATE:</span> {app.scores.gate}
                          </div>
                          <div>
                            <span className="text-muted-foreground">English:</span> {app.scores.english}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Docs:</span> {app.documents.length}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button size="sm" variant="outline" onClick={() => handleViewDetails(app.id)}>
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>
                          <Button size="sm" onClick={() => handleAccept(app.id)} className="bg-success hover:bg-success/90 text-success-foreground">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Accept
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleReject(app.id)}>
                            <XCircle className="mr-1 h-3 w-3" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="accepted" className="space-y-4 mt-4">
                    {applications.filter(app => app.status === 'accepted').map((app) => (
                      <div key={app.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-primary">{app.student}</h3>
                            <p className="text-sm text-muted-foreground">{app.email}</p>
                            <p className="text-sm">{app.program}</p>
                          </div>
                          <ApplicationStatusBadge status={app.status} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">GPA:</span> {app.gpa}
                          </div>
                          <div>
                            <span className="text-muted-foreground">GATE:</span> {app.scores.gate}
                          </div>
                          <div>
                            <span className="text-muted-foreground">English:</span> {app.scores.english}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Docs:</span> {app.documents.length}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewDetails(app.id)}>
                            <Eye className="mr-1 h-3 w-3" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="rejected" className="space-y-4 mt-4">
                    {applications.filter(app => app.status === 'rejected').map((app) => (
                      <div key={app.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-primary">{app.student}</h3>
                            <p className="text-sm text-muted-foreground">{app.email}</p>
                            <p className="text-sm">{app.program}</p>
                          </div>
                          <ApplicationStatusBadge status={app.status} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">GPA:</span> {app.gpa}
                          </div>
                          <div>
                            <span className="text-muted-foreground">GATE:</span> {app.scores.gate}
                          </div>
                          <div>
                            <span className="text-muted-foreground">English:</span> {app.scores.english}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Docs:</span> {app.documents.length}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewDetails(app.id)}>
                            <Eye className="mr-1 h-3 w-3" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Details */}
            {selectedApp && (
              <Card>
                <CardHeader>
                  <CardTitle>Application Details</CardTitle>
                  <CardDescription>{selectedApp.student} - {selectedApp.program}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Email:</span> {selectedApp.email}</div>
                      <div><span className="font-medium">Phone:</span> {selectedApp.contact.phone}</div>
                      <div><span className="font-medium">Address:</span> {selectedApp.contact.address}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Academic Details
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="text-sm font-medium">GPA</span>
                        <Badge variant="secondary">{selectedApp.gpa}</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="text-sm font-medium">GATE Score</span>
                        <Badge variant="secondary">{selectedApp.scores.gate}</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="text-sm font-medium">English Score</span>
                        <Badge variant="secondary">{selectedApp.scores.english}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Uploaded Documents
                    </h4>
                    <div className="space-y-2">
                      {selectedApp.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm font-medium">{doc}</span>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => handleDownloadDocument(doc)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDownloadDocument(doc)}>
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Current Status</h4>
                    <ApplicationStatusBadge status={selectedApp.status} />
                  </div>
                  
                  <div>
                    <Label htmlFor="remarks" className="font-semibold mb-3 block">
                      Remarks/Feedback
                    </Label>
                    <Textarea
                      id="remarks"
                      placeholder="Add your comments or feedback here..."
                      value={remarks[selectedApp.id] || selectedApp.remarks || ""}
                      onChange={(e) => handleRemarksChange(selectedApp.id, e.target.value)}
                      className="min-h-[100px]"
                    />
                    <Button size="sm" className="mt-2">
                      Save Remarks
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* This Month Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  This Month Statistics
                </CardTitle>
                <CardDescription>Department performance overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                    <span className="text-sm font-medium">New Applications</span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">15</div>
                      <div className="text-xs text-success">+3 from last month</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/5 rounded-lg">
                    <span className="text-sm font-medium">Processed Applications</span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-secondary-foreground">30</div>
                      <div className="text-xs text-success">+5 from last month</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                    <span className="text-sm font-medium">Acceptance Rate</span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-success">83%</div>
                      <div className="text-xs text-success">+2% from last month</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Generate Merit List
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Export Applications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}