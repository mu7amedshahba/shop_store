import  { useEffect, useMemo, useState } from "react";
import { Spinner } from "flowbite-react";
import { roleMap } from "../../../assets/Auth/authPaths";
import { Link } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import PaginatedItems from "../../pagination/Pagination";
import PropTypes from "prop-types";

const TableContent = ({
  usersData = [],
  headers,
  loading,
  errorMessage,
  entityName = "",
  pageCount,
  setPageCount,
  itemPerPage,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Filter data based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(usersData);
    } else {
      const filtered = usersData.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (item.name && item.name.toLowerCase().includes(searchLower)) ||
          (item.email && item.email.toLowerCase().includes(searchLower)) ||
          (item.title && item.title.toLowerCase().includes(searchLower)) ||
          (item.description &&
            item.description.toLowerCase().includes(searchLower))
        );
      });
      setFilteredData(filtered);
    }
  }, [searchTerm, usersData]);

  const filterData = useMemo(() => {
    let data = [...usersData];
// search filter 
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerSearch) ||
          item.email.toLowerCase().includes(lowerSearch) ||
          item.name.toLowerCase().includes(lowerSearch) ||
          item.description.toLowerCase().includes(lowerSearch)
      );
    }
  }, []);
// 
  const paginationData = useMemo(() => {
    const startIndex = (pageCount - 1) * itemPerPage;
    const lastIndex = startIndex + itemPerPage;
    return filteredData.slice(startIndex, lastIndex);
  }, [pageCount, itemPerPage, filteredData]);

  const handleDelete = (id) => {
    console.log("Delete item with id:", id);
    // Implement actual delete logic here
  };
// 
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPageCount(1); // Reset to first page when searching
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner aria-label="Loading data" size="xl" />
      </div>
    );
  }
// 
  if (errorMessage) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
        {errorMessage}
      </div>
    );
  }

  const renderTableRow = (item, index) => (
    <tr
      key={item.id}
      className={`
        ${
          index % 2 === 0
            ? "bg-[var(--color-neutral-lightest)]"
            : "bg-[var(--color-neutral-light)]"
        }
        hover:bg-[var(--color-primary-lightest)] transition-colors
      `}
    >
      <td className="px-6 py-4 text-center text-[var(--text-main)]">
        {item.id || item.name}
      </td>
      <td className="px-6 py-4 text-center text-[var(--text-main)]">
        {(item.images && item.title) || item.name}
      </td>
      <td className="px-6 py-4 text-center col-span-2">
        {item.email ? (
          item.email
        ) : item.images ? (
          <div className="justify-center space-x-2 grid grid-cols-4 items-center">
            {item.images.map((img) => (
              <img
                src={img.image}
                key={img.id}
                alt={img.title || img.name}
                className="w-20 h-20 object-cover rounded-md border-[var(--border-light)]"
              />
            ))}
          </div>
        ) : (
          item.image && (
            <img
              src={item.image}
              alt={item.title || item.name}
              className="w-20 h-20 object-cover rounded-md border-[var(--border-light)] mx-auto"
            />
          )
        )}
      </td>
      {item.description && (
        <td className="px-6 py-4 text-center text-[var(--text-main)]">
          {item.description}
        </td>
      )}
      {item.price && (
        <td className="px-6 py-4 text-center text-[var(--text-main)]">
          {item.price}
        </td>
      )}
      {item.role && (
        <td className="px-6 py-4 text-center text-[var(--text-main)]">
          {roleMap[item.role] || item.role}
        </td>
      )}

      <td className="px-6 py-4 text-center">
        <div className="flex justify-center space-x-2">
          <Link
            to={`${entityName}/${item.id}`}
            className="p-2 text-[var(--color-accent-dark)] hover:bg-[var(--color-accent-lightest)] rounded-full transition-colors"
            aria-label={`Edit ${item.name || item.title}`}
          >
            <FaUserEdit />
          </Link>

          {roleMap[item.role] === 1995 && (
            <button
              onClick={() => handleDelete(item.id)}
              className="p-2 text-[var(--color-error)] hover:bg-[var(--color-accent-lightest)] rounded-full transition-colors"
              aria-label={`Delete ${item.name || item.title}`}
            >
              <MdDelete />
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border)] shadow-sm">
      <div className="p-4 bg-[var(--color-neutral-lightest)]">
        <form className="max-w-md mx-auto">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <input
            type="search"
            id="search"
            name="search"
            value={searchTerm}
            onChange={handleSearch}
            placeholder={`Search ${entityName}...`}
            className="w-full px-4 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-[var(--border)]">
          <thead className="bg-[var(--color-accent)]">
            <tr>
              {headers.map((item) => (
                <th
                  key={item.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-[var(--text-light)] uppercase tracking-wider"
                >
                  {item.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]">
            {paginationData.length > 0 ? (
              paginationData.map(renderTableRow)
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-6 py-12 text-center text-[var(--text-muted)]"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 text-[var(--color-neutral)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="mt-2 text-sm font-medium">
                      No data available
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {searchTerm
                        ? "No results match your search"
                        : "Try adjusting your search or filter"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginatedItems
        itemsPerPage={itemPerPage}
        pageCounter={pageCount || 1}
        totalItems={filteredData.length}
        setPageCounter={setPageCount}
      />
    </div>
  );
};

TableContent.propTypes = {
  usersData: PropTypes.array.isRequired,
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool,
  errorMessage: PropTypes.string,
  entityName: PropTypes.string,
  pageCount: PropTypes.number.isRequired,
  setPageCount: PropTypes.func.isRequired,
  itemPerPage: PropTypes.number.isRequired,
  setItemPerPage: PropTypes.func.isRequired,
};

export default TableContent;
