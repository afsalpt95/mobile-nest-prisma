"use client";

import React from "react";
import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}


const SearchBar: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Search",
}) => {
  return (
    <div className="relative w-full md:w-72">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
      />

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          pl-10 pr-4 py-2.5
          rounded-xl
          border border-border
          outline-none
          text-sm
        "
      />
    </div>
  );
};

export default SearchBar;
