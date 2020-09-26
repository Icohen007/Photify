import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import Filter from './Filter';

const StyledSlider = styled.div`
height: 100%;
width: 200rem;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`;

const filters = [
  {
    description: 'Blur',
    filterType: 'blur',
    range: {
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 0,
    },
  },
  {
    description: 'Grayscale',
    filterType: 'grayscale',
    range: {
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0,
    },
  },
  {
    description: 'Invert',
    filterType: 'invert',
    range: {
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0,
    },
  },
  {
    description: 'Sepia',
    filterType: 'sepia',
    range: {
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0,
    },
  },
  {
    description: 'Hue-rotate',
    filterType: 'hue-rotate',
    range: {
      min: 0,
      max: 360,
      step: 1,
      defaultValue: 0,
    },
  },
  {
    description: 'Opacity',
    filterType: 'opacity',
    range: {
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 1,
    },
  },
  {
    description: 'Brightness',
    filterType: 'brightness',
    range: {
      min: 0,
      max: 2,
      step: 0.01,
      defaultValue: 1,
    },
  },
  {
    description: 'Contrast',
    filterType: 'contrast',
    range: {
      min: 0,
      max: 2,
      step: 0.01,
      defaultValue: 1,
    },
  },
  {
    description: 'Saturation',
    filterType: 'saturate',
    range: {
      min: 0,
      max: 2,
      step: 0.01,
      defaultValue: 1,
    },
  },
];

const defaultFilterValues = filters.reduce((acc, cur) => {
  acc[cur.filterType] = cur.range.defaultValue;
  return acc;
}, {});

const Slider = ({ setFilterString, disabledInputs }) => {
  const [filterValues, setFilterValues] = useState(defaultFilterValues);
  console.log(filterValues);

  useEffect(() => {
    const filterString = `blur(${filterValues.blur}px) brightness(${filterValues.brightness}) contrast(${filterValues.contrast}) grayscale(${filterValues.grayscale}) invert(${filterValues.invert}) opacity(${filterValues.opacity}) saturate(${filterValues.saturate}) sepia(${filterValues.sepia}) hue-rotate(${filterValues['hue-rotate']}deg)`;
    setFilterString(filterString);
  }, [filterValues]);

  const handleFilterChange = useCallback(({ target }) => {
    setFilterValues((prevFilterValues) => ({ ...prevFilterValues, [target.id]: +target.value }));
  }, [filterValues]);

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
      <button onClick={() => setFilterValues(defaultFilterValues)}>reset</button>
    </StyledSlider>
  );
};

export default Slider;
