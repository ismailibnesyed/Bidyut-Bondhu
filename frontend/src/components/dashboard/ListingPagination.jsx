const ListingPagination = ({ listing }) => {
  if (!listing.total) return null;

  const firstItem = (listing.page - 1) * listing.pageSize + 1;
  const lastItem = Math.min(listing.page * listing.pageSize, listing.total);

  return (
    <div className="pc-pagination">
      <label className="pc-pagination-size">
        <span>Rows per page</span>
        <select
          value={listing.pageSize}
          onChange={(event) => listing.setPageSize(event.target.value)}
        >
          {[10, 25, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>

      <span className="pc-pagination-count">
        {firstItem}-{lastItem} of {listing.total}
      </span>

      <div className="pc-pagination-actions">
        <button
          type="button"
          className="pc-button secondary"
          disabled={listing.page === 1}
          onClick={() => listing.setPage(listing.page - 1)}
        >
          Previous
        </button>
        <span>
          {listing.page} / {listing.pageCount}
        </span>
        <button
          type="button"
          className="pc-button secondary"
          disabled={listing.page === listing.pageCount}
          onClick={() => listing.setPage(listing.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ListingPagination;