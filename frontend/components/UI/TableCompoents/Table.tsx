"use client";

import React from "react";
import SearchBar from "./SearchBar";
import TableSkeleton from "./TableSkelton";
import ItemsPerPage from "./ItemsPerPage";
import Pagination from "./Pagination";

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface Props {
  branchDropdown?: React.ReactNode;
  columns: Column[];
  data: any[];
  isLoading?: boolean;

  search?: string;
  onSearchChange?: (value: string) => void;

  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;

  itemsPerPage?: number;
  onItemsPerPageChange?: (value: number) => void;
}

const Table: React.FC<Props> = ({
  branchDropdown,
  columns,
  data,
  isLoading = false,

  search = "",
  onSearchChange,

  page = 1,
  totalPages = 1,
  onPageChange,

  itemsPerPage = 10,
  onItemsPerPageChange,
}) => {
  return (
    <div className="w-full bg-navbar rounded-2xl shadow-sm border border-border mt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 border-b border-border">
        <div className="flex items-center gap-3 md:w-[30%]">{branchDropdown}</div>

        {onSearchChange && (
          <SearchBar value={search} onChange={onSearchChange} />
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full w-full border-separate border-spacing-0">
          {/* Head */}
          <thead className="sticky top-0 bg-table-heding-color z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="
                    text-left
                    px-4 py-3
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-text-secondary
                    border-b
                    border-border
                    whitespace-nowrap
                  "
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {isLoading ? (
              <TableSkeleton columns={columns.length} rows={6} />
            ) : data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-table-heding-color transition"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="
                        px-4 py-3
                        text-sm
                        text-text-primary
                        border-b
                        border-border
                      "
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-text-secondary"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center gap-4 px-4 py-3">
        {onItemsPerPageChange && (
          <ItemsPerPage value={itemsPerPage} onChange={onItemsPerPageChange} />
        )}

        {onPageChange && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Table;
