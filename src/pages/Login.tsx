import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Users, Building, Shield, FileCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { RoleCard } from "@/components/RoleCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const roles = [
  {
    id: 'student',
    title: 'Student',
    description: 'Apply for postgraduate programs and track your application status',
    icon: User,
    path: '/student-dashboard'
  },
  {
    id: 'admin',
    title: 'Admin',
    description: 'Manage system settings, users, and overall administration',
    icon: Shield,
    path: '/admin-dashboard'
  },
  {
    id: 'pg-office',
    title: 'PG Office',
    description: 'Coordinate applications between departments and registrar',
    icon: Building,
    path: '/pg-coordination-dashboard'
  },
  {
    id: 'department',
    title: 'Department',
    description: 'Review and evaluate applications for your department',
    icon: Users,
    path: '/department-dashboard'
  },
  {
    id: 'registrar',
    title: 'Registrar',
    description: 'Verify documents and provide final admission approval',
    icon: FileCheck,
    path: '/registrar-dashboard'
  }
];

export default function Login() {
  const navigate = useNavigate();
  const [showStudentOptions, setShowStudentOptions] = useState(false);

  const handleRoleSelect = (role: typeof roles[0]) => {
    if (role.id === 'student') {
      setShowStudentOptions(true);
    } else {
      // For demo purposes, navigate directly to dashboards
      navigate(role.path);
    }
  };

  const handleStudentLogin = () => {
    navigate('/student-dashboard');
  };

  const handleStudentRegister = () => {
    navigate('/student-register');
  };

  if (showStudentOptions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-2">Student Portal</h2>
              <p className="text-muted-foreground">Choose an option to continue</p>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Existing Student</CardTitle>
                  <CardDescription>
                    Already have an account? Login to check your application status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleStudentLogin}
                    className="w-full bg-gradient-to-r from-primary to-primary-light"
                  >
                    Login to Account
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>New Student</CardTitle>
                  <CardDescription>
                    First time here? Create an account to start your application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleStudentRegister}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Create New Account
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-6">
              <Button 
                variant="ghost" 
                onClick={() => setShowStudentOptions(false)}
                className="text-muted-foreground"
              >
                ← Back to Role Selection
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <Header />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            PG Admission Portal
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamlined postgraduate admission management system for students, faculty, and administrators
          </p>
        </div>
        
        {/* Role Selection */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-primary mb-8">
            Select Your Role to Continue
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {roles.map((role) => (
              <RoleCard
                key={role.id}
                title={role.title}
                description={role.description}
                icon={role.icon}
                onClick={() => handleRoleSelect(role)}
              />
            ))}
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-semibold text-primary mb-8">System Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <FileCheck className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold">Application Tracking</h4>
              <p className="text-sm text-muted-foreground">Real-time status updates and notifications</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold">Role-Based Access</h4>
              <p className="text-sm text-muted-foreground">Secure access control for different user types</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold">Multi-Department</h4>
              <p className="text-sm text-muted-foreground">Seamless coordination across departments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}