import React from 'react';
import NameSuggestions from './NameSuggestion';

const GuestDetailsInput = ({
  form,
  onFormChange,
  suggestions,
  showSuggestions,
  highlightIndex,
  fetchSuggestions,
  selectSuggestion,
  setHighlightIndex
}) => {
  return (
    <>
      {/* First Name with suggestions */}
      <div className="mb-3 position-relative">
        <label className="form-label">First Name</label>
        <input
          type="text"
          name="firstName"
          value={form.firstName}
          onChange={(e) => {
            fetchSuggestions(e.target.value);
            setHighlightIndex(-1);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setHighlightIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setHighlightIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
            } else if (e.key === 'Enter' && highlightIndex >= 0) {
              e.preventDefault();
              selectSuggestion(suggestions[highlightIndex]);
            }
          }}
          className="form-control"
        />
        <NameSuggestions
          suggestions={suggestions}
          show={showSuggestions}
          highlightIndex={highlightIndex}
          onSelect={selectSuggestion}
        />
      </div>

      {/* Last Name */}
      <div className="mb-3">
        <label className="form-label">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={form.lastName}
          onChange={onFormChange}
          className="form-control"
        />
      </div>

      {/* Contact Number */}
      <div className="mb-3">
        <label className="form-label">Contact Number</label>
        <input
          type="tel"
          name="guestContactDetails"
          value={form.guestContactDetails}
          onChange={onFormChange}
          className="form-control"
        />
      </div>
    </>
  );
};

export default GuestDetailsInput;
