import React from "react";
import { Outlet } from "react-router-dom";
import DashSidebar from "./DashSidebar";
import DashHeader from "./DashHeader";
import { userAuth } from "../../../assets/Auth/userAuth";

const DashBoard = () => {
  const { user } = userAuth();
  const userName = user?.name || "Guest";
  // const getCart = JSON.parse(localStorage.getItem("product")) || [];
  // const totalSales = getCart.reduce((sum, item) => sum + item.price, 0);
  // console.log(totalSales);
  const getCart = JSON.parse(localStorage.getItem("product")) || [];
  const orders = getCart.length;
  const totalCount = getCart.reduce((sum, item) => sum + (item.count || 1), 0);
  const products = totalCount * orders;
  const totalSales = getCart.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0
  );
  return (
    <div className="min-h-screen bg-[var(--color-primary-light)] w-full lg:w-[90%] xl:w-[80%] mx-auto text-textMain px-4 sm:px-6 py-6 md:p-8">
      {/* Welcome Header */}
      <header className="mb-6 md:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          Dashboard
        </h1>
        <p className="text-textMuted mt-1 sm:mt-2">
          Welcome back, {userName} ✨
        </p>
      </header>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 md:mb-10">
        <div className="bg-[var(--color-primary-dark)] text-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all">
          <h3 className="text-base sm:text-lg font-semibold text-accent-light">
            Total Sales
          </h3>
          <p className="text-xl sm:text-2xl mt-1 sm:mt-2 font-bold">
            $ {totalSales}
          </p>
        </div>
        <div className="bg-[var(--color-accent)] p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all">
          <h3 className="text-base sm:text-lg font-semibold text-white">
            Orders
          </h3>
          <p className="text-xl sm:text-2xl mt-1 sm:mt-2 font-bold">{orders}</p>
        </div>
        <div className="bg-[var(--color-neutral-dark)] text-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all">
          <h3 className="text-base sm:text-lg font-semibold text-accent-light">
            Products
          </h3>
          <p className="text-xl sm:text-2xl mt-1 sm:mt-2 font-bold">
            {products}
          </p>
        </div>
        <div className="bg-[var(--color-primary)] p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all">
          <h3 className="text-base sm:text-lg font-semibold text-white">
            Users
          </h3>
          <p className="text-xl sm:text-2xl mt-1 sm:mt-2 font-bold">
            312 still static
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 rounded-2xl">
        <div className="lg:hidden">
          <DashHeader mobile />
        </div>

        {/* Sidebar - Hidden on mobile by default (you might want a mobile menu toggle) */}
        <div className="hidden lg:block w-full lg:w-64 xl:w-72 shrink-0">
          <DashSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
          <div className="hidden lg:block">
            <DashHeader />
          </div>
          <main className="p-4 sm:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
