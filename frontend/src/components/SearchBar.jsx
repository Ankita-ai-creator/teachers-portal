import React from 'react';

const CLASSES = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

const SearchBar = ({ search, setSearch, className, setClassName }) => {
  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
      <input
        type="text"
        className="form-control"
        placeholder="Search by name or roll number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ flex: 1 }}
      />
      <select
        className="form-control"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        style={{ width: '200px' }}
      >
        <option value="">All Classes</option>
        {CLASSES.map((cls) => (
          <option key={cls} value={cls}>
            Class {cls}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;
