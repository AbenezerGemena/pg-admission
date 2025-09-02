import { useState } from "react";
import { Plus, Edit, Trash2, Search, Building2, User, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Department {
  id: number;
  name: string;
  description: string;
  college: string;
  head: {
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  } | null;
  contactEmail: string;
  contactPhone: string;
  students: number;
  faculty: number;
  programs: string[];
  status: 'active' | 'inactive';
  established: string;
}

export function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 1,
      name: "Computer Science & Engineering",
      description: "Leading department in computer science, software engineering, and information technology.",
      college: "College of Engineering",
      head: {
        name: "Dr. John Smith",
        email: "john.smith@university.edu",
        phone: "+1-555-0123"
      },
      contactEmail: "cse@university.edu",
      contactPhone: "+1-555-0100",
      students: 450,
      faculty: 28,
      programs: ["B.Tech CSE", "M.Tech CSE", "PhD CSE"],
      status: 'active',
      established: "1985"
    },
    {
      id: 2,
      name: "Electrical Engineering",
      description: "Department focusing on electrical systems, electronics, and power engineering.",
      college: "College of Engineering",
      head: {
        name: "Dr. Sarah Wilson",
        email: "sarah.wilson@university.edu",
        phone: "+1-555-0124"
      },
      contactEmail: "eee@university.edu",
      contactPhone: "+1-555-0101",
      students: 320,
      faculty: 22,
      programs: ["B.Tech EEE", "M.Tech EEE"],
      status: 'active',
      established: "1987"
    },
    {
      id: 3,
      name: "English Literature",
      description: "Department dedicated to the study of English language, literature, and creative writing.",
      college: "College of Arts & Sciences",
      head: {
        name: "Dr. Emily Brown",
        email: "emily.brown@university.edu"
      },
      contactEmail: "english@university.edu",
      contactPhone: "+1-555-0102",
      students: 180,
      faculty: 15,
      programs: ["BA English", "MA English", "PhD English"],
      status: 'active',
      established: "1972"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCollege, setFilterCollege] = useState<string>("all");

  const colleges = Array.from(new Set(departments.map(d => d.college)));

  const filteredDepartments = departments.filter(department => {
    const matchesSearch = department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         department.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollege = filterCollege === "all" || department.college === filterCollege;
    return matchesSearch && matchesCollege;
  });

  const handleCreateEdit = () => {
    setIsDialogOpen(true);
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  const handleSave = (formData: any) => {
    if (editingDepartment) {
      setDepartments(prev => prev.map(d => 
        d.id === editingDepartment.id ? { ...d, ...formData } : d
      ));
    } else {
      const newDepartment: Department = {
        id: Date.now(),
        ...formData,
        students: 0,
        faculty: 0,
        programs: [],
        status: 'active'
      };
      setDepartments(prev => [...prev, newDepartment]);
    }
    setIsDialogOpen(false);
    setEditingDepartment(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Department Management</h2>
          <p className="text-muted-foreground">Manage departments across all colleges</p>
        </div>
        <Button onClick={handleCreateEdit} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
          <CardDescription>All departments in the university system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search departments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterCollege} onValueChange={setFilterCollege}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by college" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colleges</SelectItem>
                {colleges.map(college => (
                  <SelectItem key={college} value={college}>{college}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Department Head</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{department.name}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-xs">
                        {department.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{department.college}</Badge>
                  </TableCell>
                  <TableCell>
                    {department.head ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={department.head.avatar} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{department.head.name}</p>
                          <p className="text-xs text-muted-foreground">{department.head.email}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No head assigned</span>
                    )}
                  </TableCell>
                  <TableCell>{department.students}</TableCell>
                  <TableCell>{department.faculty}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={department.status === 'active' ? 'default' : 'secondary'}
                    >
                      {department.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(department)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(department.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DepartmentDialog 
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingDepartment(null);
        }}
        onSave={handleSave}
        department={editingDepartment}
        colleges={colleges}
      />
    </div>
  );
}

interface DepartmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  department?: Department | null;
  colleges: string[];
}

function DepartmentDialog({ isOpen, onClose, onSave, department, colleges }: DepartmentDialogProps) {
  const [formData, setFormData] = useState({
    name: department?.name || "",
    description: department?.description || "",
    college: department?.college || "",
    contactEmail: department?.contactEmail || "",
    contactPhone: department?.contactPhone || "",
    established: department?.established || "",
    head: department?.head || null
  });

  const handleSubmit = () => {
    onSave(formData);
    setFormData({
      name: "",
      description: "",
      college: "",
      contactEmail: "",
      contactPhone: "",
      established: "",
      head: null
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {department ? "Edit Department" : "Add New Department"}
          </DialogTitle>
          <DialogDescription>
            Fill in the department information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Department Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter department name"
              />
            </div>
            <div>
              <Label htmlFor="college">College</Label>
              <Select value={formData.college} onValueChange={(value) => setFormData(prev => ({ ...prev, college: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select college" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map(college => (
                    <SelectItem key={college} value={college}>{college}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter department description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="department@university.edu"
              />
            </div>
            <div>
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                placeholder="+1-555-0100"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="established">Established Year</Label>
            <Input
              id="established"
              value={formData.established}
              onChange={(e) => setFormData(prev => ({ ...prev, established: e.target.value }))}
              placeholder="e.g., 1985"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {department ? "Update" : "Create"} Department
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}