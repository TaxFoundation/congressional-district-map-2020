import React, { useContext } from 'react';
import styled from 'styled-components';

import YearSelect from './YearSelect';
import StateSelect from './StateSelect';
import PolicySelect from './PolicySelect';

const Container = styled.div`
  background-color: #f5f5f5;
  border: 1px solid #aaa;
  border-radius: 4px;
  display: grid;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  grid-gap: 1rem;
  grid-template-areas:
    'years'
    'states'
    'policies';
  justify-items: stretch;
  padding: 1rem;
  margin-bottom: 1rem;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, auto);
    grid-template-areas:
      'years states'
      'policies policies';
  }
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

const Navigation = ({ years, activeState, setActiveState }) => {
  return (
    <Container>
      <YearSelect area="years" years={years} />
      <StateSelect
        area="states"
        activeState={activeState}
        setActiveState={setActiveState}
      />
      <PolicySelect area="policies" />
    </Container>
  );
};

export default Navigation;
