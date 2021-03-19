import React, { useContext } from 'react';
import styled from 'styled-components';

import { MapContext } from '../../context';
import NavHeading from './NavHeading';
const StyledSlider = styled.div`
  align-items: center;
  display: grid;
  grid-gap: 1rem;
  grid-template: auto / auto 1fr auto;

  * {
    font-size: 14px;
  }

  input[type='range'] {
    width: 100%;
  }
`;

const YearSelect = ({ years, area }) => {
  const { context, updateContext } = useContext(MapContext);
  const min = Math.min(...years);
  const max = Math.max(...years);

  return (
    <div style={{ gridArea: area }}>
      <NavHeading htmlFor="year-select">Select Year</NavHeading>
      <StyledSlider>
        <div>{min}</div>
        <input
          id="year-select"
          type="range"
          min={min}
          max={max}
          step="1"
          list="years"
          onChange={e => {
            updateContext({ id: 'UPDATE_YEAR', value: `y${e.target.value}` });
          }}
        />
        <div>{max}</div>
      </StyledSlider>
      <datalist id="years">
        {years.map(year => (
          <option key={`range-year-${year}`} value={year} label={year}></option>
        ))}
      </datalist>
      <div style={{ textAlign: 'center', fontSize: '14px' }}>{`Current Year: ${
        context.year.match(/\d+/)[0]
      }`}</div>
    </div>
  );
};

export default YearSelect;
