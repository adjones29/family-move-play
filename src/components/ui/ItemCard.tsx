import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ItemCardProps {
  title: string
  subtitle: string
  image?: string
  badge?: string
  badgeVariant?: "default" | "secondary" | "outline" | "destructive"
  onClick?: () => void
  className?: string
}

export function ItemCard({
  title,
  subtitle,
  image,
  badge,
  badgeVariant = "default",
  onClick,
  className
}: ItemCardProps) {
  return (
    <Card
      className={cn(
        "flex-shrink-0 w-[280px] cursor-pointer transition-all hover:scale-105 hover:shadow-lg overflow-hidden",
        className
      )}
      onClick={onClick}
    >
      {image && (
        <div className="relative h-40 bg-gradient-to-br from-primary/20 to-primary/5">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-base line-clamp-1">{title}</h3>
          {badge && (
            <Badge variant={badgeVariant} className="flex-shrink-0 text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{subtitle}</p>
      </CardContent>
    </Card>
  )
}
