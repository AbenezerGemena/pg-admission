import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Building2, FileText, TrendingUp, Calendar, MessageSquare, School, UserCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { ApplicationStatusBadge } from "@/components/ApplicationStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnnouncementManagement } from "@/components/admin/AnnouncementManagement";
import { CollegeManagement } from "@/components/admin/CollegeManagement";
import { DepartmentManagement } from "@/components/admin/DepartmentManagement";
import { DepartmentManagerAssignment } from "@/components/admin/DepartmentManagerAssignment";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    navigate('/');
  };

  const systemStats = [
    { title: "Total Students", value: 1247, icon: Users, trend: { value: "+12%", isPositive: true } },
    { title: "Active Applications", value: 89, icon: FileText, trend: { value: "+5%", isPositive: true } },
    { title: "Total Colleges", value: 3, icon: School, trend: { value: "+1", isPositive: true } },
    { title: "Total Departments", value: 15, icon: Building2 },
    { title: "Assigned Managers", value: 12, icon: UserCheck, trend: { value: "+2", isPositive: true } },
    { title: "Acceptance Rate", value: "78%", icon: TrendingUp, trend: { value: "+3%", isPositive: true } }
  ];

  const recentApplications = [
    { id: 1, student: "Alice Johnson", program: "M.Tech CS", department: "CSE", status: 'submitted' as const, date: "2024-01-20" },
    { id: 2, student: "Bob Smith", program: "M.A. English", department: "English", status: 'under-review' as const, date: "2024-01-19" },
    { id: 3, student: "Carol Brown", program: "M.Sc. Physics", department: "Physics", status: 'accepted' as const, date: "2024-01-18" },
    { id: 4, student: "David Wilson", program: "M.Tech EE", department: "EEE", status: 'under-review' as const, date: "2024-01-17" }
  ];

  const departments = [
    { name: "Computer Science & Engineering", head: "Dr. John Smith", applications: 25, accepted: 18 },
    { name: "Electrical Engineering", head: "Dr. Sarah Wilson", applications: 20, accepted: 15 },
    { name: "English Literature", head: "Dr. Emily Brown", applications: 15, accepted: 12 },
    { name: "Physics", head: "Dr. Michael Davis", applications: 18, accepted: 14 },
    { name: "Mathematics", head: "Dr. Lisa Garcia", applications: 11, accepted: 8 }
  ];

  const announcements = [
    { id: 1, title: "Application Deadline Extended", date: "2024-01-15", type: "important" },
    { id: 2, title: "New Department Added", date: "2024-01-10", type: "info" },
    { id: 3, title: "System Maintenance Scheduled", date: "2024-01-08", type: "warning" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Header 
        userRole="Admin" 
        userName="Admin User" 
        onLogout={handleLogout}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and management tools</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="colleges">Colleges</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="managers">Managers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemStats.map((stat, index) => (
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
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Recent Applications */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Applications</CardTitle>
                      <CardDescription>Latest applications submitted to the system</CardDescription>
                    </div>
                    <Button variant="outline">View All</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentApplications.map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">{app.student}</h3>
                            <p className="text-sm text-muted-foreground">{app.program} - {app.department}</p>
                            <p className="text-xs text-muted-foreground">{app.date}</p>
                          </div>
                          <ApplicationStatusBadge status={app.status} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Department Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Department Overview</CardTitle>
                    <CardDescription>Applications and acceptance rates by department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {departments.map((dept, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-primary">{dept.name}</h3>
                            <Badge variant="outline">{dept.head}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Applications:</span> {dept.applications}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Accepted:</span> {dept.accepted}
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>Acceptance Rate</span>
                              <span>{Math.round((dept.accepted / dept.applications) * 100)}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 mt-1">
                              <div 
                                className="bg-success h-2 rounded-full" 
                                style={{ width: `${(dept.accepted / dept.applications) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Navigate to management sections</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab("announcements")}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Manage Announcements
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab("colleges")}
                    >
                      <School className="mr-2 h-4 w-4" />
                      Manage Colleges
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab("departments")}
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      Manage Departments
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab("managers")}
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Assign Managers
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Announcements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Announcements</CardTitle>
                    <CardDescription>Latest system announcements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {announcements.map((announcement) => (
                        <div key={announcement.id} className="space-y-1">
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm font-medium">{announcement.title}</h4>
                            <Badge 
                              variant={
                                announcement.type === 'important' ? 'destructive' :
                                announcement.type === 'warning' ? 'destructive' : 'secondary'
                              }
                              className="text-xs"
                            >
                              {announcement.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{announcement.date}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* System Health */}
                <Card>
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                    <CardDescription>Current system status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Database</span>
                        <Badge className="bg-success text-success-foreground">Online</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email Service</span>
                        <Badge className="bg-success text-success-foreground">Online</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">File Storage</span>
                        <Badge className="bg-success text-success-foreground">Online</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementManagement />
          </TabsContent>

          <TabsContent value="colleges">
            <CollegeManagement />
          </TabsContent>

          <TabsContent value="departments">
            <DepartmentManagement />
          </TabsContent>

          <TabsContent value="managers">
            <DepartmentManagerAssignment />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}