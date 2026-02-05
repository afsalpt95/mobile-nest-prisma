

import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Settings, Building, Users, UserCog } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPopover() {
  const menuItems = [
    {
      icon: <Building size={16} />,
      label: "Organisation",
      href: "/organization", // Add your route here
    },
    {
      icon: <UserCog size={16} />,
      label: "User",
      href: "/settings/user", // Add your route here
    },
    {
      icon: <Users size={16} />,
      label: "User Group",
      href: "/settings/user-group", // Add your route here
    },
  ];

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button 
            className={` cursor-pointer
              p-2 rounded-md transition-all duration-200 ease-out 
              hover:bg-table-heding-color hover:text-hover-text 
              ${open ? 'bg-table-heding-color text-hover-text' : ''}
            `}
          >
            <Settings size={18} className="text-main-primary " />
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
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => close()} // Close popover when clicking
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-table-heding-color transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg block"
                    >
                      <div className="text-text-secondary">
                        {item.icon}
                      </div>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}