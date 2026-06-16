import React from 'react';

const Pagination = ({ pagination, setPage }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
      <button
        className="btn btn-secondary"
        disabled={pagination.page === 1}
        onClick={() => setPage(pagination.page - 1)}
      >
        Previous
      </button>
      <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <button
        className="btn btn-secondary"
        disabled={pagination.page === pagination.totalPages}
        onClick={() => setPage(pagination.page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
