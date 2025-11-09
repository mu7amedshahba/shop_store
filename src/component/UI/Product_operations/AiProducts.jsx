// App.jsx
import { useState, useEffect } from 'react'

function AiProducts() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState(100)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 8

  // Mock product data
  useEffect(() => {
    const mockProducts = [
      { id: 1, title: 'Wireless Headphones', price: 89.99, category: 'electronics', images: [{ image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }] },
      { id: 2, title: 'Classic White T-Shirt', price: 24.99, category: 'clothing', images: [{ image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }] },
      { id: 3, title: 'Smart Watch', price: 199.99, category: 'electronics', images: [{ image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }] },
      { id: 4, title: 'Leather Wallet', price: 45.99, category: 'accessories', images: [{ image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }] },
      { id: 5, title: 'Running Shoes', price: 79.99, category: 'footwear', images: [{ image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }] },
      { id: 6, title: 'Coffee Mug', price: 12.99, category: 'home', images: [{ image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }] },
      { id: 7, title: 'Backpack', price: 59.99, category: 'accessories', images: [{ image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }] },
      { id: 8, title: 'Desk Lamp', price: 34.99, category: 'home', images: [{ image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }] },
      { id: 9, title: 'Water Bottle', price: 19.99, category: 'home', images: [{ image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }] },
      { id: 10, title: 'Sunglasses', price: 89.99, category: 'accessories', images: [{ image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }] },
      { id: 11, title: 'Yoga Mat', price: 29.99, category: 'fitness', images: [{ image: 'https://images.unsplash.com/photo-1545389336-8c6a259068f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }] },
      { id: 12, title: 'Bluetooth Speaker', price: 69.99, category: 'electronics', images: [{ image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }] },
    ]
    setProducts(mockProducts)
    setFilteredProducts(mockProducts)
  }, [])

  // Categories for filter
  const categories = ['all', 'electronics', 'clothing', 'accessories', 'footwear', 'home', 'fitness']

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    filterProducts()
  }

  // Handle category selection
  const handleCategorySelect = (e) => {
    setSelectedCategory(e.target.value)
    filterProducts(search, e.target.value, priceRange)
  }

  // Handle price range change
  const handlePriceChange = (e) => {
    const newPrice = parseInt(e.target.value)
    setPriceRange(newPrice)
    filterProducts(search, selectedCategory, newPrice)
  }

  // Filter products based on criteria
  const filterProducts = (searchTerm = search, category = selectedCategory, price = priceRange) => {
    let filtered = products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = category === 'all' || product.category === category
      const matchesPrice = product.price <= price
      return matchesSearch && matchesCategory && matchesPrice
    })
    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Product Collection</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our collection of premium products with advanced filtering and search capabilities.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar - spans 3 columns on large screens, 12 on mobile */}
          <div className="col-span-12 lg:col-span-3 bg-white p-6 rounded-lg shadow">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Products</h2>
              <form onSubmit={handleSearch}>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="search">
                  Search For Product
                </label>
                <div className="flex">
                  <input
                    className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    type="text"
                    name="search"
                    placeholder="Enter product name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-md transition duration-200"
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </form>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter by Category</h2>
              <select
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCategory}
                onChange={handleCategorySelect}
              >
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter by Price</h2>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange}
                  onChange={handlePriceChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between">
                  <span className="text-gray-600">$0</span>
                  <span className="text-blue-600 font-medium">Up to ${priceRange}</span>
                  <span className="text-gray-600">$200</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Quick Tips</h3>
              <p className="text-blue-700 text-sm">
                Use the search and filters to find products quickly. You can combine multiple filters for better results.
              </p>
            </div>
          </div>

          {/* Main Content - spans 9 columns on large screens, 12 on mobile */}
          <div className="col-span-12 lg:col-span-9">
            {/* Results info */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 flex justify-between items-center">
              <p className="text-gray-700">
                Showing {currentProducts.length} of {filteredProducts.length} products
              </p>
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">Sort by:</span>
                <select className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Name: A to Z</option>
                  <option>Name: Z to A</option>
                </select>
              </div>
            </div>

            {/* Products grid */}
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={product.images[0]?.image || 'https://via.placeholder.com/300'}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 text-gray-800">{product.title}</h3>
                      <div className="flex items-center mb-2">
                        <span className="text-yellow-500 mr-1">
                          <i className="fas fa-star"></i>
                        </span>
                        <span className="text-gray-600 text-sm">4.5 (120 reviews)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-bold">${product.price}</span>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition duration-200">
                          <i className="fas fa-shopping-cart mr-1"></i> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <i className="fas fa-search fa-3x text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="mt-10 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === i + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AiProducts