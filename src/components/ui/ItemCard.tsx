import { cn } from "@/lib/utils"
import { mediaUrl, type MediaRow } from "@/lib/media"
import { useCardImage } from "@/hooks/useCardImage"

type ItemType = 'challenge' | 'game' | 'reward';

interface ItemCardProps {
  title: string
  subtitle?: string
  image?: string
  row?: MediaRow
  itemId?: string
  itemType?: ItemType
  onClick?: () => void
  className?: string
  enableAIImage?: boolean
}

export function ItemCard({
  title,
  subtitle,
  image,
  row,
  itemId,
  itemType,
  onClick,
  className,
  enableAIImage = true
}: ItemCardProps) {
  // Use explicit image prop first, then compute from row
  const existingImageSrc = image || (row ? mediaUrl(row) : undefined)
  
  // AI image generation (only if no existing image and itemId/type provided)
  const { imageUrl: aiImageUrl, isLoading: aiLoading } = useCardImage({
    itemId: itemId || null,
    type: itemType || null,
    title,
    existingImageUrl: existingImageSrc || null,
    enabled: enableAIImage && !existingImageSrc && !!itemId && !!itemType
  })
  
  const finalImageSrc = existingImageSrc || aiImageUrl
  
  return (
    <div className={cn("snap-start", className)}>
      <button
        onClick={onClick}
        className="block bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-[1.02] w-[168px] md:w-[196px] lg:w-[224px]"
      >
        <div className="aspect-[2/3] bg-muted relative overflow-hidden">
          {aiLoading && !finalImageSrc && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 animate-pulse">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_1.5s_infinite]" />
            </div>
          )}
          {!finalImageSrc && !aiLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-secondary/30 flex items-center justify-center">
              <span className="text-4xl opacity-50">
                {itemType === 'challenge' ? '🎯' : itemType === 'game' ? '🎮' : itemType === 'reward' ? '🎁' : '✨'}
              </span>
            </div>
          )}
          {finalImageSrc && (
            <img
              src={finalImageSrc}
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
