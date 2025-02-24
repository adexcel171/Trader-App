import React, { useState, useEffect } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import { FaHeart, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";
import { Laptop } from "lucide-react";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
      if (dropdownOpen || isMobileMenuOpen) {
        setDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dropdownOpen, isMobileMenuOpen]);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg" : "bg-white/95 "
      }`}
    >
      {/* Desktop Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-[16px] font-bold group"
          >
            <Laptop className="mr-1 text-purple-600" />
            <span className="text-gray-800">
              SHOPBUGIE
              <span className="inline-block w-2 h-2 bg-purple-600 rounded-full ml-1 group-hover:bg-blue-500 transition-colors"></span>
            </span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <AiOutlineHome className="mr-1" />
              Home
            </Link>
            <Link
              to="/shop"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <AiOutlineShopping className="mr-1" />
              Shop
            </Link>
            <Link
              to="/favorite"
              className="flex items-center text-gray-600 hover:text-blue-600 relative"
            >
              <FavoritesCount />
              <FaHeart className="mr-1" />
            </Link>
            <Link
              to="/cart"
              className="flex items-center text-gray-600 hover:text-blue-600 relative"
            >
              <AiOutlineShoppingCart className="mr-1" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <AiOutlineUser />
                  <span className="text-purple-500">{userInfo.username}</span>
                  <FaChevronDown className="text-sm mt-0.5" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border">
                    <div className="p-2 space-y-1">
                      {userInfo.isAdmin && (
                        <>
                          <Link
                            to="/admin/dashboard"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                          >
                            Dashboard
                          </Link>
                          <Link
                            to="/admin/productlist"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                          >
                            Products
                          </Link>
                          <Link
                            to="/admin/orderlist"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                          >
                            Orders
                          </Link>
                        </>
                      )}
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={logoutHandler}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation Icons (Add to Cart and Favorites) */}
          <div className="md:hidden flex items-center space-x-4">
            <Link
              to="/favorite"
              className="flex items-center text-gray-600 hover:text-blue-600 relative"
            >
              <FavoritesCount />
              <FaHeart className="mr-1" />
            </Link>
            <Link
              to="/cart"
              className="flex items-center text-gray-600 hover:text-blue-600 relative"
            >
              <AiOutlineShoppingCart className="mr-1" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600"
          >
            {isMobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-black/75 z-40 transition-opacity ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`absolute right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-gray-800">SHOPBUGIE</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <AiOutlineClose />
              </button>
            </div>
            {userInfo ? (
              <div className="flex items-center space-x-2 text-gray-700">
                <AiOutlineUser className="text-gray-600" />
                <span className="text-blue-600 font-medium">
                  {userInfo.username}
                </span>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="flex-1 text-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          {/* Navigation Items */}
          <nav className="p-4 space-y-2">
            <div className="flex flex-col justify-end h-full">
              <Link
                to="/"
                className="block p-2 text-right text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="block p-2 text-right text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Shop
              </Link>
              <Link
                to="/favorite"
                className="block p-2 text-right text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Favorites
              </Link>
              <Link
                to="/cart"
                className="block p-2 text-right text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cart ({cartItems.reduce((a, c) => a + c.qty, 0)})
              </Link>

              {userInfo?.isAdmin && (
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-600 px-2 py-1 text-right">
                    Admin
                  </div>
                  <Link
                    to="/admin/dashboard"
                    className="block p-2 text-right text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/productlist"
                    className="block p-2 text-right text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Products
                  </Link>
                  <Link
                    to="/admin/orderlist"
                    className="block p-2 text-right text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Orders
                  </Link>
                </div>
              )}

              {userInfo && (
                <button
                  onClick={logoutHandler}
                  className="w-full text-right p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
