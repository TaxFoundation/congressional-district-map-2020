import React, { useContext } from 'react';
import styled from 'styled-components';

import states from '../../data/states.json';
import NavHeading from './NavHeading';

const SelectContainer = styled.div`
  background-color: #fff;
  border-radius: 4px;
  display: grid;
  align-items: center;
  grid-template-areas: 'select';

  &::after {
    background-color: #0094ff;
    clip-path: polygon(100% 0%, 0 0%, 50% 100%);
    content: '';
    grid-area: select;
    height: 0.5em;
    justify-self: end;
    margin-right: 0.5rem;
    width: 0.8em;
  }
`;

const Select = styled.select`
  appearance: none;
  background-color: transparent;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  grid-area: select;
  font-size: 1rem;
  text-align: center;
  width: 100%;
  z-index: 1;
`;

const StateSelect = ({ activeState, setActiveState, area }) => {
  return (
    <div style={{ gridArea: area }}>
      <NavHeading htmlFor="state-select">Select State</NavHeading>
      <SelectContainer>
        <Select
          id="state-select"
          onChange={e => setActiveState(e.target.value)}
          value={activeState}
        >
          <option value="0">United States</option>
          {states.map(state => {
            return <option value={state.id}>{state.name}</option>;
          })}
        </Select>
      </SelectContainer>
    </div>
  );
};

export default StateSelect;
