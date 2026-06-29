import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AppButton } from "./app-button"
import { cn } from "@/lib/utils"

interface AppPaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const AppPagination = React.forwardRef<HTMLElement, AppPaginationProps>(
  ({ currentPage, totalPages, onPageChange, className, ...props }, ref) => {
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
      const pages: (number | string)[] = []
      const siblingCount = 1

      const totalNumbers = siblingCount * 2 + 3
      const totalBlocks = totalNumbers + 2

      if (totalPages > totalBlocks) {
        const startPage = Math.max(2, currentPage - siblingCount)
        const endPage = Math.min(totalPages - 1, currentPage + siblingCount)

        pages.push(1)

        if (startPage > 2) {
          pages.push("...")
        }

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i)
        }

        if (endPage < totalPages - 1) {
          pages.push("...")
        }

        pages.push(totalPages)
      } else {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i)
        }
      }

      return pages
    }

    const pageNumbers = getPageNumbers()

    return (
      <nav
        {...props}
        ref={ref}
        className={cn(
          "flex items-center justify-between border-t border-border px-4 py-3 sm:px-6",
          className
        )}
      >
        {/* Mobile View */}
        <div className="flex flex-1 justify-between sm:hidden">
          <AppButton
            variant="outline"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            prefixIcon={ChevronLeft}
          >
            Previous
          </AppButton>
          <AppButton
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            suffixIcon={ChevronRight}
          >
            Next
          </AppButton>
        </div>

        {/* Desktop View */}
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Showing page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
              <span className="font-semibold text-foreground">{totalPages}</span>
            </p>
          </div>
          <div>
            <ul className="inline-flex -space-x-px rounded-md shadow-xs items-center gap-1">
              <li>
                <AppButton
                  variant="outline"
                  size="icon"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  prefixIcon={ChevronLeft}
                  iconOnly
                  className="h-9 w-9 p-0"
                />
              </li>
              {pageNumbers.map((page, index) => {
                if (page === "...") {
                  return (
                    <li key={`ellipsis-${index}`}>
                      <span className="inline-flex h-9 w-9 items-center justify-center text-sm text-muted-foreground">
                        ...
                      </span>
                    </li>
                  )
                }

                const pageNum = page as number
                const isActive = pageNum === currentPage

                return (
                  <li key={`page-${pageNum}`}>
                    <AppButton
                      variant={isActive ? "default" : "outline"}
                      onClick={() => onPageChange(pageNum)}
                      className={cn(
                        "h-9 w-9 p-0 text-sm font-medium",
                        isActive && "pointer-events-none"
                      )}
                    >
                      {pageNum}
                    </AppButton>
                  </li>
                )
              })}
              <li>
                <AppButton
                  variant="outline"
                  size="icon"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  suffixIcon={ChevronRight}
                  iconOnly
                  className="h-9 w-9 p-0"
                />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
)

AppPagination.displayName = "AppPagination"

export { AppPagination }
