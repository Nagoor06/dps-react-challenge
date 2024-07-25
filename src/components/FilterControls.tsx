// src/components/FilterControls.tsx
import React from 'react';

interface FilterControlsProps {
  nameFilter: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  cities: string[];
  cityFilter: string;
  onCityChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  highlightOldest: boolean;
  onHighlightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  nameFilter, onNameChange, cities, cityFilter, onCityChange, highlightOldest, onHighlightChange
}) => {
  return (
    <div className="filter-controls">
      <input
        type="text"
        placeholder="Filter by name"
        value={nameFilter}
        onChange={onNameChange}
      />
      <select value={cityFilter} onChange={onCityChange}>
        <option value="">All Cities</option>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
      <label>
        <input
          type="checkbox"
          checked={highlightOldest}
          onChange={onHighlightChange}
        />
        Highlight Oldest
      </label>
    </div>
  );
};

export default FilterControls;
