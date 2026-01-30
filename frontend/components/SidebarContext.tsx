"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  isAnimating: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // This useEffect handles all responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Always set sidebar state based on screen size
      if (mobile) {
        setIsOpen(false); // Always closed on mobile
      } else {
        setIsOpen(true); // Always open on desktop
      }
    };

    // Initial check
    handleResize();

    // Add debounced resize listener
    let resizeTimer: NodeJS.Timeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 150);
    });

    return () => {
      window.removeEventListener('resize', () => {
        clearTimeout(resizeTimer);
      });
    };
  }, []); // Empty dependency array - runs once

  // This handles the toggle animation when user clicks
  const toggleSidebar = () => {
    // On mobile, just toggle normally
    // On desktop, toggle but next resize will reset it
    setIsAnimating(true);
    setIsOpen(!isOpen);
    const animationTime = !isOpen ? 300 : 200;
    setTimeout(() => setIsAnimating(false), animationTime);
  };

  const openSidebar = () => {
    setIsAnimating(true);
    setIsOpen(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const closeSidebar = () => {
    setIsAnimating(true);
    setIsOpen(false);
    setTimeout(() => setIsAnimating(false), 200);
  };

  return (
    <SidebarContext.Provider 
      value={{ 
        isOpen, 
        isAnimating,
        isMobile,
        toggleSidebar, 
        openSidebar, 
        closeSidebar 
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}