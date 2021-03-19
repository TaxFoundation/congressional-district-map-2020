import React, { useContext } from 'react';

import { MapContext } from '../../context';
import policies from '../../data/policies.json';
import NavHeading from './NavHeading';

const PolicySelect = ({ area }) => {
  const { context, updateContext } = useContext(MapContext);
  return (
    <div style={{ gridArea: area }}>
      <NavHeading>Select Policies</NavHeading>
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
    </div>
  );
};

export default PolicySelect;
