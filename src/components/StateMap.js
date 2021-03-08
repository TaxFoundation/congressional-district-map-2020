import React, { Component, Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import HoverContainer from './HoverContainer';
import { geoAlbersUsa, geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
// import DistrictTable from './DistrictTable';
import { colorize, useData } from '../helpers';

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
  const FIPS = id < 10 ? '0' + id : id;
  const stateMapData = useData(`states/${FIPS}`);
  const [activeDistrict, setActiveDistrict] = useState(1);
  const [displayData, setDisplayData] = useState(data.d1);

  let districtsFeatures,
    path,
    districtShapes = null;

  useEffect(() => {
    setDisplayData(data[`d${activeDistrict}`]);
  }, [activeDistrict]);

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
      if (data[`d${districtId}`]) {
        const districtData = data[`d${districtId}`];

        return (
          <District
            d={path(d)}
            fill={
              districtData?.netChange
                ? colorize(districtData.netChange, domain)
                : '#888'
            }
            id={`district-detail-${d.properties.CD114FP}`}
            key={`district-detail-${d.properties.CD114FP}`}
            active={districtId === +id}
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
          {/* <DistrictTable
          data={data}
          activeBucket={activeBucket}
          activeState={activeState}
          activeDistrict={this.state.activeDistrict}
          updateActiveDistrict={this.updateActiveDistrict}
          updateActiveState={updateActiveState}
        /> */}
        </Container>
        <HoverContainer id="go-back">Click to return to US map.</HoverContainer>
      </>
    )
  );
};

export default StateMap;
