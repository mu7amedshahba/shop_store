import { useState, useCallback } from "react";
import productsData from "../DateBase_files/book_products.json";
import { CAT, Prod, PRODS } from "./../../assets/Auth/authPaths";
import { Axios } from "./../../assets/Auth/Axios";

const useProductsAuth = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [singleProduct, setSingleProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Fetch all products from API.
   * If API fails or returns empty → use local JSON.
   */
  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await Axios.get(PRODS);
      const apiProducts = Array.isArray(res.data) ? res.data : [];

      if (apiProducts.length > 0) {
        setProducts(apiProducts);
      } else {
        // API returned empty → fallback
        setProducts(productsData);
        setError("API returned empty products list. Using local data.");
      }
    } catch (err) {
      setProducts(productsData);
      setError("Failed to load products from API. Using local data.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch all categories from API.
   * If it fails → just keep it empty (page can still work).
   */
  const getCategory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await Axios.get(CAT);
      const apiCategories = Array.isArray(res.data) ? res.data : [];
      setCategory(apiCategories);
    } catch (err) {
      setCategory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single product.
   * If API fails → try to find it in local JSON.
   */
  const getSingleProduct = useCallback(async (id) => {
    if (!id) {
      setError("No product ID provided");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSingleProduct(null);

      console.log("Fetching product with ID:", id);
      const res = await Axios.get(`${Prod}/${id}`);
      console.log("API Response:", res.data);

      let productData = null;

      // Handle different API response structures
      if (Array.isArray(res.data) && res.data.length > 0) {
        // Response is an array with the product
        productData = res.data[0];
      } else if (res.data && typeof res.data === "object") {
        // Response is a single product object
        productData = res.data;
      } else if (res.data?.data) {
        // Response has data property (common in Laravel)
        productData = Array.isArray(res.data.data)
          ? res.data.data[0]
          : res.data.data;
      }

      if (productData) {
        setSingleProduct(productData);
        console.log("Product set from API:", productData);
      } else {
        throw new Error("Invalid product data structure from API");
      }
    } catch (err) {
      console.error("getSingleProduct API error:", err);

      // Try to find in local data
      const localMatch = productsData.find(
        (item) => String(item.id) === String(id)
      );

      if (localMatch) {
        setSingleProduct(localMatch);
        setError("Failed to load product from API. Using local product data.");
        console.log("Using local product:", localMatch);
      } else {
        setSingleProduct(null);
        setError(`Product with ID "${id}" not found in API or local data.`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error manually
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    products,
    category,
    singleProduct,
    error,
    loading,
    getProducts,
    getCategory,
    getSingleProduct,
    clearError,
  };
};

export default useProductsAuth;
