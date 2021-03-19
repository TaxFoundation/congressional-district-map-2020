import React, { useContext } from 'react';
import styled from 'styled-components';

import { MapContext } from '../context';
import Button from './Button';
import Select from './Select';
import { formatter, showSumOfPolicies } from '../helpers';
import SocialButtons from './SocialButtons';

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
  width: 100%;

  tr:first-child > td {
    font-size: 18px !important;
  }

  tr > td {
    background: #fff;
    border-right: none;
    border-bottom: 1px solid #ccc;
    font-family: 'Lato', sans-serif !important;
    padding: 0.5rem 0;

    &:last-child {
      padding: 0.5rem 0 0.5rem 1.5rem;
    }
  }

  tr:last-child > td {
    border: none;
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
  text-align: right;
`;

const DistrictTable = ({
  data,
  activeDistrict,
  updateActiveDistrict,
  activeState,
  updateActiveState,
}) => {
  const districtIds = Object.keys(data)
    .map(d => d.match(/\d+/)[0])
    .sort((a, b) => a - b);

  const { context } = useContext(MapContext);

  const districtTotals = showSumOfPolicies(data[`d${activeDistrict}`], context);

  return (
    <StyledDistrictTable>
      <div>
        <BackToMap onClick={() => updateActiveState(null)}>
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
        <Table>
          <tbody>
            <tr>
              <td>Avgerage Tax {districtTotals >= 0 ? 'Increase' : 'Cut'}</td>
              <ValueCell color={districtTotals >= 0 ? '#ef4438' : '#00aa22'}>
                {formatter(Math.abs(districtTotals), '$')}
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
      <div>
        <p
          style={{
            marginBottom: '8px',
            textAlign: 'center',
          }}
        >
          Share with your friends!
        </p>
        <SocialButtons />
      </div>
      <Button
        href="https://taxfoundation.org/2018-tax-reform-congressional-district-map-explainer/"
        style={{ alignSelf: 'end' }}
      >
        Full Methodology
      </Button>
    </StyledDistrictTable>
  );
};

export default DistrictTable;
