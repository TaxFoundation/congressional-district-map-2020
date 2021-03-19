import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { geoAlbersUsa, geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

import { MapContext } from '../context';
import { colorize, useData, showSumOfPolicies } from '../helpers';
import DistrictTable from './DistrictTable';
import HoverContainer from './HoverContainer';

const Container = styled.div`
  display: grid;
  grid-gap: 2rem;
  grid-template: repeat(2, auto) / auto;

  @media (min-width: 800px) {
    grid-template: auto / 3fr 1fr;
  }
`;

const District = styled.path`
  cursor: pointer;
  stroke: #fff;
  stroke-width: ${props => (props.active ? 1.5 : 0.5)};
  stroke-linejoin: bevel;
  transition: fill 0.2s ease-in-out;
`;

const BG = styled.rect`
  cursor: pointer;
  fill: transparent;
  height: ${props => props.height};
  width: ${props => props.width};
`;

const StateMap = ({
  id,
  data,
  updateActiveState,
  scale,
  domain,
  xScale,
  yScale,
}) => {
  const { context } = useContext(MapContext);
  const FIPS = id < 10 ? '0' + id : id;
  const stateMapData = useData(`states/${FIPS}`);
  const [activeDistrict, setActiveDistrict] = useState(
    Object.keys(data).length > 1 ? 1 : 0,
  );

  let districtsFeatures,
    path,
    districtShapes = null;

  if (stateMapData) {
    districtsFeatures = feature(stateMapData, stateMapData.objects[FIPS]);
    if (id === 2 || id === 15) {
      path = geoPath().projection(
        geoAlbersUsa().fitSize([xScale, yScale], districtsFeatures),
      );
    } else {
      path = geoPath().projection(
        geoMercator().fitSize([xScale, yScale], districtsFeatures),
      );
    }

    districtShapes = districtsFeatures.features.map(d => {
      const districtId = +d.properties.CD114FP;
      const districtData = data[`d${districtId}`];
      if (districtData) {
        return (
          <District
            d={path(d)}
            fill={
              districtData
                ? colorize(showSumOfPolicies(districtData, context), domain)
                : '#888'
            }
            id={`district-detail-${districtId}`}
            key={`district-detail-${districtId}`}
            active={districtId === activeDistrict}
            onMouseOver={() =>
              districtId > 0 ? setActiveDistrict(districtId) : null
            }
          />
        );
      } else {
        return null;
      }
    });
  }

  return (
    stateMapData && (
      <>
        <Container>
          <svg width="100%" viewBox={`0 0 ${xScale} ${yScale}`}>
            <BG
              data-tip
              data-for="go-back"
              height={yScale}
              width={xScale}
              onClick={() => updateActiveState(0)}
            />
            {districtShapes}
          </svg>
          <DistrictTable
            data={data}
            activeDistrict={activeDistrict}
            updateActiveDistrict={setActiveDistrict}
            activeState={id}
            updateActiveState={updateActiveState}
          />
        </Container>
        <HoverContainer id="go-back">Click to return to US map.</HoverContainer>
      </>
    )
  );
};

export default StateMap;
