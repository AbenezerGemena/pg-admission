import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { NotificationCenter } from "@/components/NotificationCenter";
import { Users, FileText, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data for colleges and departments
const collegesAndDepartments = [
  {
    college: "Engineering",
    departments: ["Computer Science", "Electrical Engineering", "Mechanical Engineering"]
  },
  {
    college: "Medicine",
    departments: ["General Medicine", "Surgery", "Pediatrics"]
  },
  {
    college: "Business",
    departments: ["Marketing", "Finance", "Management"]
  }
];

// Mock applications data
const mockApplications = [
  {
    id: 1,
    studentName: "Ahmed Hassan",
    email: "ahmed.hassan@email.com",
    gpa: 3.8,
    program: "Computer Science",
    documentsUploaded: 4,
    status: "Submitted",
    submittedAt: "2024-01-15"
  },
  {
    id: 2,
    studentName: "Sarah Ahmed",
    email: "sarah.ahmed@email.com",
    gpa: 3.9,
    program: "General Medicine",
    documentsUploaded: 5,
    status: "Submitted",
    submittedAt: "2024-01-16"
  },
  {
    id: 3,
    studentName: "Omar Khaled",
    email: "omar.khaled@email.com",
    gpa: 3.7,
    program: "Marketing",
    documentsUploaded: 3,
    status: "Submitted",
    submittedAt: "2024-01-17"
  },
  {
    id: 4,
    studentName: "Fatima Ali",
    email: "fatima.ali@email.com",
    gpa: 3.85,
    program: "Electrical Engineering",
    documentsUploaded: 4,
    status: "Assigned to Department",
    submittedAt: "2024-01-14"
  }
];

export default function PGCoordinationDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState(mockApplications);
  const [selectedDepartments, setSelectedDepartments] = useState<{[key: number]: string}>({});

  const handleLogout = () => {
    navigate("/");
  };

  const handleAssignToDepartment = (applicationId: number) => {
    const selectedDept = selectedDepartments[applicationId];
    if (!selectedDept) {
      toast({
        title: "Error",
        description: "Please select a department first",
        variant: "destructive"
      });
      return;
    }

    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { ...app, status: "Assigned to Department" }
        : app
    ));

    toast({
      title: "Success",
      description: `Application assigned to ${selectedDept} department`,
    });
  };

  const pendingApplications = applications.filter(app => app.status === "Submitted");
  const assignedApplications = applications.filter(app => app.status === "Assigned to Department");

  const stats = [
    {
      title: "Total Applications Received",
      value: applications.length.toString(),
      icon: FileText,
      trend: { value: "+12%", isPositive: true }
    },
    {
      title: "Applications Assigned",
      value: assignedApplications.length.toString(),
      icon: CheckCircle,
      trend: { value: "+5%", isPositive: true }
    },
    {
      title: "Pending Assignment",
      value: pendingApplications.length.toString(),
      icon: Clock,
      trend: { value: "-8%", isPositive: true }
    },
    {
      title: "Active Departments",
      value: collegesAndDepartments.reduce((acc, college) => acc + college.departments.length, 0).toString(),
      icon: Users,
      trend: { value: "100%", isPositive: true }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Header 
        userRole="PG Coordinator"
        userName="PG Office"
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
          {/* Applications Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">
                  Pending Applications Assignment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>GPA</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Documents</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">
                            {application.studentName}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {application.email}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              {application.gpa}
                            </Badge>
                          </TableCell>
                          <TableCell>{application.program}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {application.documentsUploaded} files
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary" 
                              className="bg-pending/10 text-pending border-pending/20"
                            >
                              {application.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Select
                                value={selectedDepartments[application.id] || ""}
                                onValueChange={(value) => 
                                  setSelectedDepartments(prev => ({
                                    ...prev,
                                    [application.id]: value
                                  }))
                                }
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                  {collegesAndDepartments.map((college) =>
                                    college.departments.map((dept) => (
                                      <SelectItem 
                                        key={`${college.college}-${dept}`} 
                                        value={`${college.college} - ${dept}`}
                                      >
                                        {college.college} - {dept}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              <Button 
                                size="sm"
                                onClick={() => handleAssignToDepartment(application.id)}
                                disabled={!selectedDepartments[application.id]}
                              >
                                Assign
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Applications */}
            {assignedApplications.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-primary">
                    Recently Assigned Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
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
                        {assignedApplications.map((application) => (
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
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Notifications Panel */}
          <div>
            <NotificationCenter 
              notifications={[
                {
                  id: "1",
                  title: "New Application Submitted",
                  message: "Ahmed Hassan submitted application for Computer Science",
                  timestamp: "2 minutes ago",
                  type: "info",
                  read: false,
                  category: "application"
                },
                {
                  id: "2",
                  title: "Application Assigned Successfully",
                  message: "Sarah Ahmed's application assigned to Medicine department",
                  timestamp: "1 hour ago",
                  type: "success",
                  read: false,
                  category: "application"
                },
                {
                  id: "3",
                  title: "Department Update",
                  message: "Engineering department updated capacity limits",
                  timestamp: "3 hours ago",
                  type: "info",
                  read: true,
                  category: "system"
                }
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
}