import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { geoAlbers, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

import HoverContainer from './HoverContainer';
import { colorize, formatter } from '../helpers';

const State = styled.path`
  cursor: pointer;
  fill: transparent;
  stroke: #fff;
  stroke-width: 1;
  stroke-linejoin: bevel;

  &:hover {
    fill: rgba(255, 255, 255, 0.3);
    stroke-width: 2;
  }
`;

const hoverText = (name, info, jobs) => `
  <p style="text-align:center; border-bottom: 1px solid #ddd; padding-bottom: 9px; margin-bottom: 9px;"><strong>${name}</strong></p>
  <table><tbody>
  <tr style="background:transparent">
    <td style="border: none">Average Tax Cut:</td>
    <td style="border: none; text-align: right;">${formatter(info, '$')}</td>
  </tr>
  </tbody></table>`;

const District = styled.path`
  stroke: #fff;
  stroke-width: 0.5;
  stroke-linejoin: bevel;
`;

const USMap = ({
  us,
  districts,
  year,
  updateActiveState,
  scale,
  domain,
  xScale,
  yScale,
  data,
}) => {
  const path = geoPath().projection(
    geoAlbers()
      .scale(scale)
      .translate([xScale / 2, yScale / 2 - 25]),
  );

  const districtsFeatures = feature(districts, districts.objects.districts)
    .features;

  const districtShapes = districtsFeatures.map(d => {
    const stateId = Math.floor(+d.id / 100);
    const districtId = `d${d.id % 100}`;
    let districtData;
    if (data[stateId] && data[stateId].data[year][districtId]) {
      districtData = data[stateId].data[year][districtId];
      return (
        <District
          d={path(d)}
          fill={
            districtData && districtData.netChange
              ? colorize(districtData.netChange, domain)
              : '#888'
          }
          id={`district-${d.id}`}
          key={`district-${d.id}`}
        />
      );
    } else {
      return null;
    }
  });

  const states = feature(us, us.objects.states).features.map(d => {
    const stateInfo = data[+d.id];
    let districtValues,
      avgNetChange = null;
    if (stateInfo) {
      districtValues = Object.values(stateInfo.data[year]).map(
        d => d.netChange,
      );
      avgNetChange =
        districtValues.reduce((acc, curr) => acc + curr, 0) /
        districtValues.length;
    }

    return (
      <State
        d={path(d)}
        data-tip={stateInfo ? hoverText(stateInfo.name, avgNetChange) : null}
        data-for="usmap"
        data-html={true}
        key={`state-${d.id}`}
        onClick={e => {
          updateActiveState(d.id);
        }}
      />
    );
  });

  return (
    <>
      <svg width="100%" viewBox={`0 0 ${xScale} ${yScale}`}>
        <defs>
          <path id="land" d={path(feature(us, us.objects.land))} />
        </defs>
        <clipPath id="clip-land">
          <use xlinkHref="#land" />
        </clipPath>
        <g clipPath="url(#clip-land)">{districtShapes}</g>
        <g>{states}</g>
      </svg>
      <HoverContainer id="usmap" aria-haspopup="true" />
    </>
  );
};

USMap.propTypes = {
  us: PropTypes.object,
  districts: PropTypes.object,
  updateActiveState: PropTypes.func,
  year: PropTypes.number,
  scale: PropTypes.number,
  domain: PropTypes.arrayOf(PropTypes.number),
  xScale: PropTypes.number,
  yScale: PropTypes.number,
  data: PropTypes.any,
};

export default USMap;
