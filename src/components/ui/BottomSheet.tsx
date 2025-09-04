import * as React from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export const BottomSheet = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className
}: BottomSheetProps) => {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className={cn("max-h-[90vh]", className)}>
        {(title || description) && (
          <DrawerHeader className="text-left">
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
        )}
        
        <div className="px-4 pb-4 overflow-y-auto">
          {children}
        </div>
        
        {footer && (
          <DrawerFooter className="pt-2">
            {footer}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}