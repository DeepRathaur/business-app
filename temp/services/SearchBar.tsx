"use client";

import { motion } from "framer-motion";

export default function SearchBar({ loading, query, setQuery }: any) {
  if (loading) {
    return (
      <motion.div
        className="h-11 bg-gray-200 rounded-md mt-3"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      />
    );
  }

  return (
    <div className="mt-3 flex items-center border rounded-md px-3 py-2 bg-white shadow-sm">
      <img src="/images/icons/search-icon.svg" className="w-4 h-4 mr-2" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by mobile no"
        className="flex-1 outline-none text-sm"
      />
    </div>
  );
}