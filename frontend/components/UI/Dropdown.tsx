"use client";

import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { FaTimes } from "react-icons/fa";

type Option = {
  label: string;
  value: number | string;
};

type Props = {
  label?: string;
  options: Option[];
  value: any;
  onChange: (val: any) => void; //  fixed type
  placeholder?: string;
  error?: string;
  loading?: boolean;
  multiple?: boolean;
};

const Dropdown: React.FC<Props> = ({
  label,
  options,
  value = [],
  onChange,
  placeholder = "Select or search",
  error,
  loading,
  multiple = false,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  /* ---------------- FILTER ---------------- */
  const filtered = useMemo(() => {
    return options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase()),

    );
  }, [search, options]);

  /* ---------------- SELECT ---------------- */
const handleSelect = (val: any) => {
  if (multiple) {
    const arr = Array.isArray(value) ? value : [];

    //  already selected → do nothing
    if (arr.includes(val)) {
      setOpen(false); // just close
      return;
    }

    //  only add
    onChange([...arr, val]);
    setOpen(false);
  } else {
    onChange(val);
    setOpen(false);
  }
};

  /* ---------------- REMOVE (multi only) ---------------- */
  const remove = (val: any) => {
    if (!multiple) return;

    const arr = Array.isArray(value) ? value : [];
    onChange(arr.filter((v) => v !== val));
  };

  /* ---------------- SELECTED ---------------- */
  const selectedOptions = multiple
    ? options.filter((o) =>
        Array.isArray(value) ? value.includes(o.value) : false,
      )
    : options.filter((o) => o.value === value);

  /* ---------------- RENDER ---------------- */
  return (
    <div className="relative w-full space-y-1">
      {label && <label className="font-medium">{label}</label>}

      {/* Input container */}
      <div
        onClick={() => setOpen((p) => !p)}
        className={`border rounded-lg p-2 flex flex-wrap gap-2 min-h-[44px] cursor-pointer  ${
          error ? "border-red-500" : ""
        }`}
      >
        {/* MULTI SELECT TAGS */}
        {multiple ? (
          selectedOptions.length ? (
            selectedOptions.map((o) => (
              <span
                key={o.value}
                className="flex items-center gap-1 bg-main-primary/80 text-secondary px-2 py-1 rounded text-xs"
              >
                {o.label}

                <FaTimes
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(o.value);
                  }}
                />
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">{placeholder}</span>
          )
        ) : (
          <span className="text-sm">
            {selectedOptions[0]?.label || placeholder}
          </span>
        )}

        <ChevronDown
          size={18}
          className={`ml-auto mt-1 transition ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown list */}
      {open && (
        <div className="absolute z-50  w-full mt-1 border rounded-lg shadow-lg bg-table-heding-color max-h-56 overflow-auto">
          <div className="w-full  px-2 py-1">
            <div className=" rounded-lg  mt-2 border border-border ">
              <input
                placeholder="Search..."
                className="w-full p-2  outline-none text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          {loading && <div className="loader-small"></div>}

          {!loading && filtered.length === 0 && (
            <p className="p-2 text-sm text-gray-400">No option found</p>
          )}

          {!loading &&
            filtered.map((o) => {
              const isSelected = multiple
                ? Array.isArray(value) && value.includes(o.value)
                : value === o.value;

              return (
                <div
                  key={o.value}
                  onClick={() => handleSelect(o.value)}
                  className={`p-2 text-sm cursor-pointer hover:bg-main-primary/10 flex justify-between ${
                    isSelected ? "text-main-primary" : ""
                  }`}
                >
                  {o.label}
                </div>
              );
            })}
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Dropdown;
