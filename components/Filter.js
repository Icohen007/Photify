import styled from 'styled-components';

const StyledFilter = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
width: 100%;
`;

const Filter = ({
  description, filterType, range, value, onChange, disabled,
}) => (
  <StyledFilter>
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
  </StyledFilter>
);

export default Filter;
