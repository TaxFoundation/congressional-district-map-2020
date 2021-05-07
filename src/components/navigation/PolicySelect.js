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

const HR = styled.hr`
  background-color: #ccc;
  border: 0;
  color: #ccc;
  height: 1px;
  margin: 1rem 0;
`;

const Button = styled.button`
  background-color: #0094ff;
  border: 1px solid #0094ff;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  font-family: 'Lato', sans-serif;
  padding: 0.5rem 1rem;
`;

const PoliciesContainer = styled.div`
  display: ${({ expanded }) => (expanded ? 'grid' : 'none')};
  font-size: 14px;
  grid-template: repeat(3, auto) / 1fr;
`;

const PoliciesList = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template: auto / 1fr;
  padding-bottom: 1rem;

  @media screen and (min-width: 500px) {
    grid-template: auto / repeat(2, 1fr);
  }
`;

const PoliciesToggles = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template: repeat(2, auto) / 1fr;

  @media screen and (min-width: 500px) {
    grid-template: auto / repeat(2, 1fr);
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
      <Button onClick={() => setExpanded(!expanded)}>
        {`${expanded ? 'Hide' : 'Show'} Individual Policies`}
      </Button>
      <PoliciesContainer expanded={expanded}>
        <HR />
        <PoliciesList>
          {policies.map(policy => {
            return (
              <Policy key={policy.id}>
                <input
                  id={policy.id}
                  type="checkbox"
                  checked={context[policy.id]}
                  onChange={() =>
                    updateContext({ id: `TOGGLE_PLAN`, plan: policy.id })
                  }
                />
                <label htmlFor={policy.id}>{policy.name}</label>
              </Policy>
            );
          })}
        </PoliciesList>
        <PoliciesToggles>
          <Button
            id="toggle-policies"
            onClick={() => updateContext({ id: `TOGGLE_ALL_ON` })}
          >
            Select All Policies
          </Button>
          <Button
            id="toggle-policies"
            onClick={() => updateContext({ id: `TOGGLE_ALL_OFF` })}
          >
            Select No Policies
          </Button>
        </PoliciesToggles>
      </PoliciesContainer>
    </Container>
  );
};

export default PolicySelect;
