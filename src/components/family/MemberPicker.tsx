import React, { useMemo } from 'react'
import { useFamilyMembers } from '@/hooks/useFamilyMembers'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type Props = { 
  selected: string[]
  setSelected: (ids: string[]) => void
  title?: string
  hidden?: boolean
}

export default function MemberPicker({ selected, setSelected, title = 'Who is participating?', hidden }: Props) {
  const { members } = useFamilyMembers()
  
  const toggle = (id: string) => {
    setSelected(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id])
  }
  
  const allIds = useMemo(() => members.map(m => m.id), [members])
  
  if (hidden) return null

  return (
    <section className='px-4 md:px-6 py-4 border-t border-border'>
      <div className='flex items-center justify-between mb-3'>
        <h4 className='text-sm font-semibold'>{title}</h4>
        {members.length > 1 && (
          <button 
            onClick={() => setSelected(selected.length === allIds.length ? [] : allIds)} 
            className='text-xs font-medium text-primary hover:underline transition-colors'
          >
            {selected.length === allIds.length ? 'Deselect All' : 'Select All'}
          </button>
        )}
      </div>
      <div className='flex flex-wrap gap-2'>
        {members.map(m => {
          const isSelected = selected.includes(m.id)
          const initials = m.display_name?.charAt(0).toUpperCase() || '?'
          
          return (
            <button 
              key={m.id} 
              onClick={() => toggle(m.id)} 
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border transition-all',
                isSelected 
                  ? 'bg-primary text-primary-foreground border-primary ring-2 ring-primary/30 shadow-sm' 
                  : 'bg-background text-foreground/80 border-border hover:bg-accent hover:border-accent'
              )}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={m.avatar_url || undefined} alt={m.display_name || 'Member'} />
                <AvatarFallback className={cn(
                  'text-xs font-semibold',
                  isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted'
                )}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span>{m.display_name}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
