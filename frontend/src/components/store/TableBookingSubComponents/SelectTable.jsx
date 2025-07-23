import React, { useState, useRef, useEffect } from 'react';

const SelectTable = ({ tables, selectedTables, onChange, multiple = true, guestCount = 0 }) => {
  const [showGrid, setShowGrid] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowGrid(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTable = (tableCode) => {
    let updated = [];

    if (multiple) {
      updated = selectedTables.includes(tableCode)
        ? selectedTables.filter((code) => code !== tableCode)
        : [...selectedTables, tableCode];
    } else {
      updated = [tableCode];
    }

    onChange(updated);
  };

  const selectedCapacity = tables
    .filter((t) => selectedTables.includes(t.tableCode))
    .reduce((sum, t) => sum + (t.tableCapacity || 0), 0);

  const remaining = Math.max(guestCount - selectedCapacity, 0);

  const selectedText = selectedTables.length
    ? selectedTables.join(', ')
    : 'Select Table(s)';

  return (
    <div className="mb-3" ref={wrapperRef}>
      <label className="form-label fw-semibold">Select Table{multiple ? 's' : ''}</label>
      <small
        className="d-block mt-2 px-3 py-2 rounded fw-semibold border border-warning bg-warning-subtle text-danger"
      >
        Total Selected Capacity: {selectedCapacity} / Guests: {guestCount}
        {remaining > 0 ? ` — Need ${remaining} more` : ' — Enough capacity'}
      </small>

      <div
        className="form-control position-relative"
        style={{ cursor: 'pointer' }}
        onClick={() => setShowGrid(!showGrid)}
      >
        {selectedText}
      </div>

      {showGrid && (
        <div
          className="border bg-white rounded shadow p-2 position-absolute z-3 mt-1"
          style={{ maxHeight: '300px', overflowY: 'auto', width: '100%' }}
        >
          <div className="row g-2">
            {tables.map((table, i) => {
              const isSelected = selectedTables.includes(table.tableCode);
              const isAvailable = table.isAvailable;
              return (
<div key={i} className="col-4 col-sm-3 col-md-2">
  <div
    className={`text-center p-2 rounded fw-semibold border 
      ${!isAvailable ? 'bg-secondary-subtle text-muted border-danger' : 
        isSelected ? 'bg-success text-white border-success' : 'bg-white text-dark border-success'}
    `}
    style={{
      cursor: isAvailable ? 'pointer' : 'not-allowed',
      fontSize: '0.8rem',
      minHeight: '60px',
      transition: 'all 0.2s ease-in-out',
    }}
    onClick={(e) => {
      if (!isAvailable) return;
      e.stopPropagation();
      toggleTable(table.tableCode);
    }}
  >
    <div>Table {table.tableCode}</div>
    <div style={{ fontSize: '0.7rem' }}>Cap: {table.tableCapacity}</div>
  </div>
</div>
 


              );
            })}
          </div>
          <div className="text-end mt-2">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setShowGrid(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectTable;
