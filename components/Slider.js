import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import Filter from './Filter';
import { defaultFilterValues, filters } from '../utils/filters';

const StyledSlider = styled.div`
width: 100%;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`;

const Slider = ({ setFilterString, disabledInputs, clearCanvas }) => {
  const [filterValues, setFilterValues] = useState(defaultFilterValues);

  useEffect(() => {
    const filterString = `blur(${filterValues.blur}px) brightness(${filterValues.brightness}) contrast(${filterValues.contrast}) grayscale(${filterValues.grayscale}) invert(${filterValues.invert}) opacity(${filterValues.opacity}) saturate(${filterValues.saturate}) sepia(${filterValues.sepia}) hue-rotate(${filterValues['hue-rotate']}deg)`;
    setFilterString(filterString);
  }, [filterValues]);

  const handleFilterChange = useCallback(({ target }) => {
    setFilterValues((prevFilterValues) => ({ ...prevFilterValues, [target.id]: +target.value }));
  }, [filterValues]);

  const handleReset = () => setFilterValues(defaultFilterValues);

  const handleClearButton = () => {
    clearCanvas();
    handleReset();
  };

  return (
    <StyledSlider>
      <h2> Filters:</h2>
      {filters.map((filterObj) => (
        <Filter
          {...filterObj}
          key={filterObj.filterType}
          value={filterValues[filterObj.filterType]}
          onChange={handleFilterChange}
          disabled={disabledInputs}
        />
      ))}
      <button onClick={handleReset}>reset</button>
      <button onClick={handleClearButton}>clear</button>
    </StyledSlider>
  );
};

export default Slider;
