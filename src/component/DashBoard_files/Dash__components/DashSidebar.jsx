import React from "react";
import { Link, useLocation } from "react-router-dom";

const DashSidebar = () => {
    const location = useLocation();
    //
    const links = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Users", path: "/dashboard/users-data" },
        { name: "Add User", path: "/dashboard/add-user" },
        { name: "Products", path: "/dashboard/products" },
        { name: "Add Products", path: "/dashboard/add-product" },
        { name: "Category", path: "/dashboard/Category" },
        { name: "Add Category", path: "/dashboard/add-category" },
        { name: "Orders", path: "/dashboard/orders" },
        { name: "Settings", path: "/dashboard/settings" },
    ];
    //
    return (
        <aside className="w-64 bg-[var(--color-accent)] rounded  text-white flex flex-col p-6 space-y-4 shadow-md">
            <h2 className="text-2xl font-bold text-center mb-8">Admin Panel</h2>
            <nav className="flex flex-col gap-4">
                {links.map(({ name, path }) => (
                    <Link
                        key={path}
                        to={path}
                        className={`px-4 py-2 rounded text-center transition-all border border-[var(--color-accent-dark)]  ${location.pathname === path
                            ? "bg-primary text-[var(--color-accent-light)] bg-[var(--color-accent-dark)]  font-semibold"
                            : "hover:bg-[var(--color-accent-dark)]"
                            }`}
                    >
                        {name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default DashSidebar;
