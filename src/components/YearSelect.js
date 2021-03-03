import React, { useContext } from 'react';
import styled from 'styled-components';

import { MapContext } from '../context';

const NavSectionHeading = styled.label`
  display: block;
  font-size: 1.4rem;
  line-height: 1.4;
  margin: 0 0 1rem;
  text-align: center;
  width: 100%;
`;

const StyledSlider = styled.div`
  align-items: center;
  display: grid;
  grid-gap: 1rem;
  grid-template: auto / auto 1fr auto;

  input[type='range'] {
    width: 100%;
  }
`;

const YearSelect = ({ years }) => {
  const { data, updateData } = useContext(MapContext);
  const min = Math.min(...years);
  const max = Math.max(...years);

  return (
    <div>
      <NavSectionHeading htmlFor="year-select">
        Select Year: {data.year.match(/\d+/)[0]}
      </NavSectionHeading>
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
            updateData({ id: 'UPDATE_YEAR', value: `y${e.target.value}` });
          }}
        />
        <div>{max}</div>
      </StyledSlider>
      <datalist id="years">
        {years.map(year => (
          <option key={`range-year-${year}`} value={year} label={year}></option>
        ))}
      </datalist>
    </div>
  );
};

export default YearSelect;
