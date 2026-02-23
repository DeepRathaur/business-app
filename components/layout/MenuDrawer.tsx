"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { accountService } from "@/core/services/account.service";
import { Navigation } from "@/core/constants/navigation";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const user = accountService.getUser();

  const onLogout = () => {
    logout();
    onClose();
    router.push(Navigation.LOGIN);
  };

  const navigateTo = (path: string) => {
    router.push(path);
    onClose();
  };

  const manageItems = [
    { label: "Dashboard", icon: "/images/icons/home.svg", link: Navigation.DASHBOARD },
    { label: "Manage Services", icon: "/images/icons/menu-service.svg", link: Navigation.MANAGESERVICES },
    { label: "Manage Users", icon: "/images/icons/manage_users.svg", link: Navigation.MANAGE_USERS },
  ];

  const supportItems = [
    { label: "Contact Us", icon: "/images/icons/support_agent.svg", link: Navigation.CONTACT_US },
    { label: "FAQ's", icon: "/images/icons/faq_menu.svg", link: Navigation.FAQ },
  ];

  const displayName =
    (user && ((user as { firstName?: string }).firstName ?? user.name)) ?? "Ecare";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />

          <motion.aside
            className="fixed left-0 top-0 bottom-0 z-50 w-[80%] max-w-xs bg-white shadow-xl rounded-r-3xl flex flex-col overflow-hidden"
            initial={{ x: "-100%", opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0.8 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
          >
            <div className="flex items-start justify-between px-4 pt-6 pb-2">
              <Image
                src="/images/abc-logo.svg"
                alt="Airtel Business Care"
                width={66}
                height={58}
              />
              <motion.button
                onClick={onClose}
                aria-label="Close menu"
                whileTap={{ scale: 0.85, rotate: 90 }}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200"
              >
                <Image src="/images/icons/close.svg" alt="Close" width={18} height={18} />
              </motion.button>
            </div>

            <div className="px-4">
              <p className="text-sm font-semibold text-gray-800">Profile Setting</p>
              <div className="mt-3 rounded-2xl bg-[#9B91C10F] px-4 py-3">
                <p className="text-sm font-semibold text-gray-800">{displayName}</p>
                {user?.email && (
                  <p className="mt-0.5 text-xs text-gray-600 truncate">{user.email}</p>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-16">
              <nav className="mt-3">
                <MenuItem
                  label="Change Password"
                  iconPath="/images/icons/lock.svg"
                  onClick={() => {}}
                />
                <MenuItem
                  label="Change Language"
                  iconPath="/images/icons/Icon ionic-md-globe.svg"
                  onClick={() => {}}
                />
              </nav>

              <p className="mt-4 mb-1 px-3 text-sm font-semibold text-gray-800">Manage</p>
              <nav>
                {manageItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    label={item.label}
                    iconPath={item.icon}
                    onClick={() => navigateTo(item.link)}
                  />
                ))}
              </nav>

              <p className="mt-4 mb-1 px-3 text-sm font-semibold text-gray-800">Support</p>
              <nav>
                {supportItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    label={item.label}
                    iconPath={item.icon}
                    onClick={() => navigateTo(item.link)}
                  />
                ))}
              </nav>

              <div className="mt-4 rounded-2xl bg-[#9B91C10F] px-4 py-3">
                <p className="text-xs text-gray-600">
                  For all types of bulk activities please use our web portal
                </p>
                <a
                  href="https://www.airtel.com.ng/business/care"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-[#9260A0] underline"
                >
                  <Image src="/images/icons/external-link.svg" alt="External" width={12} height={12} />
                  <span>https://www.airtel.com.ng/business/care</span>
                </a>
              </div>
            </div>

            <div className="px-2 pb-10">
              <button
                type="button"
                onClick={onLogout}
                className="mt-auto w-full border-t border-gray-200 px-4 py-4 text-left text-sm font-semibold text-red-500 flex items-center gap-2 hover:bg-red-50 active:bg-red-100"
              >
                <Image src="/images/icons/Logout.svg" alt="Logout" width={16} height={16} />
                <span>Log Out</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

interface MenuItemProps {
  label: string;
  iconPath?: string;
  onClick?: () => void;
}

function MenuItem({ label, iconPath, onClick }: MenuItemProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96, x: 4 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-100 active:bg-gray-100"
    >
      <div className="flex items-center gap-3">
        {iconPath && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full">
            <Image src={iconPath} alt={label} width={18} height={18} />
          </div>
        )}
        <span className="text-sm text-gray-800">{label}</span>
      </div>
      <Image src="/images/icons/arrow_icon.svg" alt="" width={20} height={20} className="opacity-60" />
    </motion.button>
  );
}
