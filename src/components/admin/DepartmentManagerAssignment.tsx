import { useState } from "react";
import { Search, UserCheck, UserX, Users, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  department?: string;
}

interface Department {
  id: number;
  name: string;
  college: string;
  currentManager?: User;
  status: 'active' | 'inactive';
}

export function DepartmentManagerAssignment() {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 1,
      name: "Computer Science & Engineering",
      college: "College of Engineering",
      currentManager: {
        id: 1,
        name: "Dr. John Smith",
        email: "john.smith@university.edu",
        phone: "+1-555-0123",
        role: "Professor",
        department: "CSE"
      },
      status: 'active'
    },
    {
      id: 2,
      name: "Electrical Engineering",
      college: "College of Engineering",
      currentManager: {
        id: 2,
        name: "Dr. Sarah Wilson",
        email: "sarah.wilson@university.edu",
        phone: "+1-555-0124",
        role: "Associate Professor",
        department: "EEE"
      },
      status: 'active'
    },
    {
      id: 3,
      name: "English Literature",
      college: "College of Arts & Sciences",
      currentManager: {
        id: 3,
        name: "Dr. Emily Brown",
        email: "emily.brown@university.edu",
        role: "Professor",
        department: "English"
      },
      status: 'active'
    },
    {
      id: 4,
      name: "Data Science",
      college: "College of Engineering",
      status: 'active'
    }
  ]);

  const [availableUsers] = useState<User[]>([
    {
      id: 4,
      name: "Dr. Michael Davis",
      email: "michael.davis@university.edu",
      phone: "+1-555-0125",
      role: "Professor"
    },
    {
      id: 5,
      name: "Dr. Lisa Garcia",
      email: "lisa.garcia@university.edu",
      phone: "+1-555-0126",
      role: "Associate Professor"
    },
    {
      id: 6,
      name: "Dr. Robert Johnson",
      email: "robert.johnson@university.edu",
      role: "Assistant Professor"
    },
    {
      id: 7,
      name: "Dr. Amanda White",
      email: "amanda.white@university.edu",
      phone: "+1-555-0127",
      role: "Professor"
    }
  ]);

  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredDepartments = departments.filter(department => {
    const matchesSearch = department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         department.college.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "assigned" && department.currentManager) ||
                         (filterStatus === "unassigned" && !department.currentManager);
    return matchesSearch && matchesStatus;
  });

  const handleAssignManager = (department: Department) => {
    setSelectedDepartment(department);
    setIsAssignDialogOpen(true);
  };

  const handleRemoveManager = (departmentId: number) => {
    setDepartments(prev => prev.map(dept => 
      dept.id === departmentId 
        ? { ...dept, currentManager: undefined }
        : dept
    ));
  };

  const handleSaveAssignment = (userId: number) => {
    const selectedUser = availableUsers.find(user => user.id === userId);
    if (selectedUser && selectedDepartment) {
      setDepartments(prev => prev.map(dept => 
        dept.id === selectedDepartment.id 
          ? { ...dept, currentManager: selectedUser }
          : dept
      ));
    }
    setIsAssignDialogOpen(false);
    setSelectedDepartment(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Department Manager Assignment</h2>
          <p className="text-muted-foreground">Assign and manage department heads</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Departments</p>
                <p className="text-2xl font-bold">{departments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Assigned</p>
                <p className="text-2xl font-bold">
                  {departments.filter(d => d.currentManager).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Unassigned</p>
                <p className="text-2xl font-bold">
                  {departments.filter(d => !d.currentManager).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-info" />
              <div>
                <p className="text-sm text-muted-foreground">Available Users</p>
                <p className="text-2xl font-bold">{availableUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Management</CardTitle>
          <CardDescription>Assign or reassign department managers</CardDescription>
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
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Current Manager</TableHead>
                <TableHead>Contact</TableHead>
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
                      <Badge variant="outline" className="text-xs">
                        {department.college}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{department.college}</Badge>
                  </TableCell>
                  <TableCell>
                    {department.currentManager ? (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={department.currentManager.avatar} />
                          <AvatarFallback>
                            <Users className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{department.currentManager.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {department.currentManager.role}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">No manager assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {department.currentManager && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {department.currentManager.email}
                        </div>
                        {department.currentManager.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {department.currentManager.phone}
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={department.currentManager ? "default" : "destructive"}
                    >
                      {department.currentManager ? "Assigned" : "Unassigned"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAssignManager(department)}
                      >
                        {department.currentManager ? "Reassign" : "Assign"}
                      </Button>
                      {department.currentManager && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRemoveManager(department.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AssignManagerDialog 
        isOpen={isAssignDialogOpen}
        onClose={() => {
          setIsAssignDialogOpen(false);
          setSelectedDepartment(null);
        }}
        onSave={handleSaveAssignment}
        department={selectedDepartment}
        availableUsers={availableUsers}
      />
    </div>
  );
}

interface AssignManagerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: number) => void;
  department?: Department | null;
  availableUsers: User[];
}

function AssignManagerDialog({ isOpen, onClose, onSave, department, availableUsers }: AssignManagerDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.email.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSubmit = () => {
    if (selectedUserId) {
      onSave(selectedUserId);
      setSelectedUserId(null);
      setSearchValue("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Department Manager</DialogTitle>
          <DialogDescription>
            Select a user to assign as manager for {department?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Search and select user</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  {selectedUserId 
                    ? availableUsers.find(user => user.id === selectedUserId)?.name
                    : "Select user..."
                  }
                  <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Search users..." 
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup>
                      {filteredUsers.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={user.name}
                          onSelect={() => setSelectedUserId(user.id)}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>
                                <Users className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {selectedUserId && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={availableUsers.find(u => u.id === selectedUserId)?.avatar} />
                    <AvatarFallback>
                      <Users className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {availableUsers.find(u => u.id === selectedUserId)?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {availableUsers.find(u => u.id === selectedUserId)?.role}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {availableUsers.find(u => u.id === selectedUserId)?.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!selectedUserId}>
            Assign Manager
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}