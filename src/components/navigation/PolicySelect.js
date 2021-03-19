import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import { MapContext } from '../../context';
import policies from '../../data/policies.json';
import NavHeading from './NavHeading';

const PoliciesContainer = styled.div`
  display: ${({ expanded }) => (expanded ? 'block' : 'none')};

  @media screen and (min-width: 500px) {
    columns: 2;
  }
`;

const PolicySelect = ({ area }) => {
  const { context, updateContext } = useContext(MapContext);
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ gridArea: area }}>
      <NavHeading onClick={() => setExpanded(!expanded)}>
        Select Policies
      </NavHeading>
      <PoliciesContainer expanded={expanded}>
        {policies.map(policy => {
          return (
            <div key={policy.id}>
              <input
                id={policy.id}
                type="checkbox"
                checked={context[policy.id]}
                onChange={() => updateContext({ id: `TOGGLE_${policy.id}` })}
              />
              <label htmlFor={policy.id}>{policy.name}</label>
            </div>
          );
        })}
      </PoliciesContainer>
    </div>
  );
};

export default PolicySelect;
