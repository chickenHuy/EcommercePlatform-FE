"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function PaginationAdminTable(props) {
  const {
    hasNext,
    hasPrevious,
    handleNextPage,
    handlePrevPage,
    currentPage,
    totalPage,
    setCurrentPage,
  } = props;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={`${
              hasPrevious ? "cursor-pointer" : "cursor-not-allowed"
            }`}
            onClick={() => {
              if (hasPrevious) {
                handlePrevPage();
              }
            }}
          />
        </PaginationItem>

        {currentPage > 1
          ? Array.from(Array(3).keys())
              .map((i) => currentPage - (i + 1))
              .filter((page) => page > 0)
              .reverse()
              .map((page, index) => (
                <PaginationItem key={index}>
                  <PaginationLink onClick={() => setCurrentPage(page)}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))
          : null}

        <PaginationItem>
          <PaginationLink className="cursor-pointer" isActive>{currentPage}</PaginationLink>
        </PaginationItem>

        {currentPage < totalPage
          ? Array.from(Array(3).keys())
              .map((i) => currentPage + (i + 1))
              .filter((page) => page <= totalPage)
              .map((page, index) => (
                <PaginationItem key={index}>
                  <PaginationLink onClick={() => setCurrentPage(page)}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))
          : null}

        <PaginationItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="link">
                <PaginationEllipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Chọn trang</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Tạo danh sách các số trang */}
              {Array.from({ length: totalPage }, (_, index) => {
                const page = index + 1;
                return (
                  <DropdownMenuCheckboxItem
                    key={index}
                    checked={currentPage === page}
                    onCheckedChange={() => setCurrentPage(page)}
                  >
                    {page}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            className={`${hasNext ? "cursor-pointer" : "cursor-not-allowed"}`}
            onClick={() => {
              if (hasNext) {
                handleNextPage();
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
