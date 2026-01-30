"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  PieChart,
  Layers,
  Database,
  ChevronDown,
  HelpCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSidebar } from "../SidebarContext";

interface MenuSection {
  title: string;
  icon: React.ReactNode;
  items: {
    label: string;
    href: string;
    badge?: string;
  }[];
}

const menuSections: MenuSection[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    items: [
      { label: "Dashboard", href: "/" },
    ],
  },
  {
    title: "Reports",
    icon: <PieChart size={20} />,
    items: [
      { label: "Balthasar", href: "/reports/balthasar" },
      { label: "Refetch", href: "/reports/refetch" },
      { label: "Detailed", href: "/reports/detailed" },
    ],
  },
  {
    title: "Pages",
    icon: <Layers size={20} />,
    items: [
      { label: "Pages", href: "/pages", badge: "5" },
      { label: "Applications", href: "/applications", badge: "3" },
      { label: "Ecommerce", href: "/ecommerce" },
      { label: "Authentication", href: "/authentication" },
    ],
  },
  {
    title: "Data",
    icon: <Database size={20} />,
    items: [
      { label: "Tables", href: "/tables" },
      { label: "Components", href: "/components", badge: "2" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
];

export default function Sidebar() {
  const { isOpen, isAnimating, isMobile, closeSidebar } = useSidebar();
  const [expandedSections, setExpandedSections] = useState<string[]>(["Dashboard"]);
  const [showContent, setShowContent] = useState(isOpen);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => {
      // If clicking on already open section, close it
      if (prev.includes(title)) {
        return prev.filter((s) => s !== title);
      }
      // Otherwise, close all other sections and open only this one
      return [title];
    });
  };

  // Handle smooth content appearance/disappearance
  useEffect(() => {
    if (isOpen) {
      setShowContent(true);
    } else {
      // Delay hiding content until collapse animation is almost done
      const timer = setTimeout(() => setShowContent(false), isMobile ? 200 : 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMobile]);

  // Close sidebar when clicking a link on mobile
  const handleLinkClick = () => {
    if (isMobile) {
      closeSidebar();
    }
  };

  // Don't render sidebar on mobile when closed
  if (isMobile && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={closeSidebar}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`
          relative h-screen overflow-hidden
          bg-background border-r border-border
          flex flex-col will-change-transform backface-hidden
          ${isOpen ? 'animate-sidebar-expand' : 'animate-sidebar-collapse'}
          ${isAnimating ? 'pointer-events-none' : ''}
          ${isMobile ? 'fixed left-0 top-0 z-50 shadow-2xl' : 'relative'}
        `}
        style={{
          width: isOpen ? '18rem' : (isMobile ? '0' : '5rem'),
          transition: isOpen 
            ? 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            : 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Close button for mobile */}
        {isMobile && isOpen && (
          <button
            onClick={closeSidebar}
            className="absolute right-4 top-4 p-2  cursor-pointer rounded-full bg-hover-bg hover:bg-hover-bg/200
 transition-colors z-10"
          >
            <X size={20} />
          </button>
        )}

        {/* Header with Brand */}
        <div className="flex bg-navbar items-center justify-between px-6 border-b border-border h-14 flex-shrink-0">
          {showContent ? (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-text-primary whitespace-nowrap ">
                Argon Dashboard
              </h1>
              <p className="text-xs text-text-secondary whitespace-nowrap " style={{ animationDelay: '0.15s' }}>
                2 PRO
              </p>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center ">
                <span className="text-white text-xs font-bold">AD</span>
              </div>
            </div>
          )}
        </div>

        {/* Inner Rounded Container */}
        <div className="flex-1 flex flex-col mx-2 mb-2 mt-2 bg-sidebar rounded-3xl shadow-md overflow-hidden">
          {/* Main Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-4">
            {menuSections.map((section, index) => (
              <div key={section.title} className="space-y-2">
                {/* Section Title with Icon */}
                <button
                  onClick={() => toggleSection(section.title)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 
                    text-sm font-medium tracking-wide 
                    transition-all duration-150 ease-out
                    text-text-secondary hover:text-text-primary
                    ${isOpen ? "justify-between" : "justify-center"}
                    rounded-2xl hover:bg-hover-bg hover:text-hover-text
                    transition-colors duration-150
                  `}
                 
                  title={!isOpen ? section.title : ""}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-text-secondary transition-colors duration-150">
                      {section.icon}
                    </div>
                    {showContent && (
                      <span >
                        {section.title}
                      </span>
                    )}
                  </div>
                  
                  {showContent && expandedSections.includes(section.title) && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-150 ease-out flex-shrink-0 ${
                        expandedSections.includes(section.title)
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  )}
                </button>

                {/* Menu Items */}
                {showContent && expandedSections.includes(section.title) && (
                  <div className="space-y-1 ml-11 stagger-children">
                    {section.items.map((item, itemIndex) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`
                          group relative flex items-center justify-between
                          px-4 py-2.5 rounded-xl
                          transition-colors duration-150 ease-out
                          text-sm text-text-primary
                          hover:bg-hover-bg hover:text-hover-text
                          hover:translate-x-1
                        `}
                       
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-600 text-white animate-pulse-gentle">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}