import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBookOpen,
  FaUser,
  FaShoppingCart,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaBookmark,
} from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import logo from "../../../../assets/images/1.png";
import { userAuth } from "../../../../assets/Auth/userAuth";
import { Axios } from "../../../../assets/Auth/Axios";
import { JWT_TOKEN, USER } from "../../../../assets/Auth/authPaths";
import { useCart } from "../CartContext";
import CartPage from "../../ReUsable/payments/CartPage";

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // no loading screen
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [errorMessage, setError] = useState(null);
  const cartRef = useRef(null);

  const { cartItems } = useCart();
  const { logOut } = userAuth();

  // sticky nav
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // close cart on outside click
  useEffect(() => {
    const handleClose = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, []);

  // fetch user ONLY if we have token
  useEffect(() => {

    (async () => {
      try {
        const res = await Axios.get(USER);
        setUser(res.data);
      } catch (err) {
        // لو التوكن باظ أو انتهى خلاص تجاهل
        setError(err.response?.data?.message || err.message);
        setUser(null);
      }
    })();
  }, []);

  // build nav links based on user
  const navLinks = useMemo(() => {
    const baseLinks = [
      { name: "Home", url: "/", icon: <FaBookOpen className="mr-2" /> },
      { name: "About", url: "/about", icon: <FaUser className="mr-2" /> },
      {
        name: "Products",
        url: "/all-products",
        icon: <GiBookshelf className="mr-2" />,
      },
    ];

    // admin / user with dashboard
    const userRole = user?.role?.toString(); // in case it comes as number
    if (userRole === "1995") {
      baseLinks.push({
        name: "Dashboard",
        url: "/dashboard",
        icon: <FaBookmark className="mr-2" />,
      });
    }

    return baseLinks;
  }, [user]);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      setError(error.message);
    } finally {
      // سواء نجحت أو لأ هنفضي الواجهة
      setUser(null);
      setMenuOpen(false);
    }
  };

  const cartItemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  return (
    <motion.header
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full transition-all duration-300 fixed top-0 z-50 ${
        scrolled
          ? "bg-[var(--color-primary-lightest)]/95 backdrop-blur-sm shadow-md"
          : "bg-[var(--color-primary-lightest)]"
      }`}
      style={{ borderBottom: "1px solid var(--color-primary-light)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 flex items-center"
          >
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-10 rounded-full border-2 border-[var(--color-primary-dark)]"
              />
              <span
                className="text-xl font-bold"
                style={{ color: "var(--color-primary-dark)" }}
              >
                eBook Haven
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.map(({ name, url, icon }) => {
                const isActive = location.pathname === url;
                return (
                  <Link
                    key={url}
                    to={url}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-all ${
                      isActive
                        ? "bg-[var(--color-accent-light)] text-[var(--color-accent-darkest)]"
                        : "text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary-darkest)]"
                    }`}
                  >
                    {icon}
                    {name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <div className="relative" ref={cartRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen((p) => !p)}
                className="p-2 rounded-full relative"
                style={{
                  backgroundColor: "var(--color-primary-light)",
                  color: "var(--color-primary-dark)",
                }}
                aria-label="Cart"
              >
                <FaShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-[var(--color-accent)] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </motion.button>

              <AnimatePresence>
                {isCartOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 z-50 origin-top-right rounded-md shadow-lg"
                    style={{
                      backgroundColor: "var(--color-primary-lightest)",
                      border: "1px solid var(--color-primary-light)",
                    }}
                  >
                    <CartPage setIsCartOpen={setIsCartOpen} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                  style={{
                    backgroundColor: "var(--color-accent-dark)",
                    color: "var(--color-neutral-lightest)",
                  }}
                >
                  <FaSignOutAlt />
                  Logout
                </motion.button>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/sign-in"
                      className="px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                      style={{
                        backgroundColor: "var(--color-accent)",
                        color: "var(--color-neutral-lightest)",
                      }}
                    >
                      <FaSignInAlt />
                      Sign In
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/sign-up"
                      className="px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                      style={{
                        backgroundColor: "var(--color-primary-dark)",
                        color: "var(--color-neutral-lightest)",
                      }}
                    >
                      <FaUserPlus />
                      Sign Up
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMenuOpen((p) => !p)}
                className="p-2 rounded-md"
                style={{ color: "var(--color-primary-dark)" }}
                aria-label="Menu"
              >
                {menuOpen ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenuAlt3 className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
            style={{
              backgroundColor: "var(--color-primary-lightest)",
              borderTop: "1px solid var(--color-primary-light)",
            }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map(({ name, url, icon }) => (
                <Link
                  key={url}
                  to={url}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                    location.pathname === url
                      ? "bg-[var(--color-accent-light)] text-[var(--color-accent-darkest)]"
                      : "text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-light)]"
                  }`}
                >
                  {icon}
                  {name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-[var(--color-primary-light)] px-2">
              {user ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-2 rounded-md text-base font-medium gap-2"
                  style={{
                    backgroundColor: "var(--color-accent-dark)",
                    color: "var(--color-neutral-lightest)",
                  }}
                >
                  <FaSignOutAlt />
                  Logout
                </motion.button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/sign-in"
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center justify-center px-4 py-2 rounded-md text-base font-medium gap-2"
                      style={{
                        backgroundColor: "var(--color-accent)",
                        color: "var(--color-neutral-lightest)",
                      }}
                    >
                      <FaSignInAlt />
                      Sign In
                    </Link>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/sign-up"
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center justify-center px-4 py-2 rounded-md text-base font-medium gap-2"
                      style={{
                        backgroundColor: "var(--color-primary-dark)",
                        color: "var(--color-neutral-lightest)",
                      }}
                    >
                      <FaUserPlus />
                      Sign Up
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
