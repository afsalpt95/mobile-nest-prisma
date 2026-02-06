"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  House ,
  ChevronDown,
  Columns3Cog ,
  ChartColumnDecreasing ,
  ChartNoAxesCombined ,
  Users ,
  X,
  Warehouse ,
  ShoppingCart ,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../SidebarContext";

interface MenuSection {
  title: string;
  icon: React.ReactNode;
  href?: string;       
  single?: boolean;     
  items?: {
    label: string;
    href: string;
    badge?: string;
  }[];
}

const menuSections: MenuSection[] = [
  //  Dashboard single click (no dropdown)
  {
    title: "Dashboard",
    icon: <House  size={20} />,
    href: "/",          // added
    single: true,       // added
    items: [
      { label: "Dashboard", href: "/" },
    ],
  },
  {
    title: "Team",
    icon: <Users  size={20} />,
    items: [
      { label: "Department", href: "/department" },
      { label: "Position", href: "/position" },
      { label: "Employee", href: "/employee" },
       { label: "User", href: "/user" },
    ],
  },
  {
    title: "Service",
    icon: <Columns3Cog size={20} />,
    items: [
      { label: "Pages", href: "/pages", badge: "5" },
      { label: "Applications", href: "/applications", badge: "3" },
      { label: "Ecommerce", href: "/ecommerce" },
      { label: "Authentication", href: "/authentication" },
    ],
  },
  {
    title: "Sale",
    icon: <ChartNoAxesCombined   size={20} />,
    items: [
      { label: "Tables", href: "/tables" },
      { label: "Components", href: "/components", badge: "2" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
   {
    title: "Purchase",
    icon: <ShoppingCart  size={20} />,
    items: [
      { label: "Tables", href: "/tables" },
      { label: "Components", href: "/components", badge: "2" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
   {
    title: "Inventory",
    icon: <Warehouse  size={20} />,
    items: [
      { label: "Cateogry", href: "/inventory/category" },
      { label: "Unit", href: "/inventory/unit", badge: "2" },
      { label: "Stock", href: "/inventory/stock" },
    ],
  },
     {
    title: "Report",
    icon: <ChartColumnDecreasing size={20} />,
    items: [
      { label: "Sales Report", href: "/sales-report" },
      { label: "Purchase Report", href: "/purchase-report", badge: "2" },
      { label: "Inventory Report", href: "/inventory-report" },
      { label: "Finance Report", href: "/finance-report" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname(); //  for active highlight
  const { isOpen, isAnimating, isMobile, closeSidebar } = useSidebar();

  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [showContent, setShowContent] = useState(isOpen);

  const sidebarRef = useRef<HTMLDivElement>(null);



  const toggleSection = (title: string) => {
    setExpandedSections((prev) => {
      if (prev.includes(title)) {
        return prev.filter((s) => s !== title);
      }
      return [title];
    });
  };



  // Handle smooth content appearance/disappearance
  useEffect(() => {
    if (isOpen) {
      setShowContent(true);
    } else {
      const timer = setTimeout(() => setShowContent(false), isMobile ? 200 : 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMobile]);



  // Auto expand section based on current route
  useEffect(() => {
    menuSections.forEach((section) => {
      if (section.items?.some((item) => item.href === pathname)) {
        setExpandedSections([section.title]);
      }
    });
  }, [pathname]);



  // Close sidebar when clicking a link on mobile
  const handleLinkClick = () => {
    if (isMobile) {
      closeSidebar();
    }
  };



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
            className="absolute right-4 top-4 p-2  cursor-pointer rounded-full bg-hover-bg hover:bg-hover-bg/200 transition-colors z-10"
          >
            <X size={20} />
          </button>
        )}



        {/* Header with Brand */}
        <div className="flex bg-navbar items-center justify-between px-6 border-b border-border h-16 flex-shrink-0">
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

          <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-4">

            {menuSections.map((section) => (
              <div key={section.title} className="space-y-2">

                {/* ================= SINGLE (Dashboard) ================= */}
                {section.single ? (
                  <Link
                    href={section.href!}
                    onClick={handleLinkClick}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3
                      text-sm font-medium tracking-wide rounded-2xl
                      transition-all duration-150
                      ${pathname === section.href
                        ? "bg-table-heding-color text-text-secondary"
                        : "text-text-secondary hover:bg-table-heding-color"}
                      ${isOpen ? "justify-start" : "justify-center"}
                    `}
                  >
                    {section.icon}
                    {showContent && <span>{section.title}</span>}
                  </Link>
                ) : (



                <>
                  {/* Section Title */}
                  <button
                    onClick={() => toggleSection(section.title)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 
                      text-sm font-medium tracking-wide 
                      transition-all duration-150 ease-out
                      text-text-secondary hover:text-text-primary
                      ${isOpen ? "justify-between" : "justify-center"}
                      rounded-2xl hover:bg-table-heding-color
                    `}
                    title={!isOpen ? section.title : ""}
                  >
                    <div className="flex items-center gap-3">
                      {section.icon}
                      {showContent && <span>{section.title}</span>}
                    </div>

                    {showContent && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          expandedSections.includes(section.title)
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    )}
                  </button>



                  {/* Menu Items */}
                  {showContent && expandedSections.includes(section.title) && (
                    <div className="space-y-1 ml-11">
                      {section.items?.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={handleLinkClick}
                          className={`
                            flex items-center justify-between
                            px-4 py-2.5 rounded-xl
                            transition-colors duration-150
                            ${pathname === item.href
                              ? "bg-table-heding-color text-text-primary"
                              : "text-text-primary hover:bg-table-heding-color"}
                          `}
                        >
                          <span>{item.label}</span>

                          {item.badge && (
                            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-600 text-white">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
                )}

              </div>
            ))}

          </nav>
        </div>
      </aside>
    </>
  );
}
