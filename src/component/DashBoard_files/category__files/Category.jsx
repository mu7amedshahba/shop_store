import React, { useEffect, useState } from "react";
import { Axios } from "../../../assets/Auth/Axios";
import { CAT } from "../../../assets/Auth/authPaths";
import TableContent from "./../../UI/ReUsable/TableContent";
import { motion } from "framer-motion";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import SpinnerLoad from "../../UI/ReUsable/SpinnerLoad/SpinnerLoad";

const Category = () => {
  const headers = [
    { key: "id", header: "ID" },
    { key: "title", header: "Category Name" },
    { key: "image", header: "Image" },
    { key: "actions", header: "Actions" },
  ];

  const [category, setCategory] = useState([]);
  const [pageCount, setPageCounter] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(8);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await Axios.get(`${CAT}`);
      setCategory(res.data);
      console.log(res.data)
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  //
  useEffect(() => {
    fetchCategories();
  }, []);
  //
  const handleRefresh = () => {
    setRefreshing(true);
    fetchCategories();
  };
  //
  const handleAddCategory = () => {
    navigate("/dashboard/categories/add");
  };
  //
  if (loading && !refreshing) return <SpinnerLoad />;
  //
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-primary-dark)]">
          Categories
        </h1>
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-white border border-[var(--color-primary-light)] rounded-lg text-[var(--color-primary)] hover:bg-[var(--color-primary-lightest)] transition-colors"
            disabled={refreshing}
          >
            <FiRefreshCw
              className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddCategory}
            className="flex items-center px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-dark)] transition-colors"
          >
            <FiPlus className="mr-2" />
            Add Category
          </motion.button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded"
        >
          <p>{error}</p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <TableContent
          usersData={category}
          headers={headers}
          loading={refreshing}
          errorMessage={error}
          entityName="categories"
          pageCount={pageCount}
          setPageCounter={setPageCounter}
          itemPerPage={itemPerPage}
          setItemPerPage={setItemPerPage}
        />
      </motion.div>
    </motion.div>
  );
};

export default Category;
