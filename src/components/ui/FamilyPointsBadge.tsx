import { useFamilyPoints, formatPts } from '@/lib/points';
import { Badge } from '@/components/ui/badge';

type Props = { 
  familyId: string | undefined; 
  className?: string;
};

export default function FamilyPointsBadge({ familyId, className }: Props) {
  const { points, loading } = useFamilyPoints(familyId);
  
  if (!familyId) {
    return (
      <Badge className={`bg-primary/20 text-primary border-primary/30 text-xs ${className ?? ''}`}>
        0 pts
      </Badge>
    );
  }

  return (
    <Badge className={`bg-primary/20 text-primary border-primary/30 text-xs ${className ?? ''}`}>
      {loading ? '...' : formatPts(points)}
    </Badge>
  );
}
