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
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProfileLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Logout Function
  const handleLogout = () => {
    sessionStorage.removeItem("userToken"); // Remove token
    localStorage.removeItem("userId"); // Remove userId
    navigate("/authpopup"); // Redirect to login/auth popup
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Mobile Sidebar */}
      <Transition show={sidebarOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" open={sidebarOpen} onClose={setSidebarOpen}>
          <Transition.Child
            as={React.Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
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
              <Dialog.Panel className="relative flex flex-col w-64 bg-gray-900 p-6 shadow-xl">
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <FontAwesomeIcon icon={faXmark} className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Navigation Links */}
                <nav className="mt-10 space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={classNames(
                        location.pathname === item.path ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white",
                        "flex items-center gap-x-4 rounded-md p-3 text-sm font-semibold"
                      )}
                    >
                      <FontAwesomeIcon icon={item.icon} className="h-5 w-5" aria-hidden="true" />
                      {item.name}
                    </Link>
                  ))}

                  {/* Logout Button (Not a link, it triggers `handleLogout`) */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-x-4 text-left p-3 text-sm font-semibold text-gray-400 hover:bg-gray-800 hover:text-white rounded-md"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} className="h-5 w-5" aria-hidden="true" />
                    Logout
                  </button>
                </nav>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 bg-gray-900 p-6 shadow-xl">
        <nav className="mt-6 space-y-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={classNames(
                location.pathname === item.path ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white",
                "flex items-center gap-x-4 rounded-md p-3 text-sm font-semibold"
              )}
            >
              <FontAwesomeIcon icon={item.icon} className="h-5 w-5" aria-hidden="true" />
              {item.name}
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-x-4 text-left p-3 text-sm font-semibold text-gray-400 hover:bg-gray-800 hover:text-white rounded-md"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="h-5 w-5" aria-hidden="true" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {/* Mobile Top Bar */}
        <div className="sticky top-0 z-40 flex items-center justify-between bg-gray-900 px-5 py-4 shadow-md lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <FontAwesomeIcon icon={faBars} className="h-6 w-6" aria-hidden="true" />
          </button>
          <h1 className="text-lg font-semibold text-white cursor-pointer" onClick={() => navigate("/")}>
            User Dashboard
          </h1>
        </div>

        {/* Scrollable Content */}
        <main className="flex-grow overflow-y-auto bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-4xl mx-auto">
            <Outlet /> {/* Renders the selected page here */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;
