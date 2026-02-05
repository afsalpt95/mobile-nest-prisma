"use client";

import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  const goPrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const goNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <div className="flex items-center gap-3 text-sm">
      {/* Prev */}
      <button
        onClick={goPrev}
        disabled={page <= 1}
        className="
          px-3 py-1
          border border-border
          rounded-lg
          disabled:opacity-40
           hover:bg-table-heding-color
          cursor-pointer
        "
      >
        Prev
      </button>

      {/* Page indicator */}
      <span className="px-4 py-1 border border-border rounded-lg bg-navbar">
        {page} / {totalPages || 1}
      </span>

      {/* Next */}
      <button
        onClick={goNext}
        disabled={page >= totalPages}
        className="
          px-3 py-1
          border border-border
          rounded-lg
          disabled:opacity-40
          hover:bg-table-heding-color
          cursor-pointer
        "
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
