import React, { useMemo, useState, useEffect } from 'react'
import ModalOverlay from '@/components/ui/ModalOverlay'
import MemberPicker from '@/components/family/MemberPicker'
import { Play, Gift, X } from 'lucide-react'
import { useFamilyMembers } from '@/hooks/useFamilyMembers'
import { Button } from '@/components/ui/button'

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

  useEffect(() => {
    if (open && members.length > 0) {
      setSelected(defaultIds)
    }
  }, [open, defaultIds, members.length])

  if (!item) return null

  const showPicker = kind === 'reward' 
    ? item.type === 'Individual Rewards'
    : true

  const primaryText = kind === 'reward' ? 'Redeem' : 'Play'
  const primaryIcon = kind === 'reward' ? <Gift size={20} /> : <Play size={20} />
  
  const onPrimary = () => {
    if (kind === 'reward') {
      onRedeem?.(item, selected)
    } else {
      onPlay?.(item, selected)
    }
  }

  return (
    <ModalOverlay open={open} onClose={onClose}>
      {/* Close button */}
      <button
        onClick={onClose}
        className='absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors'
      >
        <X className='h-5 w-5 text-white' />
      </button>

      {/* HERO */}
      <div className='relative w-full h-[42vh] min-h-[260px] bg-muted'>
        {item.image ? (
          <img src={item.image} alt={item.title} className='absolute inset-0 w-full h-full object-cover' />
        ) : null}
        <div className='absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/0' />
      </div>

      {/* CONTENT */}
      <div className='px-4 md:px-6 -mt-16 pb-6 relative z-10'>
        <div className='bg-card/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-border/50'>
          <h2 className='text-2xl md:text-3xl font-extrabold tracking-tight'>{item.title}</h2>
          
          <div className='mt-3 flex flex-wrap items-center gap-2 text-sm'>
            {kind === 'challenge' && item.difficulty ? (
              <span className='px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium'>
                {item.difficulty}
              </span>
            ) : null}
            {kind === 'game' && item.category ? (
              <span className='px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium'>
                {item.category}
              </span>
            ) : null}
            {kind === 'reward' && item.type ? (
              <span className='px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium capitalize'>
                {item.type}
              </span>
            ) : null}
            {kind !== 'reward' && item.points ? (
              <span className='px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20'>
                {item.points} pts
              </span>
            ) : null}
            {kind === 'reward' && item.cost ? (
              <span className='px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20'>
                {item.cost} pts
              </span>
            ) : null}
          </div>
          
          <p className='mt-4 text-base md:text-lg text-muted-foreground leading-relaxed'>
            {item.description || 'No description available.'}
          </p>
          
          <div className='mt-6'>
            <Button 
              onClick={onPrimary} 
              size="lg"
              className='w-full md:w-auto text-base font-bold px-8 py-6 rounded-xl'
            >
              {primaryIcon}
              <span>{primaryText}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Member Picker (conditional) */}
      <MemberPicker 
        selected={selected} 
        setSelected={setSelected} 
        hidden={!showPicker} 
        title={kind === 'reward' ? 'Who is redeeming?' : 'Who is participating?'} 
      />

      {/* Bottom spacer */}
      <div className='h-4' />
    </ModalOverlay>
  )
}
