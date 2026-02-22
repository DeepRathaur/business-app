"use client";

import { motion } from "framer-motion";
import AppHeader from "@/components/layout/AppHeader";
import CardContainer from "@/components/ui/CardContainer";

/**
 * Manage Users - User management screen
 * List of users with actions
 */

const mockUsers = [
  { id: "1", name: "John Doe", role: "Admin", status: "Active" },
  { id: "2", name: "Jane Smith", role: "User", status: "Active" },
  { id: "3", name: "Bob Wilson", role: "User", status: "Inactive" },
];

export default function ManageUsersPage() {
  return (
    <>
      <AppHeader title="Manage Users" backHref="/dashboard" />
      <div className="flex-1 px-5 py-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <p className="text-sm text-white/70 mb-4">
            View and manage user accounts
          </p>

          {mockUsers.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <CardContainer compact>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-sm text-white/60 mt-0.5">
                      {user.role} · {user.status}
                    </p>
                  </div>
                  <button
                    className="ml-3 p-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
                    aria-label="Edit user"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>
              </CardContainer>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
