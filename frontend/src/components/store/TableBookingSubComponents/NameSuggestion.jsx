import React from 'react';

const NameSuggestions = ({ suggestions, show, highlightIndex, onSelect }) => {
  if (!show || suggestions.length === 0) return null;

  return (
<ul className="list-group position-absolute w-100 z-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
  {suggestions.map((s, i) => (
    <li
  key={i}
  onClick={() => onSelect(s)}
  className="list-group-item list-group-item-action"
  style={{
    cursor: 'pointer',
    backgroundColor: i === highlightIndex ? '#d0f0ff' : '', // ice blue
    color: i === highlightIndex ? '#000' : '',
  }}
>
  {`${s.firstName} ${s.secondName || ''} - ${s.contact || ''}`}

</li>

  ))}
</ul>

  );
};

export default NameSuggestions;
