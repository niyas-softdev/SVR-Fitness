import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import logo from "../../assets/vr Fitness transparent Gym Logo.png";
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
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
            role: decoded.role,
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
  }, [dispatch, navigate, userId]);

  const handleLogout = () => {
    sessionStorage.removeItem("userToken");
    localStorage.removeItem("userId"); // ← clear this too if you're using it elsewhere
    setIsLoggedIn(false);
    navigate("/authpopup");
  };
  

  return (
    <Disclosure as="nav" className="sticky top-0 z-50 bg-gray-900 shadow-lg border-b border-gray-700">
      {({ open }) => (
        <>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <img className="h-10 w-10 rounded-full" src={logo} alt="Logo" />
              </div>
              <div className="hidden sm:flex space-x-8">
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
                <Link to="/workoutPlan" className="text-gray-300 hover:text-white">Training</Link>
                <Link to="/productPage" className="text-gray-300 hover:text-white">Product</Link>
                <Link to="/membership" className="text-gray-300 hover:text-white">Membership</Link>

               
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/cart" className="relative">
                  <ShoppingCartIcon className="h-6 w-6 text-gray-400 hover:text-white" />
                  {isLoggedIn && cartCount > 0 && (
  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
    {cartCount}
  </span>
)}

                </Link>
                {isLoggedIn ? (
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex rounded-full focus:ring-2 focus:ring-white">
                      <img className="h-8 w-8 rounded-full" src={user?.image} alt="User Profile" />
                    </Menu.Button>
                    <Transition
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link to="/profile" className={`${active ? "bg-gray-700" : ""} block px-4 py-2 text-sm`}>Profile</Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${active ? "bg-gray-700" : ""} block w-full text-left px-4 py-2 text-sm`}
                            >Logout</button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <Link to="/authpopup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500">Login</Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}

export default AppNavbar;
