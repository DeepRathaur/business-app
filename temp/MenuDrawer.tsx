// "use client";

// import { useAuth } from "@/context/AuthContext";
// import { Navigation } from "@/core/constant/navigate.constant";
// import { accountService } from "@/core/service/accountService";
// import { useMenuNavigation } from "@/hooks/useMenuNavigation";
// import Image from "next/image";
// import { motion, AnimatePresence } from "framer-motion";

// interface MenuDrawerProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
//   const navigateTo = useMenuNavigation();
//   const { setIsAuthed } = useAuth();
//   const getUserDetails = accountService.getUser();

//   const onLogout = () => {
//     accountService.logOut();
//     setIsAuthed(false);
//     navigateTo(Navigation.LOGIN);
//   };

//   const menuItems = [
//     {
//       label: "Dashboard",
//       icon: "/images/icons/home.svg",
//       link: Navigation.DASHBOARD,
//     },
//     {
//       label: "Manage Services",
//       icon: "/images/icons/menu-service.svg",
//       link: Navigation.MANAGESERVICES,
//     },
//     {
//       label: "Contact Us",
//       icon: "/images/icons/briefcase.svg",
//       link: Navigation.CONTACT_US,
//     },
//     {
//       label: "FAQ's",
//       icon: "/images/icons/menu-faq.svg",
//       link: Navigation.FAQ,
//     },
//   ];

//   const handleItemClick = (link: string) => {
//     navigateTo(link);
//     onClose();
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Overlay with fade animation */}
//           <motion.div
//             className="fixed inset-0 z-40 bg-black/40"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             onClick={onClose}
//           />

//           {/* Drawer */}
//           <motion.aside
//             className="
//               fixed top-0 left-0 z-50
//               h-full w-[80%] max-w-xs
//               bg-white shadow-lg flex flex-col
//             "
//             initial={{ x: "-100%", opacity: 0.8 }}
//             animate={{ x: 0, opacity: 1 }}
//             exit={{ x: "-100%", opacity: 0.8 }}
//             transition={{ type: "spring", stiffness: 380, damping: 32 }}
//           >
//             {/* Top Right Close Icon */}
//             <div className="flex justify-end p-4">
//               <motion.button
//                 onClick={onClose}
//                 aria-label="Close menu"
//                 whileTap={{ scale: 0.8, rotate: 90 }}
//                 transition={{ type: "spring", stiffness: 400, damping: 25 }}
//               >
//                 <Image
//                   src="/images/icons/close.svg"
//                   alt="Close"
//                   width={20}
//                   height={20}
//                 />
//               </motion.button>
//             </div>

//             {/* Profile Section with Logout */}
//             <div className="px-4 pb-4 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <Image
//                     src="/images/icons/user.png"
//                     alt="Profile"
//                     width={40}
//                     height={40}
//                     className="rounded-full"
//                   />
//                   <p className="text-sm font-semibold font-color-text">
//                     {getUserDetails?.firstName}
//                   </p>
//                 </div>
//                 <motion.button
//                   className="
//                     button min-w-[65px] min-h-[35px]
//                     leading-normal ml-[-1px] p-0
//                     bg-red-500 text-white cursor-pointer text-sm
//                     rounded-md
//                   "
//                   whileTap={{ scale: 0.95 }}
//                   transition={{ type: "spring", stiffness: 300, damping: 20 }}
//                   onClick={onLogout}
//                 >
//                   Logout
//                 </motion.button>
//               </div>
//             </div>

//             {/* Menu Items */}
//             <nav className="p-4 space-y-3 flex-1">
//               {menuItems.map((item, index) => (
//                 <motion.button
//                   key={item.label}
//                   onClick={() => handleItemClick(item.link)}
//                   className="
//                     flex items-center space-x-3 w-full
//                     text-left text-sm font-color-text
//                     py-2
//                   "
//                   whileTap={{ scale: 0.96, x: 4 }}
//                   transition={{ type: "spring", stiffness: 320, damping: 22 }}
//                 >
//                   <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
//                     <Image
//                       src={item.icon}
//                       alt={item.label}
//                       width={20}
//                       height={20}
//                     />
//                   </div>
//                   <span className="text-base tracking-[0.2px]">
//                     {item.label}
//                   </span>
//                 </motion.button>
//               ))}
//             </nav>
//           </motion.aside>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }



"use client";

import { useAuth } from "@/context/AuthContext";
import { Navigation } from "@/core/constant/navigate.constant";
import { accountService } from "@/core/service/accountService";
import { useMenuNavigation } from "@/hooks/useMenuNavigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  const navigateTo = useMenuNavigation();
  const { setIsAuthed } = useAuth();
  const getUserDetails = accountService.getUser();

  const onLogout = () => {
    accountService.logOut();
    setIsAuthed(false);
    navigateTo(Navigation.LOGIN);
  };

  // You can still control which links go where
  const manageItems = [
    {
      label: "Dashboard",
      icon: "/images/icons/home.svg",
      link: Navigation.DASHBOARD,
    },
    {
      label: "Manage Services",
      icon: "/images/icons/menu-service.svg",
      link: Navigation.MANAGESERVICES,
    },
    {
      label: "Manage Users",
      icon: "/images/icons/manage_users.svg",
      link: Navigation.DASHBOARD,
    },
  ];

  const supportItems = [
    {
      label: "Contact Us",
      icon: "/images/icons/support_agent.svg",
      link: Navigation.CONTACT_US,
    },
    {
      label: "FAQ's",
      icon: "/images/icons/faq_menu.svg",
      link: Navigation.FAQ,
    },
  ];

  const handleItemClick = (link: string) => {
    navigateTo(link);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />

          {/* Drawer / Sidebar */}
          <motion.aside
            className="
              fixed left-0 top-0 bottom-0 z-50
              w-[80%] max-w-xs
              bg-white shadow-xl rounded-r-3xl
              flex flex-col overflow-hidden
            "
            initial={{ x: "-100%", opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0.8 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
          >
            {/* Header: Logo + Close */}
            <div className="flex items-start justify-between px-4 pt-6 pb-2">
              <div className="flex items-center gap-2">
                {/* Replace logo path with your actual Airtel logo */}
                <Image
                  src="/images/abc-logo.svg"
                  alt="Airtel Business Care"
                  width={66}
                  height={58}
                />
              </div>

              <motion.button
                onClick={onClose}
                aria-label="Close menu"
                whileTap={{ scale: 0.85, rotate: 90 }}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200"
              >
                <Image
                  src="/images/icons/close.svg"
                  alt="Close"
                  width={18}
                  height={18}
                />
              </motion.button>
            </div>

            {/* Profile Setting title + card */}
            <div className="px-4">
              <p className="text-sm font-semibold blk-color-text">
                Profile Setting
              </p>

              <div className="mt-3 rounded-2xl bg-[#9B91C10F] px-4 py-3">
                <p className="text-sm font-semibold blk-color-text">
                  {getUserDetails?.firstName ?? "Ecare"}
                </p>
                {/* Adjust keys according to your user model */}
                {getUserDetails?.mobileNumber && (
                  <p className="mt-1 text-xs font-color-text">
                    {getUserDetails.mobileNumber}
                  </p>
                )}
                {getUserDetails?.email && (
                  <p className="mt-0.5 text-xs blk-color-text truncate">
                    {getUserDetails.email}
                  </p>
                )}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-2 pb-16">
              {/* Account options similar to screenshot (optional / placeholders) */}
              {/* If you have actual routes, plug them in here */}
              <nav className="mt-3">
                <MenuItem
                  label="Change Password"
                  iconPath="/images/icons/lock.svg"
                  onClick={() => console.log("Change Password")}
                />
                <MenuItem
                  label="Change Language"
                  iconPath="/images/icons/Icon ionic-md-globe.svg"
                  onClick={() => console.log("Change Language")}
                />
              </nav>

              {/* Manage section */}
              <SectionHeader label="Manage" />
              <nav>
                {manageItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    label={item.label}
                    iconPath={item.icon}
                    onClick={() => handleItemClick(item.link)}
                  />
                ))}
              </nav>

              {/* Support section */}
              <SectionHeader label="Support" />
              <nav>
                {supportItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    label={item.label}
                    iconPath={item.icon}
                    onClick={() => handleItemClick(item.link)}
                  />
                ))}
              </nav>

              {/* Bulk activity info card */}
              <div className="mt-4 rounded-2xl bg-[#9B91C10F] px-4 py-3">
                <p className="text-xs font-color-text">
                  For all types of bulk activities please use our web portal
                </p>

                <a
                  href="https://www.airtel.com.ng/business/care"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-[#9260A0] underline"
                >
                  <Image
                    src="/images/icons/external-link.svg"
                    alt="External link"
                    width={12}
                    height={12}
                  />
                  <span>https://www.airtel.com.ng/business/care</span>
                </a>
              </div>
            </div>

            {/* Logout row at bottom */}
            <div className="px-2 pb-10">
            <button
              onClick={onLogout}
              className="
                mt-auto w-full border-t border-gray-200
                px-4 py-4 text-left text-sm font-semibold
                text-red-500 flex items-center gap-2
                hover:bg-red-50 active:bg-red-100
              "
            >
              <Image
                src="/images/icons/logout.svg"
                alt="Logout"
                width={16}
                height={16}
              />
              <span>Log Out</span>
            </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ------------ Helper components for cleaner JSX ------------ */

type MenuItemProps = {
  label: string;
  iconPath?: string;
  onClick?: () => void;
};

const MenuItem = ({ label, iconPath, onClick }: MenuItemProps) => {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96, x: 4 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="
        w-full flex items-center justify-between
        px-3 py-3 rounded-xl
        hover:background-color active:bg-gray-100
      "
    >
      <div className="flex items-center gap-3">
        {iconPath && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full">
            <Image src={iconPath} alt={label} width={18} height={18} />
          </div>
        )}
        <span className="text-sm font-color-text">{label}</span>
      </div>
      <span className="text-gray-400 text-xs">
         <Image
            src="/images/icons/arrow_icon.svg"
            alt="Dropdown"
            width={20}
            height={20}
            className="cursor-pointer"
          />
      </span>
    </motion.button>
  );
};

const SectionHeader = ({ label }: { label: string }) => (
  <p className="mt-4 mb-1 px-3 text-sm font-semibold blk-color-text">
    {label}
  </p>
);
