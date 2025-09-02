import { useState } from "react";
import { Plus, Edit, Trash2, Search, Building, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface College {
  id: number;
  name: string;
  description: string;
  address: string;
  logo?: string;
  departments: number;
  students: number;
  established: string;
  status: 'active' | 'inactive';
}

export function CollegeManagement() {
  const [colleges, setColleges] = useState<College[]>([
    {
      id: 1,
      name: "College of Engineering",
      description: "Premier engineering college offering undergraduate and graduate programs in various engineering disciplines.",
      address: "123 Engineering Drive, University Campus",
      departments: 8,
      students: 2500,
      established: "1985",
      status: 'active'
    },
    {
      id: 2,
      name: "College of Arts & Sciences",
      description: "Liberal arts college focusing on humanities, social sciences, and natural sciences.",
      address: "456 Arts Avenue, University Campus",
      departments: 12,
      students: 1800,
      established: "1972",
      status: 'active'
    },
    {
      id: 3,
      name: "College of Business",
      description: "AACSB accredited business school offering programs in business administration, economics, and management.",
      address: "789 Business Boulevard, University Campus",
      departments: 5,
      students: 1200,
      established: "1990",
      status: 'active'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateEdit = () => {
    setIsDialogOpen(true);
  };

  const handleEdit = (college: College) => {
    setEditingCollege(college);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setColleges(prev => prev.filter(c => c.id !== id));
  };

  const handleSave = (formData: any) => {
    if (editingCollege) {
      setColleges(prev => prev.map(c => 
        c.id === editingCollege.id ? { ...c, ...formData } : c
      ));
    } else {
      const newCollege: College = {
        id: Date.now(),
        ...formData,
        departments: 0,
        students: 0,
        status: 'active'
      };
      setColleges(prev => [...prev, newCollege]);
    }
    setIsDialogOpen(false);
    setEditingCollege(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">College Management</h2>
          <p className="text-muted-foreground">Manage colleges and their information</p>
        </div>
        <Button onClick={handleCreateEdit} className="gap-2">
          <Plus className="h-4 w-4" />
          Add College
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Colleges</CardTitle>
          <CardDescription>All colleges in the university system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search colleges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredColleges.map((college) => (
              <Card key={college.id} className="transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={college.logo} />
                        <AvatarFallback>
                          <Building className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{college.name}</CardTitle>
                        <Badge 
                          variant={college.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {college.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {college.description}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Est. {college.established}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Departments:</span>
                        <span className="ml-1 font-medium">{college.departments}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Students:</span>
                        <span className="ml-1 font-medium">{college.students}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(college)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(college.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <CollegeDialog 
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingCollege(null);
        }}
        onSave={handleSave}
        college={editingCollege}
      />
    </div>
  );
}

interface CollegeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  college?: College | null;
}

function CollegeDialog({ isOpen, onClose, onSave, college }: CollegeDialogProps) {
  const [formData, setFormData] = useState({
    name: college?.name || "",
    description: college?.description || "",
    address: college?.address || "",
    established: college?.established || ""
  });

  const handleSubmit = () => {
    onSave(formData);
    setFormData({
      name: "",
      description: "",
      address: "",
      established: ""
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {college ? "Edit College" : "Add New College"}
          </DialogTitle>
          <DialogDescription>
            Fill in the college information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">College Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter college name"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter college description"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter college address"
              rows={2}
            />
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
            {college ? "Update" : "Create"} College
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}