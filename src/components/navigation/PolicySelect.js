import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import { MapContext } from '../../context';
import policies from '../../data/policies.json';

const Container = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-area: ${({ area }) => area};
  justify-items: center;
`;

const SelectExpand = styled.button`
  background-color: #0094ff;
  border: 1px solid #0094ff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-family: 'Lato', sans-serif;
`;

const PoliciesContainer = styled.div`
  display: ${({ expanded }) => (expanded ? 'block' : 'none')};
  font-size: 14px;

  @media screen and (min-width: 500px) {
    columns: 2;
  }
`;

const Policy = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: auto 1fr;
`;

const PolicySelect = ({ area }) => {
  const { context, updateContext } = useContext(MapContext);
  const [expanded, setExpanded] = useState(false);

  return (
    <Container area={area}>
      <SelectExpand onClick={() => setExpanded(!expanded)}>
        Select Policies
      </SelectExpand>
      <PoliciesContainer expanded={expanded}>
        {policies.map(policy => {
          return (
            <Policy key={policy.id}>
              <input
                id={policy.id}
                type="checkbox"
                checked={context[policy.id]}
                onChange={() => updateContext({ id: `TOGGLE_${policy.id}` })}
              />
              <label htmlFor={policy.id}>{policy.name}</label>
            </Policy>
          );
        })}
      </PoliciesContainer>
    </Container>
  );
};

export default PolicySelect;
