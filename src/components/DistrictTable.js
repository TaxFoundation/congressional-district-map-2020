import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import { MapContext } from '../context';
import policies from '../data/policies.json';
import Select from './Select';
import Button from './Button';
import { formatter, showSumOfPolicies } from '../helpers';

const StyledDistrictTable = styled.div`
  background-color: #fff;
  border: 1px solid #999;
  border-radius: 4px;
  display: grid;
  grid-gap: 0.5rem;
  height: 100%;
  padding: 1rem;

  p {
    margin: 0;
  }
`;

const Table = styled.table`
  border-collapse: collapse;
  font-size: 0.8rem !important;
  margin: 0;
  width: 100%;

  td {
    background: #fff;
    border: none;
    border-top: 1px solid #ccc;
    font-family: 'Lato', sans-serif !important;
    font-size: 12px;
    padding: 0.5rem 0;

    &:last-child {
      padding: 0.5rem 0 0.5rem 1.5rem;
    }
  }

  tr {
    margin: 0;
  }

  tr:first-child > td {
    border: none;
  }

  tr:last-child > td {
    border-top: 2px solid #aaa;
    font-size: 16px;
    font-weight: 700;
  }
`;

const BackToMap = styled.p`
  color: #0094ff;
  cursor: pointer;
  font-size: 0.8rem;
  margin: 0 0 0.5rem;
  text-align: center;
`;

const ValueCell = styled.td`
  color: ${props => (props.color ? props.color : '#333')};
  font-family: 'Roboto Mono', monospace !important;
  min-width: 100px;
  text-align: right;
`;

const DistrictTable = ({
  data,
  activeDistrict,
  updateActiveDistrict,
  activeState,
  updateActiveState,
}) => {
  const [togglePercentages, setTogglePercentages] = useState(false);
  const districtIds = Object.keys(data)
    .filter(d => d !== 'average')
    .map(d => d.match(/\d+/)[0])
    .sort((a, b) => a - b);

  const { context } = useContext(MapContext);

  const districtTotals = showSumOfPolicies(data[`d${activeDistrict}`], context);

  return (
    <StyledDistrictTable>
      <div>
        <BackToMap onClick={() => updateActiveState(0)}>
          ← Back to US Map
        </BackToMap>
        {districtIds.length > 1 ? (
          <Select
            name="district"
            id="district"
            value={activeDistrict}
            onChange={e => updateActiveDistrict(e.target.value)}
          >
            {districtIds.map(d => (
              <option key={`district-opt-${d}`} value={d}>
                {`District ${d}`}
              </option>
            ))}
          </Select>
        ) : activeState === 11 ? (
          <h3 style={{ textAlign: 'center' }}>District of Columbia</h3>
        ) : (
          <h3 style={{ textAlign: 'center' }}>At-Large District</h3>
        )}
        <Button style={{display: 'block'}} onClick={() => setTogglePercentages(!togglePercentages)}>{togglePercentages ? 'Show in Dollars' : 'Show as Percent of AGI'}</Button>
        <Table>
          <tbody>
            <tr>
              <td>Projected Average Adjusted Gross Income</td>
              <ValueCell>
                {formatter(data[`d${activeDistrict}`].agi ? data[`d${activeDistrict}`].agi : 0, '$')}
              </ValueCell>
            </tr>
            {policies.map(policy => {
              const value = togglePercentages ? data[`d${activeDistrict}`][policy.shorthand]/data[`d${activeDistrict}`].agi : data[`d${activeDistrict}`][policy.shorthand];
              return (
                <tr key={`policy-${policy.shorthand}`}>
                  <td>{policy.abbr}</td>
                  <ValueCell color={value >= 0 ? '#ef4438' : '#00aa22'}>
                    {formatter(context[policy.id] ? value : 0, togglePercentages ? '%' : '$')}
                  </ValueCell>
                </tr>
              );
            })}
            <tr>
              <td>Average Tax {districtTotals >= 0 ? 'Increase' : 'Cut'}</td>
              <ValueCell color={districtTotals >= 0 ? '#ef4438' : '#00aa22'}>
                {formatter(togglePercentages ? Math.abs(districtTotals)/data[`d${activeDistrict}`].agi : Math.abs(districtTotals), togglePercentages ? '%' : '$')}
              </ValueCell>
            </tr>
          </tbody>
        </Table>
      </div>
      <p style={{ fontSize: '0.8rem' }}>
        Not sure what district you live in?{' '}
        <a
          style={{ color: '#0094ff' }}
          href="https://www.census.gov/mycd/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Find out here.
        </a>
      </p>
    </StyledDistrictTable>
  );
};

export default DistrictTable;
