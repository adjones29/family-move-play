import React, { useMemo, useState, useEffect } from 'react'
import ModalOverlay from '@/components/ui/ModalOverlay'
import MemberPicker from '@/components/family/MemberPicker'
import { Play, Gift, X } from 'lucide-react'
import { useFamilyMembers } from '@/hooks/useFamilyMembers'
import { useAIHeroImage } from '@/hooks/useAIHeroImage'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type OverlayKind = 'challenge' | 'game' | 'reward'
export type OverlayItem = { 
  id: string
  title: string
  description?: string
  image?: string
  difficulty?: string
  category?: string
  type?: 'Family Rewards' | 'Individual Rewards' | 'Special Rewards'
  points?: number
  cost?: number
  rarity?: string
}

type Props = { 
  open: boolean
  onClose: () => void
  kind: OverlayKind
  item: OverlayItem | null
  onPlay?: (item: OverlayItem, memberIds: string[]) => void
  onRedeem?: (item: OverlayItem, memberIds: string[]) => void
}

export default function ItemOverlay({ open, onClose, kind, item, onPlay, onRedeem }: Props) {
  const { members } = useFamilyMembers()
  const defaultIds = useMemo(() => members.map(m => m.id), [members])
  const [selected, setSelected] = useState<string[]>(defaultIds)

  // AI Hero Image generation
  const { imageUrl: aiImageUrl, isLoading: isImageLoading } = useAIHeroImage(
    item?.id || null,
    kind,
    item?.title || null,
    open && !!item
  )

  useEffect(() => {
    if (open && members.length > 0) {
      setSelected(defaultIds)
    }
  }, [open, defaultIds, members.length])

  if (!item) return null

  const showPicker = kind === 'reward' 
    ? item.type === 'Individual Rewards'
    : true

  const primaryText = kind === 'reward' ? 'Redeem Reward' : kind === 'game' ? 'Start Game' : 'Start Challenge'
  const primaryIcon = kind === 'reward' ? <Gift size={20} /> : <Play size={20} />
  const isDisabled = showPicker && selected.length === 0
  
  const onPrimary = () => {
    if (isDisabled) return
    if (kind === 'reward') {
      onRedeem?.(item, selected)
    } else {
      onPlay?.(item, selected)
    }
  }

  // Use AI image if available, fallback to item image
  const heroImage = aiImageUrl || item.image

  return (
    <ModalOverlay open={open} onClose={onClose}>
      {/* Close button */}
      <button
        onClick={onClose}
        className='absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors'
      >
        <X className='h-5 w-5 text-white' />
      </button>

      {/* AI HERO IMAGE */}
      <div className='relative w-full aspect-video min-h-[200px] max-h-[300px] bg-muted overflow-hidden'>
        {isImageLoading ? (
          // Shimmer loading state
          <div className='absolute inset-0 overflow-hidden'>
            <div className='absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse' />
            <div 
              className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent'
              style={{
                animation: 'shimmer 2s infinite',
              }}
            />
          </div>
        ) : heroImage ? (
          <img 
            src={heroImage} 
            alt={item.title} 
            className='absolute inset-0 w-full h-full object-cover'
          />
        ) : (
          // Fallback gradient background
          <div className='absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30' />
        )}
        {/* Gradient overlay for text readability */}
        <div className='absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent' />
      </div>

      {/* CONTENT */}
      <div className='px-4 md:px-6 -mt-12 pb-4 relative z-10'>
        <div className='bg-card/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-border/50 shadow-lg'>
          <h2 className='text-2xl md:text-3xl font-extrabold tracking-tight'>{item.title}</h2>
          
          {/* Badges */}
          <div className='mt-3 flex flex-wrap items-center gap-2 text-sm'>
            {kind === 'challenge' && item.difficulty && (
              <span className={cn(
                'px-2.5 py-1 rounded-full font-medium',
                item.difficulty === 'easy' && 'bg-green-500/20 text-green-600 dark:text-green-400',
                item.difficulty === 'medium' && 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
                item.difficulty === 'hard' && 'bg-red-500/20 text-red-600 dark:text-red-400'
              )}>
                {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
              </span>
            )}
            {kind === 'game' && item.category && (
              <span className='px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium capitalize'>
                {item.category}
              </span>
            )}
            {kind === 'reward' && item.type && (
              <span className='px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium'>
                {item.type}
              </span>
            )}
            {kind !== 'reward' && item.points && (
              <span className='px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20'>
                +{item.points} pts
              </span>
            )}
            {kind === 'reward' && item.cost && (
              <span className='px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold'>
                {item.cost} pts
              </span>
            )}
          </div>
          
          <p className='mt-4 text-base md:text-lg text-muted-foreground leading-relaxed'>
            {item.description || 'No description available.'}
          </p>
        </div>
      </div>

      {/* Member Picker */}
      <MemberPicker 
        selected={selected} 
        setSelected={setSelected} 
        hidden={!showPicker} 
        title={kind === 'reward' ? 'Who is redeeming?' : 'Who is participating?'} 
      />

      {/* Sticky CTA Footer */}
      <div className='sticky bottom-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border'>
        <Button 
          onClick={onPrimary} 
          disabled={isDisabled}
          size="lg"
          className={cn(
            'w-full text-base font-bold py-6 rounded-xl transition-all',
            isDisabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {primaryIcon}
          <span className='ml-2'>{primaryText}</span>
        </Button>
        {showPicker && (
          <p className='text-center text-sm text-muted-foreground mt-2'>
            {selected.length === 0 
              ? 'Select at least one participant'
              : `${selected.length} participant${selected.length > 1 ? 's' : ''} selected`
            }
          </p>
        )}
      </div>
    </ModalOverlay>
  )
}
