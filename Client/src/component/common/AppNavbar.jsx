import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate, Link } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import logo from "../../assets/vr Fitness transparent Gym Logo.png";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  ShoppingCartIcon
} from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";
import { fetchCartCount } from "../Redux/cart/cartAction";
function AppNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const cartCount = useSelector((state) => state.cart.cartCount);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const userToken = sessionStorage.getItem("userToken");
    if (userToken) {
      try {
        const decoded = jwtDecode(userToken);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp < currentTime) {
          sessionStorage.removeItem("userToken");
          setIsLoggedIn(false);
          navigate("/login");
        } else {
          setUser({
            id: decoded.userId,
            name: decoded.name,
            email: decoded.email,
            image: decoded.image,
            role: decoded.role
          });
          setIsLoggedIn(true);
          dispatch(fetchCartCount(userId));
        }
      } catch (error) {
        console.error("Invalid token:", error);
        sessionStorage.removeItem("userToken");
        navigate("/login");
      }
    }
  }, [dispatch, navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("userToken");
    setIsLoggedIn(false);
    navigate("/authpopup");
  };

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/70 shadow-lg border-b border-gray-700"
    >
      {({ open }) => (
        <>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile Menu Button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Logo and Desktop Links */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full object-cover shadow-lg"
                    src={logo}
                    alt="Company Logo"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
                  <Link
                    to="/"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
                  >
                    Home
                  </Link>
                  <Link
                    to="/workoutPlan"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
                  >
                    Training
                  </Link>
                  <Link
                    to="/productPage"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
                  >
                    Product
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-400 hover:text-indigo-300"
                    >
                      Dashboard
                    </Link>
                  )}
                </div>
              </div>

              {/* Profile, Cart, and Login/Logout */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Cart Icon */}
                <Link to="/cart" className="relative ml-4">
                  <ShoppingCartIcon className="h-6 w-6 text-gray-400 hover:text-white transition-colors duration-300" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-2/4 -translate-y-1/2 bg-red-600 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {isLoggedIn ? (
                  <div className="ml-3 flex items-center space-x-4">
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
                    >
                      Logout
                    </button>
                    <Menu as="div" className="relative">
                      <div>
                        <Menu.Button className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-white">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={user?.image}
                            alt="User profile"
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/profile"
                                className={`${
                                  active ? "bg-gray-700" : ""
                                } block px-4 py-2 text-sm`}
                              >
                                Profile
                              </Link>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                ) : (
                  <Link to="/authpopup">
                    <button className="ml-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500">
                      Login
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Disclosure.Button
                as={Link}
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Home
              </Disclosure.Button>
              <Disclosure.Button
                as={Link}
                to="/workoutPlan"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Training
              </Disclosure.Button>
              <Disclosure.Button
                as={Link}
                to="/productPage"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Product
              </Disclosure.Button>
              {user?.role === "admin" && (
                <Disclosure.Button
                  as={Link}
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-indigo-400 hover:text-indigo-300"
                >
                  Dashboard
                </Disclosure.Button>
              )}
              {/* Mobile Cart Link */}
              <Disclosure.Button
                as={Link}
                to="/cart"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Cart
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default AppNavbar;
