import { cn } from "@/lib/utils"

interface ItemCardProps {
  title: string
  subtitle?: string
  image?: string
  onClick?: () => void
  className?: string
}

export function ItemCard({
  title,
  subtitle,
  image,
  onClick,
  className
}: ItemCardProps) {
  return (
    <div className={cn("snap-start", className)}>
      <button
        onClick={onClick}
        className="block bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-[1.02] w-[168px] md:w-[196px] lg:w-[224px]"
      >
        <div className="aspect-[2/3] bg-muted">
          {image && (
            <img
              src={image}
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
