"use client";

import { Fragment, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { User, LogOut } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/service/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ConfirmAlert from "./ConfirmAlert";

// Define proper TypeScript types
type MenuItemLink = {
  icon: React.ReactNode;
  label: string;
  href: string;
  type?: "link";
};

type MenuItemButton = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  type?: "button";
};

type MenuItem = MenuItemLink | MenuItemButton;

export default function ProfilePopover() {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      type: "link",
      icon: <User size={16} />,
      label: "Profile",
      href: "/profile", // Change to your profile route
    },
    {
      type: "button",
      icon: <LogOut size={16} />,
      label: "Logout",

      onClick: () => {
        setIsLogoutOpen(true);
      },
    },
  ];

  const handleLogout = () => {
    useAuthStore.getState().logout();
    router.replace("/login");
    router.refresh();
    toast.success("Logged out successfully");
  };

  return (
    <>
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`
              p-2 rounded-md transition-all duration-200 ease-out  cursor-pointer
              hover:bg-table-heding-color hover:text-hover-text hover:scale-110
              ${open ? "bg-table-heding-color text-hover-text" : ""}
            `}
            >
              <User size={18} className="text-main-primary " />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Popover.Panel className="absolute right-0 mt-2 z-50">
                <div className="w-48 rounded-lg shadow-lg ring-1 ring-border bg-navbar border border-border">
                  <div className="py-2">
                    {menuItems.map((item, index) => {
                      // Type guard to check if it's a link
                      const isLink = "href" in item;

                      if (isLink) {
                        return (
                          <Link
                            key={index}
                            href={item.href}
                            onClick={() => close()}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-table-heding-color transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg block"
                          >
                            <div className="text-text-secondary">
                              {item.icon}
                            </div>
                            <span>{item.label}</span>
                          </Link>
                        );
                      } else {
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              item.onClick();
                              close();
                            }}
                            className="w-full cursor-pointer flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-table-heding-color transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
                          >
                            <div className="text-text-secondary">
                              {item.icon}
                            </div>
                            <span>{item.label}</span>
                          </button>
                        );
                      }
                    })}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>

      <ConfirmAlert
        isOpen={isLogoutOpen}
        closeModal={() => setIsLogoutOpen(false)}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        onConfirm={handleLogout}
      />
    </>
  );
}
