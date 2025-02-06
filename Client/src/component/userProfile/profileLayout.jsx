import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faUser,
  faCartShopping,
  faClipboardList,
  faRightFromBracket,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const navigation = [
  { name: "Home", path: "/", icon: faHome },
  { name: "Profile", path: "/profile", icon: faUser },
  { name: "Cart", path: "/profile/cart", icon: faCartShopping },
  { name: "Orders", path: "/profile/orders", icon: faClipboardList },
  { name: "Logout", path: "/logout", icon: faRightFromBracket },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProfileLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Mobile Sidebar */}
      <Transition show={sidebarOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          open={sidebarOpen}
          onClose={setSidebarOpen}
        >
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
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col bg-gray-900 p-6 shadow-lg">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </button>
                <nav className="mt-10 space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={classNames(
                        location.pathname === item.path
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white",
                        "flex items-center gap-x-4 rounded-md p-3 text-sm font-semibold"
                      )}
                    >
                      <FontAwesomeIcon
                        icon={item.icon}
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-72 bg-gray-900 p-6 shadow-lg">
        <nav className="mt-6 space-y-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={classNames(
                location.pathname === item.path
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
                "flex items-center gap-x-4 rounded-md p-3 text-sm font-semibold"
              )}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className="h-5 w-5"
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 bg-gray-900">
        {/* Mobile Top Bar */}
        <div className="sticky top-0 z-40 flex items-center justify-between bg-gray-900 px-6 py-4 shadow-md lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <FontAwesomeIcon icon={faBars} className="h-6 w-6" aria-hidden="true" />
          </button>
          <h1
            className="text-lg font-semibold text-white cursor-pointer"
            onClick={() => navigate("/")}
          >
            User Dashboard
          </h1>
        </div>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center py-10 px-6 sm:px-8 lg:px-10">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-5xl">
            <Outlet /> {/* Renders the selected page here */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;
