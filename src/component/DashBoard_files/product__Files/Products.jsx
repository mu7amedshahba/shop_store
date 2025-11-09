import { useEffect, useState, useRef } from "react";
import { Axios } from "../../../assets/Auth/Axios";
import { PRODS } from "../../../assets/Auth/authPaths";
import TableContent from "../../UI/ReUsable/TableContent";

const ProductData = () => {
  const headers = [
    { key: "id", header: "ID" },
    { key: "category", header: "Category" },
    { key: "images", header: "Images" },
    { key: "title", header: "Title" },
    { key: "description", header: "Description" },
    { key: "price", header: "Price" },
    { key: "action", header: "Action" },
  ];

  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageCount, setPageCounter] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(8);
  
  // Add ref to track if data has been fetched
  const hasFetched = useRef(false);

  const transformProductData = (data) => {
    return data.map(product => ({
      ...product,
      category: product.category?.title || product.category || "N/A",
      images: product.images || [],
      price: product.price ? `$${parseFloat(product.price).toFixed(2)}` : "$0.00",
      description: product.description ? 
        (product.description.length > 50 ? 
          `${product.description.substring(0, 50)}...` : 
          product.description) : 
        "No description",
      title: product.title || "No title"
    }));
  };

  useEffect(() => {
    // Prevent multiple fetches
    if (hasFetched.current) return;
    
    const getProducts = async () => {
      setLoading(true);
      hasFetched.current = true; // Mark as fetched
      
      try {
        const res = await Axios.get(`${PRODS}`);
        console.log("Raw API response:", res.data);
        
        const transformedData = transformProductData(res.data);
        setProductData(transformedData);
      } catch (error) {
        setError(error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    
    getProducts();
  }, []); // Empty dependency array - fetch only once

  console.log("ProductData render count"); // Debug log

  return (
    <div className="">
      <TableContent
        usersData={productData}
        headers={headers}
        loading={loading}
        errorMessage={error}
        entityName="products"
        pageCount={pageCount}
        setPageCounter={setPageCounter}
        itemPerPage={itemPerPage}
        setItemPerPage={setItemPerPage}
      />
    </div>
  );
};

export default ProductData;