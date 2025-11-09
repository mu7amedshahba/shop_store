import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "flowbite-react";
import { roleMap } from "../../../assets/Auth/authPaths";
import { Link } from "react-router-dom";
import {
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiChevronDown,
  FiFrown,
  FiFilter,
  FiImage,
} from "react-icons/fi";
import PaginatedItems from "../../pagination/Pagination";

const TableContent = ({
  usersData,
  headers,
  loading,
  errorMessage,
  entityName = "",
  pageCount,
  setPageCounter,
  itemPerPage,
  setItemPerPage,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("title");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // REPLACE useEffect with useMemo - This prevents the infinite loop
  const filteredProducts = useMemo(() => {
    let result = [...usersData];

    // Search filter
    if (searchTerm) {
      result = result.filter((item) => {
        const searchValue = item[filterType]?.toString().toLowerCase() || "";
        return searchValue.includes(searchTerm.toLowerCase());
      });
    }

    // Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [filterType, searchTerm, usersData, sortConfig]); // Same dependencies

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const paginationData = useMemo(() => {
    const startIndex = (pageCount - 1) * itemPerPage;
    const lastIndex = startIndex + itemPerPage;
    return filteredProducts.slice(startIndex, lastIndex);
  }, [pageCount, itemPerPage, filteredProducts]);

  const handleDelete = (id) => {
    console.log("Delete item with id:", id);
    // Add your delete logic here
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to render table cell content based on header key
  const renderCellContent = (item, headerKey) => {
    const value = item[headerKey];
    
    switch (headerKey) {
      case "id":
        return (
          <span className="font-mono text-sm text-gray-600">
            {value || "N/A"}
          </span>
        );
      
      case "category":
        return value || "N/A";
      
      case "images":
        // Handle images array
        if (Array.isArray(value) && value.length > 0) {
          return (
            <div className="flex justify-center space-x-1">
              {value.slice(0, 3).map((img, index) => (
                <motion.div
                  key={img.id || index}
                  whileHover={{ scale: 1.1 }}
                  className="relative w-10 h-10 rounded border border-gray-200 overflow-hidden"
                >
                  <img
                    src={img.image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMyAxNkwxNiAxOUwxOSAxNkgxOVoiIGZpbGw9IiM5Q0EwQUQiLz4KPHBhdGggZD0iTTEzIDE2TDE2IDE5TDE5IDE2SDE5WiIgc3Ryb2tlPSIjOUNBMEFEIiBzdHJva2Utd2lkdGg9IjIiLz4KPHBhdGggZD0iTTI4IDI0SDI2VjMxSDI4VjI0WiIgZmlsbD0iIzlDQTBBRCIvPgo8L3N2Zz4K';
                    }}
                  />
                </motion.div>
              ))}
              {value.length > 3 && (
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-10 h-10 bg-blue-100 rounded border border-blue-200 flex items-center justify-center"
                >
                  <span className="text-xs font-medium text-blue-600">
                    +{value.length - 3}
                  </span>
                </motion.div>
              )}
            </div>
          );
        } else {
          return (
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                <FiImage className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          );
        }
      
      case "title":
        return (
          <span className="font-medium text-gray-900">
            {value || "No title"}
          </span>
        );
      
      case "description":
        return value ? (
          <div className="max-w-xs text-sm text-gray-600">
            {value.length > 60 ? `${value.substring(0, 60)}...` : value}
          </div>
        ) : (
          <span className="text-sm text-gray-400">No description</span>
        );
      
      case "price":
        return (
          <span className="font-semibold text-green-700">
            {value || "$0.00"}
          </span>
        );
      
      case "role":
        return value ? (
          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {roleMap[value] || value}
          </span>
        ) : (
          "N/A"
        );
      
      case "action":
        return (
          <div className="flex justify-center space-x-2">
            <Link
              to={`/dashboard/${entityName}/edit/${item.id}`}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <FiEdit2 className="w-4 h-4" />
            </Link>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDelete(item.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
            </motion.button>
          </div>
        );
      
      default:
        return value?.toString() || "N/A";
    }
  };

  const showUserData = paginationData.map((item, index) => (
    <motion.tr
      key={item.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="hover:bg-gray-50 transition-colors border-b border-gray-200"
    >
      {headers.map((header) => (
        <td
          key={`${item.id}-${header.key}`}
          className="px-4 py-3 text-center align-middle"
        >
          {renderCellContent(item, header.key)}
        </td>
      ))}
    </motion.tr>
  ));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner aria-label="Loading data" size="xl" />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
      >
        {errorMessage}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white"
    >
      {/* Search and Filter Controls */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearch}
              placeholder={`Search ${entityName}...`}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="w-full md:w-48 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white appearance-none"
            >
              <option value="title">Title</option>
              <option value="description">Description</option>
              <option value="category">Category</option>
              <option value="price">Price</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FiChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Items Per Page */}
          <div className="w-full md:w-48 relative">
            <select
              value={itemPerPage}
              onChange={(e) => setItemPerPage(Number(e.target.value))}
              className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              <option value="4">4 per page</option>
              <option value="8">8 per page</option>
              <option value="12">12 per page</option>
              <option value="16">16 per page</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FiChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((item) => (
                <th
                  key={item.key}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => requestSort(item.key)}
                >
                  <div className="flex items-center justify-center">
                    {item.header}
                    {sortConfig.key === item.key && (
                      <span className="ml-1 text-xs">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {showUserData.length > 0 ? (
                showUserData
              ) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td
                    colSpan={headers.length}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <FiFrown className="w-12 h-12 text-gray-400" />
                      <p className="mt-2 text-sm font-medium">
                        No products found
                      </p>
                      <p className="text-xs text-gray-400">
                        {searchTerm
                          ? "No results match your search"
                          : "Try adjusting your search or filter"}
                      </p>
                    </div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <PaginatedItems
          itemsPerPage={itemPerPage}
          pageCounter={pageCount || 1}
          totalItems={filteredProducts.length}
          setPageCounter={setPageCounter}
          setItemPerPage={setItemPerPage}
        />
      </div>
    </motion.div>
  );
};

export default TableContent;