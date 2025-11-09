import { useEffect, useMemo, useState } from "react";
import { Axios } from "../../../assets/Auth/Axios";
import { PRODS } from "../../../assets/Auth/authPaths";
import { Pagination } from "flowbite-react";
import PaginatedItems from "../../pagination/Pagination";

const ProductGallery = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [pageCounter, setPageCounter] = useState(1);
  //
  useEffect(() => {
    const getProducts = async () => {
      const res = await Axios.get(`${PRODS}`);
      setProducts(res.data);
      setFilteredProducts(res.data);
      console.log(res.data);
    };
    getProducts();
  }, []);

  const category = products.map((item) => item.category);

  const paginateData = useMemo(() => {
    const startIndex = (pageCounter - 1) * itemsPerPage;
    const lastIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, lastIndex);
  }, [filteredProducts, pageCounter, itemsPerPage]);

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log(e.target.value);
    console.log(search);
  };
  const handleSelection = async (e) => {
    setSelectedCategory(e.target.value);
  };
  console.log(search);

  useEffect(() => {
    let result = [...products];
    if (search) {
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase())
      );

      if (selectedCategory !== "all") {
        result = result.filter((item) => item.category === selectedCategory);
      }
    }

    setFilteredProducts(result);
    setPageCounter(1);
  }, [search]);

  return (
    <div className="product-container grid grid-cols-12 gap-6 p-6">
      {/* Sidebar */}
      <div className="sidebar col-span-12 md:col-span-3 bg-white shadow-md rounded-xl p-4 space-y-6">
        {/* Search */}
        <div className="search space-y-2">
          <form
            action=""
            onSubmit={handleSearch}
            className="flex flex-col space-y-3"
          >
            <label
              className="text-sm font-semibold text-gray-700"
              htmlFor="search"
            >
              Search For Product
            </label>
            <input
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="search"
              name="search"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter product name..."
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
          </form>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Category
          </label>
          <select
            onChange={handleSelection}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {category.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price Sorting (example placeholder) */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Price Filter
          </label>
          <input
            type="number"
            placeholder="Enter max price"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="ContentArea col-span-12 md:col-span-9">
        <div className="products-box grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paginateData.map((prod) => (
            <div
              key={prod.id}
              className="product-card bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
            >
              {prod.images[0] && (
                <img
                  src={prod.images[0]?.image}
                  alt={prod.title}
                  className="w-full h-40 object-cover rounded-lg mb-3 cursor-pointer"
                />
              )}
              <h3 className="text-sm font-semibold text-gray-800">
                {prod.title}
              </h3>
              <p className="text-green-600 bold self-end ">{prod.price}$ </p>
              <p className="text-red-600 bold self-end no-underline">
                {prod.discount}${" "}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="col-span-12 mt-10 flex justify-center">
          <PaginatedItems
            itemsPerPage={itemsPerPage}
            pageCounter={pageCounter}
            totalItems={filteredProducts.length}
            setPageCounter={setPageCounter}
          />
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
