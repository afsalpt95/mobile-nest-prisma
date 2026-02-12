"use client";

import React from "react";

interface ItemsPerPageProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
  label?: string;
}

const ItemsPerPage: React.FC<ItemsPerPageProps> = ({
  value,
  onChange,
  options = [5, 10, 20, 50],
  label = "Show",
}) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-text-secondary">{label}</span>

      <select
      key={value}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="
          border border-border
          rounded-lg
          px-3 py-1.5
          cursor-pointer
          bg-navbar
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-primary
        "
      >
        {options.map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>

      <span className="text-text-secondary">rows</span>
    </div>
  );
};

export default ItemsPerPage;
