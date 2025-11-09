import { useState } from "react";
import { CAT, PRODS, Prod } from "../../assets/Auth/authPaths";
import { Axios } from "../../assets/Auth/Axios";
import productsData from "../DateBase_files/book_products.json";
// useCustom Hook
const useProductsAuth = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [singleProduct, setSingleProduct] = useState(null);
  const [error, setError] = useState(null);

  const getProducts = async () => {
    try {
      const res = await Axios.get(PRODS);
      console.log("Fetched products:", res.data);

      if (Array.isArray(res.data) && res.data.length > 0) {
        setProducts(res.data);
      } else {
        setProducts(productsData);
        console.log("Using local products");
      }
      setError(null);
    } catch (err) {
      console.error("getProducts error:", err);
      setProducts(productsData); // fallback local data
      setError(err.message);
    }
  };

  const getCategory = async () => {
    try {
      const res = await Axios.get(CAT);
      console.log("Fetched categories:", res.data);
      setCategory(res.data);
      setError(null);
    } catch (err) {
      console.error("getCategory error:", err);
      setError(err.message);
    }
  };

  const getSingleProduct = async (id) => {
    try {
      const res = await Axios.get(`${Prod}/${id}`);
      setSingleProduct(res.data);
      setError(null);
    } catch (err) {
      console.error("getSingleProduct error:", err);
      setError(err.message);
    }
  };

  return {
    products,
    category,
    singleProduct,
    error,
    getProducts,
    getCategory,
    getSingleProduct,
  };
};

export default useProductsAuth;
