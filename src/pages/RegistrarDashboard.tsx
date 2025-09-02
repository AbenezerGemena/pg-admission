import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { NotificationCenter } from "@/components/NotificationCenter";
import { FileCheck, Shield, CheckCircle2, XCircle, Eye, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock applications data for registrar verification
const mockApplicationsForVerification = [
  {
    id: 1,
    studentName: "Ahmed Hassan",
    email: "ahmed.hassan@email.com",
    program: "Computer Science",
    gpa: 3.8,
    entranceScore: 85,
    status: "Pending Verification",
    departmentDecision: "Accepted",
    submittedAt: "2024-01-15",
    department: "Computer Science",
    documents: ["Transcript", "Certificate", "ID Copy", "Photo"]
  },
  {
    id: 2,
    studentName: "Sarah Ahmed", 
    email: "sarah.ahmed@email.com",
    program: "General Medicine",
    gpa: 3.9,
    entranceScore: 92,
    status: "Verified",
    departmentDecision: "Accepted",
    submittedAt: "2024-01-14",
    department: "General Medicine",
    documents: ["Transcript", "Certificate", "ID Copy", "Photo", "Medical Certificate"]
  },
  {
    id: 3,
    studentName: "Omar Khaled",
    email: "omar.khaled@email.com",
    program: "Marketing",
    gpa: 3.7,
    entranceScore: 78,
    status: "Final Approved",
    departmentDecision: "Accepted",
    submittedAt: "2024-01-13",
    department: "Marketing",
    documents: ["Transcript", "Certificate", "ID Copy", "Photo"]
  },
  {
    id: 4,
    studentName: "Fatima Ali",
    email: "fatima.ali@email.com",
    program: "Electrical Engineering",
    gpa: 3.85,
    entranceScore: 88,
    status: "Final Rejected",
    departmentDecision: "Accepted",
    submittedAt: "2024-01-12",
    department: "Electrical Engineering",
    documents: ["Transcript", "Certificate", "ID Copy"]
  }
];

export default function RegistrarDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState(mockApplicationsForVerification);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const handleLogout = () => {
    navigate("/");
  };

  const handleVerifyDocuments = (applicationId: number, isVerified: boolean) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { ...app, status: isVerified ? "Verified" : "Document Issues" }
        : app
    ));

    toast({
      title: isVerified ? "Documents Verified" : "Document Issues Found",
      description: isVerified 
        ? "Documents have been verified successfully" 
        : "Documents require attention",
    });
  };

  const handleFinalDecision = (applicationId: number, decision: "approve" | "reject") => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { ...app, status: decision === "approve" ? "Final Approved" : "Final Rejected" }
        : app
    ));

    toast({
      title: decision === "approve" ? "Application Approved" : "Application Rejected",
      description: `Final decision has been recorded`,
    });
  };

  const pendingVerification = applications.filter(app => app.status === "Pending Verification");
  const verified = applications.filter(app => app.status === "Verified");
  const finalApproved = applications.filter(app => app.status === "Final Approved");
  const finalRejected = applications.filter(app => app.status === "Final Rejected");

  const stats = [
    {
      title: "Pending Verification",
      value: pendingVerification.length.toString(),
      icon: FileCheck,
      trend: { value: "+3", isPositive: false }
    },
    {
      title: "Verified",
      value: verified.length.toString(),
      icon: Shield,
      trend: { value: "+2", isPositive: true }
    },
    {
      title: "Final Approved",
      value: finalApproved.length.toString(),
      icon: CheckCircle2,
      trend: { value: "+5", isPositive: true }
    },
    {
      title: "Final Rejected",
      value: finalRejected.length.toString(),
      icon: XCircle,
      trend: { value: "+1", isPositive: false }
    }
  ];

  const approvalRate = applications.length > 0 
    ? Math.round((finalApproved.length / applications.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Header 
        userRole="Registrar"
        userName="Registrar Office"
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pending">Pending ({pendingVerification.length})</TabsTrigger>
                <TabsTrigger value="verified">Verified ({verified.length})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({finalApproved.length})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({finalRejected.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary">
                      Applications Pending Verification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Program</TableHead>
                          <TableHead>GPA</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Documents</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingVerification.map((application) => (
                          <TableRow key={application.id}>
                            <TableCell className="font-medium">
                              {application.studentName}
                            </TableCell>
                            <TableCell>{application.program}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                {application.gpa}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{application.entranceScore}%</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {application.documents.length} files
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setSelectedApplication(application)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Application Details</DialogTitle>
                                    </DialogHeader>
                                    {selectedApplication && (
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <h4 className="font-medium">Student Information</h4>
                                            <p>Name: {selectedApplication.studentName}</p>
                                            <p>Email: {selectedApplication.email}</p>
                                            <p>Program: {selectedApplication.program}</p>
                                          </div>
                                          <div>
                                            <h4 className="font-medium">Academic Details</h4>
                                            <p>GPA: {selectedApplication.gpa}</p>
                                            <p>Entrance Score: {selectedApplication.entranceScore}%</p>
                                            <p>Department: {selectedApplication.department}</p>
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="font-medium mb-2">Documents</h4>
                                          <div className="grid grid-cols-2 gap-2">
                                            {selectedApplication.documents.map((doc: string, index: number) => (
                                              <div key={index} className="flex items-center gap-2 p-2 border rounded">
                                                <FileCheck className="h-4 w-4 text-primary" />
                                                <span>{doc}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-success border-success hover:bg-success/10"
                                  onClick={() => handleVerifyDocuments(application.id, true)}
                                >
                                  Verify
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-destructive border-destructive hover:bg-destructive/10"
                                  onClick={() => handleVerifyDocuments(application.id, false)}
                                >
                                  Issues
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="verified">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary">
                      Verified Applications - Final Decision Required
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Program</TableHead>
                          <TableHead>GPA</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {verified.map((application) => (
                          <TableRow key={application.id}>
                            <TableCell className="font-medium">
                              {application.studentName}
                            </TableCell>
                            <TableCell>{application.program}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                {application.gpa}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary" 
                                className="bg-success/10 text-success border-success/20"
                              >
                                {application.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm"
                                  className="bg-success hover:bg-success/90"
                                  onClick={() => handleFinalDecision(application.id, "approve")}
                                >
                                  Final Approve
                                </Button>
                                <Button 
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleFinalDecision(application.id, "reject")}
                                >
                                  Final Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="approved">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary">
                      Final Approved Applications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Program</TableHead>
                          <TableHead>GPA</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {finalApproved.map((application) => (
                          <TableRow key={application.id}>
                            <TableCell className="font-medium">
                              {application.studentName}
                            </TableCell>
                            <TableCell>{application.program}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                {application.gpa}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary" 
                                className="bg-success/10 text-success border-success/20"
                              >
                                {application.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rejected">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary">
                      Final Rejected Applications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Program</TableHead>
                          <TableHead>GPA</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {finalRejected.map((application) => (
                          <TableRow key={application.id}>
                            <TableCell className="font-medium">
                              {application.studentName}
                            </TableCell>
                            <TableCell>{application.program}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                {application.gpa}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary" 
                                className="bg-destructive/10 text-destructive border-destructive/20"
                              >
                                {application.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Reports Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">
                  Generate Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">{applications.length}</div>
                    <div className="text-sm text-muted-foreground">Total Verified</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-success">{approvalRate}%</div>
                    <div className="text-sm text-muted-foreground">Approval Rate</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-destructive">
                      {Math.round(((finalRejected.length) / applications.length) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Rejection Rate</div>
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV Report
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export PDF Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications Panel */}
          <div>
            <NotificationCenter 
              notifications={[
                {
                  id: "1",
                  title: "New Application for Verification",
                  message: "Computer Science department sent Ahmed Hassan's application",
                  timestamp: "30 minutes ago",
                  type: "info",
                  read: false,
                  category: "application"
                },
                {
                  id: "2",
                  title: "Final Decision Required",
                  message: "Sarah Ahmed's documents have been verified",
                  timestamp: "2 hours ago",
                  type: "warning",
                  read: false,
                  category: "application"
                },
                {
                  id: "3",
                  title: "Application Approved",
                  message: "Omar Khaled's application has been finally approved",
                  timestamp: "1 day ago",
                  type: "success",
                  read: true,
                  category: "application"
                }
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
}