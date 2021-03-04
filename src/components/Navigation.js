import React, { useContext } from 'react';
import styled from 'styled-components';

import YearSelect from './YearSelect';

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

const Navigation = ({ years }) => {
  return (
    <Container>
      <YearSelect years={years} />
    </Container>
  );
};

export default Navigation;
