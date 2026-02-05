"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnOverlayClick = true,
}) => {
  const [show, setShow] = useState(isOpen); // keeps modal in DOM
  const [animate, setAnimate] = useState(false); // controls animation

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setTimeout(() => setAnimate(true), 10); // tiny delay to trigger transition
    } else {
      setAnimate(false); // trigger closing animation
      setTimeout(() => setShow(false), 300); // match transition duration
    }
  }, [isOpen]);

  if (!show) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 
        bg-black/50 transition-opacity duration-300
        ${animate ? "opacity-100" : "opacity-0"}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`
          bg-navbar rounded-2xl shadow-2xl w-full flex flex-col max-h-[90vh]
          ${sizeClasses[size]}
          transform transition-all duration-300
          ${animate ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-90"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose}>
            <MdClose className="cursor-pointer" size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
