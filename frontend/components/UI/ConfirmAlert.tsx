"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isLoading?: boolean;
};

const ConfirmAlert = ({
  isOpen,
  closeModal,
  title = "Are you sure?",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  isLoading = false,
}: Props) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-sm bg-navbar p-6 rounded-xl shadow-lg">
              <Dialog.Title className="text-lg font-semibold">
                {title}
              </Dialog.Title>

              <p className="mt-2 text-sm text-gray-600">{message}</p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-gray-200 cursor-pointer hover:bg-gray-400"
                >
                  {cancelText}
                </button>

                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg cursor-pointer bg-red-500 text-white hover:bg-red-700"
                >
                  {isLoading ?<div className="loader-small"></div> : confirmText}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmAlert;
