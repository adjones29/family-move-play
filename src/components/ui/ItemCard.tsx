import { cn } from "@/lib/utils"
import { mediaUrl, type MediaRow } from "@/lib/media"

interface ItemCardProps {
  title: string
  subtitle?: string
  image?: string
  row?: MediaRow
  onClick?: () => void
  className?: string
}

export function ItemCard({
  title,
  subtitle,
  image,
  row,
  onClick,
  className
}: ItemCardProps) {
  // Use explicit image prop first, then compute from row
  const imageSrc = image || (row ? mediaUrl(row) : undefined)
  
  return (
    <div className={cn("snap-start", className)}>
      <button
        onClick={onClick}
        className="block bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-[1.02] w-[168px] md:w-[196px] lg:w-[224px]"
      >
        <div className="aspect-[2/3] bg-muted">
          {imageSrc && (
            <img
              src={imageSrc}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          )}
        </div>
      </button>
      <div className="mt-2 w-[168px] md:w-[196px] lg:w-[224px]">
        <div className="text-sm md:text-base font-semibold text-foreground leading-tight line-clamp-2">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>
        )}
      </div>
    </div>
  )
}
