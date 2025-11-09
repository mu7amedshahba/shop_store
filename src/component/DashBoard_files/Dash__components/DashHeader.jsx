import React from 'react';

const DashHeader = () => {
  return (
    <header className="w-full bg-[var(--color-primary)] shadow-sm py-4 px-6 flex items-center justify-between">
      <h1 className="text-xl font-bold text-primary">Dashboard Overview</h1>
      <div className="flex items-center gap-4">
        <button className="px-3 py-1 rounded bg-[var(--color-accent)] opacity-80 hover:opacity-100 text-white text-sm">Admin</button>
        <button className="px-3 py-1 rounded bg-red-500 hover:bg-red-400 text-white text-sm">Logout</button>
      </div>
    </header>
  );
};

export default DashHeader;
