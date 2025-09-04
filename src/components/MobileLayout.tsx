import React from "react"
import { useLocation } from "react-router-dom"
import { BottomNavigation } from "./BottomNavigation"

interface MobileLayoutProps {
  children: React.ReactNode
}

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  const location = useLocation()
  const isMainRoute = ['/', '/challenges', '/games', '/rewards'].includes(location.pathname)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Safe area padding top */}
      <div className="pb-safe-area-inset-top" />
      
      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      
      {/* Bottom navigation - only show on main routes */}
      {isMainRoute && (
        <>
          {/* Safe area padding bottom */}
          <div className="pb-safe-area-inset-bottom" />
          <BottomNavigation />
        </>
      )}
    </div>
  )
}