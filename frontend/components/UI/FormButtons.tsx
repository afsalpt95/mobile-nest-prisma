"use client";

import React from "react";

type FormButtonsProps = {
  isSubmitting?: boolean;
  onCancel: () => void;
  submitText?: string;
  cancelText?: string;
  submitDisabled?: boolean;
};

const FormButtons: React.FC<FormButtonsProps> = ({
  isSubmitting = false,
  onCancel,
  submitText = "Save",
  cancelText = "Cancel",
  submitDisabled = false,
}) => {
  return (
    <div className="flex justify-end pt-4 gap-2">
      {/* Cancel */}
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="
          px-6 py-2
          bg-[#ff5656]
          cursor-pointer
          text-white
          rounded-lg
          hover:bg-[#ff3d3d]
          transition-colors
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {cancelText}
      </button>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || submitDisabled}
        className="
          px-6 py-2
          bg-main-primary
          cursor-pointer
          hover:bg-main-hover-primary
          text-white
          rounded-lg
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {isSubmitting ? (
          <div className="loader w-4 h-4 border-2 border-border border-t-transparent rounded-full animate-spin" />
        ) : (
          submitText
        )}
      </button>
    </div>
  );
};

export default FormButtons;
