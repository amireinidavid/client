"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const generatePages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page
    pages.push(totalPages);

    return pages;
  };

  return (
    <nav
      className={cn("flex items-center justify-center space-x-2", className)}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-50 
                 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {generatePages().map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span className="px-4 py-2">
              <MoreHorizontal className="w-5 h-5 text-neutral-400" />
            </span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={cn(
                "px-4 py-2 rounded-lg hover:bg-neutral-100",
                currentPage === page &&
                  "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-50 
                 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
}
