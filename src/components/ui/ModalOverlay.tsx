import React, { useEffect } from 'react'

type Props = { 
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function ModalOverlay({ open, onClose, children }: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className='fixed inset-0 z-[70] flex items-start md:items-center justify-center bg-black/70 animate-in fade-in duration-200' role='dialog' aria-modal='true'>
      <div className='absolute inset-0' onClick={onClose} />
      <div className='relative w-full md:w-[820px] lg:w-[960px] max-h-[92vh] overflow-auto rounded-none md:rounded-2xl bg-card text-foreground shadow-2xl m-0 md:m-6 animate-in slide-in-from-bottom-4 md:slide-in-from-bottom-0 duration-300'>
        {children}
      </div>
    </div>
  )
}
