"use client";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  data_length: number;
  leftRightBtn?: boolean;
}

export default function ShadcnPagination({
  leftRightBtn = true,
  data_length,
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps) {
  // Calculate total pages based on data length and page size
  const maxVisiblePages = 5;
  const totalPages_ = Math.ceil(data_length / totalPages);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate the visible page numbers
  const getPageNumbers = () => {
    // If total pages is less than max visible, return all pages
    if (totalPages_ <= maxVisiblePages) {
      return Array.from({ length: totalPages_ }, (_, i) => i + 1);
    }

    // Handle edge cases for current page near the beginning or end
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages_ - 2) {
      return [
        totalPages_ - 4,
        totalPages_ - 3,
        totalPages_ - 2,
        totalPages_ - 1,
        totalPages_,
      ];
    }

    // For pages in the middle, show 5 pages centered around the current page
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const buttonVariants: Variants = {
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: {
      scale: 0.95,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

  return (
    <Pagination>
      <motion.div
        className="mt-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <PaginationContent>
          {leftRightBtn && data_length > totalPages && (
            <motion.div variants={itemVariants}>
              <PaginationItem>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    aria-disabled={currentPage === 1}
                    className={`transition-all duration-200 ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-primary/10"
                    }`}
                  />
                </motion.div>
              </PaginationItem>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {getPageNumbers().map((pageNumber, index) => (
              <motion.div
                key={`${pageNumber}-${currentPage}`}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ delay: index * 0.05 }}
              >
                <PaginationItem>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNumber);
                      }}
                      isActive={pageNumber === currentPage}
                      className={`transition-all duration-200 ${
                        pageNumber === currentPage
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      <motion.span
                        initial={false}
                        animate={{
                          scale: pageNumber === currentPage ? 1.1 : 1,
                          fontWeight: pageNumber === currentPage ? 600 : 400,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        {pageNumber}
                      </motion.span>
                    </PaginationLink>
                  </motion.div>
                </PaginationItem>
              </motion.div>
            ))}
          </AnimatePresence>

          {currentPage < totalPages_ - 2 && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <PaginationItem>
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <PaginationEllipsis className="text-muted-foreground" />
                </motion.div>
              </PaginationItem>
            </motion.div>
          )}

          {leftRightBtn && data_length > totalPages && (
            <motion.div variants={itemVariants}>
              <PaginationItem>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages_)
                        handlePageChange(currentPage + 1);
                    }}
                    aria-disabled={currentPage === totalPages_}
                    className={`transition-all duration-200 ${
                      currentPage === totalPages_
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-primary/10"
                    }`}
                  />
                </motion.div>
              </PaginationItem>
            </motion.div>
          )}
        </PaginationContent>
      </motion.div>
    </Pagination>
  );
}
