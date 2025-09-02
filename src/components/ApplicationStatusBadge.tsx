import { Badge } from "@/components/ui/badge";

export type ApplicationStatus = 'submitted' | 'under-review' | 'accepted' | 'rejected' | 'pending';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const getStatusConfig = (status: ApplicationStatus) => {
    switch (status) {
      case 'submitted':
        return {
          label: 'Submitted',
          className: 'bg-pending text-pending-foreground'
        };
      case 'under-review':
        return {
          label: 'Under Review',
          className: 'bg-warning text-warning-foreground'
        };
      case 'accepted':
        return {
          label: 'Accepted',
          className: 'bg-success text-success-foreground'
        };
      case 'rejected':
        return {
          label: 'Rejected',
          className: 'bg-destructive text-destructive-foreground'
        };
      case 'pending':
        return {
          label: 'Pending',
          className: 'bg-muted text-muted-foreground'
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-muted text-muted-foreground'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
}