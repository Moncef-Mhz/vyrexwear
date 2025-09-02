"use client";

import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Mock products data - replace with your actual products

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[70%] z-50 bg-white"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 200,
            duration: 0.6,
          }}
        >
          {/* Search Header */}
          <div className="border-b">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center flex-1 max-w-2xl mx-auto">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 text-lg outline-none placeholder-gray-400"
                  autoFocus
                />
              </div>
              <button
                onClick={onClose}
                className="ml-4 p-2  rounded-full cursor-pointer "
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="p-6 max-w-6xl mx-auto">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    delayChildren: 0.2,
                    staggerChildren: 0.1,
                  },
                },
              }}
            ></motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
