import React, { useEffect, useState, Fragment } from "react";
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
  faFileAlt,
  faUsers,
  faBox,
} from "@fortawesome/free-solid-svg-icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProfileLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    navigate("/authpopup");
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/authpopup");
      return;
    }

    axios
      .get(`http://localhost:5174/api/profile/get/${userId}`, {
        headers: { userid: userId },
      })
      .then((response) => {
        if (response.data.success) {
          const userData = response.data.data;
          console.log("Fetched user data:", userData);
          if (userData.role === "admin" || userData.role === "user") {
            setRole(userData.role);
          } else {
            console.warn("Invalid role detected");
            navigate("/authpopup");
          }
        } else {
          console.warn("API responded with success: false");
          navigate("/authpopup");
        }
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        navigate("/authpopup");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const adminNavigation = [
    { name: "Home", path: "/", icon: faHome },
    { name: "Profile", path: "/profile", icon: faUser },
    { name: "Dashboard", path: "/profile/adminHome", icon: faHome },
    { name: "Products", path: "/profile/productController", icon: faBox },
    { name: "Users", path: "/profile/userController", icon: faUsers },
    { name: "Expired", path: "/profile/expireUser", icon: faClipboardList },
  ];
  

  const userNavigation = [
    { name: "Home", path: "/", icon: faHome },
    { name: "Profile", path: "/profile", icon: faUser },
    { name: "Cart", path: "/profile/cart", icon: faCartShopping },
    { name: "OrderHistory", path: "/profile/orderHistory", icon: faClipboardList },
  ];

  const navigation = role === "admin" ? adminNavigation : userNavigation;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Mobile Sidebar */}
      <Transition show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" open={sidebarOpen} onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
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
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex flex-col w-64 bg-gray-900 p-6 shadow-xl">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <FontAwesomeIcon icon={faXmark} className="h-6 w-6" aria-hidden="true" />
                </button>

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

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-x-4 text-left p-3 text-sm font-semibold text-gray-400 hover:bg-gray-800 hover:text-white rounded-md"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="h-5 w-5" aria-hidden="true" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-900">
        <div className="sticky top-0 z-40 flex items-center justify-between bg-gray-900 px-5 py-4 shadow-md lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <FontAwesomeIcon icon={faBars} className="h-6 w-6" aria-hidden="true" />
          </button>
          <h1 className="text-lg font-semibold text-white cursor-pointer" onClick={() => navigate("/")}>
            {role === "admin" ? "Admin Dashboard" : "User Dashboard"}
          </h1>
        </div>

        <main className="flex-grow overflow-y-auto bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-4xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;
