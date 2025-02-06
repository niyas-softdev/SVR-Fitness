import React,{ useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const navigation = [
  { name: "Admin Home", path: "/dashboard", icon: ChartBarIcon },
  { name: "User Controller", path: "/dashboard/userController", icon: UsersIcon },
  {
    name: "Product Controller",
    path: "/dashboard/productController",
    icon: FolderIcon
  },
  { name: "Expire User", path: "/dashboard/expireUser", icon: CalendarIcon },
  {
    name: "Documents",
    path: "/dashboard/documents",
    icon: DocumentDuplicateIcon
  },
  { name: "Reports", path: "/dashboard/reports", icon: ChartPieIcon }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex">
      
      {/* Mobile Sidebar */}
<Transition show={sidebarOpen} as={React.Fragment}>
  <Dialog
    as="div"
    className="relative z-50 lg:hidden"
    open={sidebarOpen}
    onClose={setSidebarOpen}
  >
    {/* Overlay */}
    <Transition.Child
      as={React.Fragment}
      enter="transition-opacity ease-linear duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity ease-linear duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-gray-900/80" aria-hidden="true" />
    </Transition.Child>

    {/* Sidebar Panel */}
    <div className="fixed inset-0 flex">
      <Transition.Child
        as={React.Fragment}
        enter="transform transition ease-in-out duration-300"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transform transition ease-in-out duration-300"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <Dialog.Panel className="relative flex w-full max-w-xs flex-col bg-gray-900 px-6 pb-4 overflow-y-auto">
          {/* Close Button */}
          <div className="absolute top-0 right-0 mt-4 mr-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          {/* Company Logo */}
          <div className="flex items-center h-16">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
              alt="Your Company"
            />
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex-1">
            <ul className="space-y-7">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)} // Close sidebar on navigation
                      className={classNames(
                        location.pathname === item.path
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white",
                        "group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold"
                      )}
                    >
                      {IconComponent ? (
                        <IconComponent
                          className="h-6 w-6 shrink-0"
                          aria-hidden="true"
                        />
                      ) : (
                        <span className="h-6 w-6 shrink-0 text-red-500">⚠️</span>
                      )}
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </Dialog.Panel>
      </Transition.Child>
    </div>
  </Dialog>
</Transition>


      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col bg-gray-900 px-6">
        <div className="flex h-16 items-center justify-between">
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
          />
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white"
            aria-label="Go to Home"
          >
            <HomeIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1">
          <ul className="space-y-7">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={classNames(
                    location.pathname === item.path
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white",
                    "group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold"
                  )}
                >
                  <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72 flex-1 bg-black">
        <div className="sticky top-0 z-40 flex items-center  px-4 py-4 shadow sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-400"
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold text-white">
            Dashboard
          </div>
        </div>
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet /> {/* Renders the selected page here */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
