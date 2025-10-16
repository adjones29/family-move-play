import React, { useMemo } from 'react'
import { useFamilyMembers } from '@/hooks/useFamilyMembers'

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
      <h4 className='text-sm font-semibold mb-3'>{title}</h4>
      <div className='flex flex-wrap gap-2'>
        {members.map(m => (
          <button 
            key={m.id} 
            onClick={() => toggle(m.id)} 
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              selected.includes(m.id) 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-background text-foreground/80 border-border hover:bg-accent'
            }`}
          >
            {m.display_name}
          </button>
        ))}
        {members.length > 1 && (
          <button 
            onClick={() => setSelected(allIds)} 
            className='px-3 py-1.5 rounded-full text-sm font-medium border border-border text-foreground/80 hover:bg-accent transition-colors'
          >
            All
          </button>
        )}
      </div>
    </section>
  )
}
