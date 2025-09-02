import { useState } from "react";
import { Plus, Edit, Trash2, Calendar, Eye, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Announcement {
  id: number;
  title: string;
  description: string;
  type: 'important' | 'info' | 'warning';
  visibility: 'all' | 'college' | 'department';
  targetGroup?: string;
  status: 'draft' | 'published' | 'scheduled';
  scheduledDate?: string;
  createdDate: string;
  author: string;
  attachments: string[];
}

export function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      title: "Application Deadline Extended",
      description: "The application deadline for Fall 2024 admissions has been extended to March 15, 2024.",
      type: 'important',
      visibility: 'all',
      status: 'published',
      createdDate: "2024-01-15",
      author: "Admin User",
      attachments: []
    },
    {
      id: 2,
      title: "New Department Added",
      description: "We are pleased to announce the addition of the Data Science department.",
      type: 'info',
      visibility: 'all',
      status: 'published',
      createdDate: "2024-01-10",
      author: "Admin User",
      attachments: ["department-info.pdf"]
    },
    {
      id: 3,
      title: "System Maintenance",
      description: "Scheduled maintenance on Sunday, January 28, 2024 from 2:00 AM to 6:00 AM.",
      type: 'warning',
      visibility: 'all',
      status: 'scheduled',
      scheduledDate: "2024-01-28",
      createdDate: "2024-01-08",
      author: "Admin User",
      attachments: []
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         announcement.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || announcement.type === filterType;
    const matchesStatus = filterStatus === "all" || announcement.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateEdit = () => {
    setIsDialogOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const handleSave = (formData: any) => {
    if (editingAnnouncement) {
      setAnnouncements(prev => prev.map(a => 
        a.id === editingAnnouncement.id ? { ...a, ...formData } : a
      ));
    } else {
      const newAnnouncement: Announcement = {
        id: Date.now(),
        ...formData,
        createdDate: new Date().toISOString().split('T')[0],
        author: "Admin User",
        attachments: []
      };
      setAnnouncements(prev => [...prev, newAnnouncement]);
    }
    setIsDialogOpen(false);
    setEditingAnnouncement(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-success text-success-foreground">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'scheduled':
        return <Badge className="bg-info text-info-foreground">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'important':
        return <Badge variant="destructive">Important</Badge>;
      case 'warning':
        return <Badge className="bg-warning text-warning-foreground">Warning</Badge>;
      case 'info':
        return <Badge className="bg-info text-info-foreground">Info</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Announcement Management</h2>
          <p className="text-muted-foreground">Create and manage system announcements</p>
        </div>
        <Button onClick={handleCreateEdit} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Announcement
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>Manage all system announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search announcements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="important">Important</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnnouncements.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{announcement.title}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-xs">
                        {announcement.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(announcement.type)}</TableCell>
                  <TableCell>{getStatusBadge(announcement.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{announcement.visibility}</Badge>
                  </TableCell>
                  <TableCell>{announcement.createdDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(announcement)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(announcement.id)}
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

      <AnnouncementDialog 
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingAnnouncement(null);
        }}
        onSave={handleSave}
        announcement={editingAnnouncement}
      />
    </div>
  );
}

interface AnnouncementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  announcement?: Announcement | null;
}

function AnnouncementDialog({ isOpen, onClose, onSave, announcement }: AnnouncementDialogProps) {
  const [formData, setFormData] = useState({
    title: announcement?.title || "",
    description: announcement?.description || "",
    type: announcement?.type || "info",
    visibility: announcement?.visibility || "all",
    status: announcement?.status || "draft",
    scheduledDate: announcement?.scheduledDate || ""
  });

  const handleSubmit = () => {
    onSave(formData);
    setFormData({
      title: "",
      description: "",
      type: "info",
      visibility: "all",
      status: "draft",
      scheduledDate: ""
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {announcement ? "Edit Announcement" : "Create New Announcement"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details for your announcement
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Announcement title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Announcement description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="visibility">Visibility</Label>
              <Select value={formData.visibility} onValueChange={(value) => setFormData(prev => ({ ...prev, visibility: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="college">Specific College</SelectItem>
                  <SelectItem value="department">Specific Department</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.status === 'scheduled' && (
              <div>
                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {announcement ? "Update" : "Create"} Announcement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}