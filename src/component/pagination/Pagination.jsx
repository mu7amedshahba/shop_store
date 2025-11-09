import ReactPaginate from "react-paginate";
import "./pagination.css";

function PaginatedItems({
  totalItems,
  pageCounter,
  itemsPerPage,
  setPageCounter,
}) {
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">>"
      previousLabel="<<"
      onPageChange={({ selected }) => setPageCounter(selected + 1)}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      pageCount={pageCount || 1}
      forcePage={pageCounter - 1}
      renderOnZeroPageCount={null}
      containerClassName="pagination"
      pageClassName="pagination-page"
      pageLinkClassName="pagination-link"
      activeClassName="active-page"
      previousClassName="pagination-nav"
      nextClassName="pagination-nav"
      previousLinkClassName="pagination-nav-link"
      nextLinkClassName="pagination-nav-link"
      breakClassName="pagination-break"
      breakLinkClassName="pagination-break-link"
      disabledClassName="disabled-nav"
    />
  );
}

export default PaginatedItems;
