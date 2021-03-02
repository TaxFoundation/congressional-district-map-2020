import React, { useContext } from 'react';
import styled from 'styled-components';

import { MapContext } from '../context';

const Container = styled.div`
  background-color: #f5f5f5;
  border: 1px solid #aaa;
  border-radius: 4px;
  display: grid;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  grid-gap: 1rem;
  grid-template: auto / repeat(2, 1fr);
  justify-items: stretch;
  padding: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 600px) {
    grid-template: repeat(2, auto) / auto;
  }
`;

const NavSectionHeading = styled.h2`
  display: block;
  font-size: 1.4rem;
  line-height: 1.4;
  margin: 0 0 1rem;
  text-align: center;
  width: 100%;
`;

const Tooltip = styled.span`
  background-color: #e6f4ff;
  border: 1px solid #0094ff;
  border-radius: 2px;
  color: #0094ff;
  cursor: pointer;
  display: inline-block;
  font-size: 0.8rem;
  line-height: 1;
  margin-left: 0.5rem;
  padding: 0.1rem 0.3rem;
  position: relative;
  top: -0.25rem;
`;

const RangeSlider = ({ years }) => {
  const { data, updateData } = useContext(MapContext);

  return (
    <div>
      <NavSectionHeading>Select Year</NavSectionHeading>
      <input
        type="range"
        min={Math.min(...years)}
        max={Math.max(...years)}
        step="1"
        list="years"
        onChange={e => {
          updateData({ id: 'UPDATE_YEAR', value: `y${e.target.value}` });
        }}
      />
      <datalist id="years">
        {years.map(year => (
          <option key={`range-year-${year}`} value={year} label={year}></option>
        ))}
      </datalist>
    </div>
  );
};

const Navigation = ({ years, activeYear, setActiveYear }) => {
  return (
    <Container>
      <RangeSlider
        years={years}
        activeYear={activeYear}
        setActiveYear={setActiveYear}
      />
    </Container>
  );
};

export default Navigation;
