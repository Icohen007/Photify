import React from 'react';

const Filter = ({
  description, filterType, range, value, onChange, disabled,
}) => (
  <>
    <label htmlFor={filterType}>{description}</label>
    <input
      type="range"
      id={filterType}
      min={range.min}
      max={range.max}
      step={range.step}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  </>
);

export default Filter;
