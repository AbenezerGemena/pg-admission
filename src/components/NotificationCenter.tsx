import { useState } from "react";
import { Bell, CheckCircle, AlertCircle, Info, Trash2, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  read: boolean;
  category: 'application' | 'document' | 'system';
  actionRequired?: boolean;
}

interface NotificationCenterProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function NotificationCenter({ 
  notifications: propNotifications, 
  onMarkAsRead, 
  onDelete 
}: NotificationCenterProps) {
  const { toast } = useToast();

  // Mock notifications - in real app, this would come from props or API
  const [notifications, setNotifications] = useState<Notification[]>(propNotifications || [
    {
      id: '1',
      title: 'Application Under Review',
      message: 'Your M.Tech CS application is being reviewed by the department faculty. Expected completion: 3-5 business days.',
      type: 'info',
      timestamp: '2024-01-20T10:30:00Z',
      read: false,
      category: 'application',
      actionRequired: false
    },
    {
      id: '2',
      title: 'Document Required',
      message: 'Please upload your passport photo to complete your application. This is required for processing.',
      type: 'warning',
      timestamp: '2024-01-19T14:15:00Z',
      read: false,
      category: 'document',
      actionRequired: true
    },
    {
      id: '3',
      title: 'Application Submitted Successfully',
      message: 'Your application for M.Tech Computer Science has been submitted successfully. Reference ID: APP2024001',
      type: 'success',
      timestamp: '2024-01-15T09:00:00Z',
      read: true,
      category: 'application',
      actionRequired: false
    },
    {
      id: '4',
      title: 'System Maintenance',
      message: 'The portal will be under maintenance on January 25th from 2:00 AM to 4:00 AM. Please plan accordingly.',
      type: 'info',
      timestamp: '2024-01-18T16:00:00Z',
      read: true,
      category: 'system',
      actionRequired: false
    },
    {
      id: '5',
      title: 'Document Verified',
      message: 'Your academic transcripts have been verified by the registrar office.',
      type: 'success',
      timestamp: '2024-01-17T11:20:00Z',
      read: true,
      category: 'document',
      actionRequired: false
    }
  ]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Info className="h-4 w-4 text-info" />;
    }
  };

  const getNotificationBadge = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <Badge variant="default" className="text-xs">Success</Badge>;
      case 'warning':
        return <Badge variant="destructive" className="text-xs">Action Required</Badge>;
      case 'error':
        return <Badge variant="destructive" className="text-xs">Error</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Info</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Less than an hour ago';
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
    onMarkAsRead?.(id);
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read."
    });
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    onDelete?.(id);
    toast({
      title: "Notification deleted",
      description: "The notification has been deleted."
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read."
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = {
    all: notifications,
    unread: notifications.filter(n => !n.read),
    application: notifications.filter(n => n.category === 'application'),
    document: notifications.filter(n => n.category === 'document'),
    system: notifications.filter(n => n.category === 'system')
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
        <CardDescription>Stay updated with your application progress and important announcements</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="application">Applications</TabsTrigger>
            <TabsTrigger value="document">Documents</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {Object.entries(filteredNotifications).map(([key, notificationList]) => (
            <TabsContent key={key} value={key} className="mt-4">
              <div className="space-y-4">
                {notificationList.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No notifications in this category</p>
                  </div>
                ) : (
                  notificationList.map((notification) => (
                    <div
                      key={notification.id}
                      className={`border rounded-lg p-4 space-y-3 transition-colors ${
                        !notification.read ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{notification.title}</h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                            <div className="flex items-center gap-2">
                              {getNotificationBadge(notification.type)}
                              {notification.actionRequired && (
                                <Badge variant="outline" className="text-xs">Action Required</Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}