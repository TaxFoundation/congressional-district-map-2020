import React, { useState, useEffect, useContext, useRef } from 'react';
import styled from 'styled-components';
import { geoAlbersUsa, geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

import { MapContext } from '../context';
import {
  colorize,
  fetchData,
  leadingZeroFIPS,
  showSumOfPolicies,
} from '../helpers';
import MapContainer from './MapContainer';
import DistrictTable from './DistrictTable';
import HoverContainer from './HoverContainer';

const Container = styled.div`
  align-items: center;
  display: grid;
  grid-gap: 1rem;
  grid-template: repeat(2, auto) / auto;
`;

const District = styled.path`
  cursor: pointer;
  fill: transparent;
  stroke: ${props => (props.active ? '#f7d' : 'transparent')};
  stroke-width: 2px;
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
  stateMapData,
  data,
  updateActiveState,
  scale,
  domain,
}) => {
  const { context } = useContext(MapContext);
  const canvasRef = useRef();
  const [activeDistrict, setActiveDistrict] = useState(
    Object.keys(data).filter(d => d !== 'average').length > 1 ? 1 : 0,
  );
  const xScale = 1200;
  const yScale = 800;

  const districtsFeatures = feature(
    stateMapData,
    stateMapData.objects[leadingZeroFIPS(id)],
  );

  let path = geoPath().projection(
    geoMercator().fitSize([xScale, yScale], districtsFeatures),
  );

  if (id === 2 || id === 15) {
    path = geoPath().projection(
      geoAlbersUsa().fitSize([xScale, yScale], districtsFeatures),
    );
  }

  useEffect(() => {
    let canvas = canvasRef.current;
    let drawingContext = canvas.getContext('2d');
    path.context(drawingContext);
    // drawingContext.clip(path(feature(us, us.objects.land)));
    drawingContext.imageSmoothingEnabled = false;

    // reset canvas to blank to prevent bleeding through of old border colors
    drawingContext.fillStyle = 'white';
    drawingContext.fillRect(0, 0, xScale, yScale);

    districtsFeatures.features.forEach(d => {
      const districtId = `d${+d.properties.district}`;
      const districtData = data[districtId];
      if (data[districtId]) {
        drawingContext.beginPath();
        path(path(d));
        drawingContext.fillStyle = districtData
          ? colorize(showSumOfPolicies(districtData, context), domain)
          : '#888';
        drawingContext.fill();
        drawingContext.strokeStyle = districtData ? '#fff' : '#888';
        drawingContext.lineWidth = 1;
        drawingContext.stroke();
        drawingContext.closePath();
      }
    });
  }, [path, canvasRef, context]);

  const districtShapes = districtsFeatures.features.map(d => {
    const districtId = +d.properties.district;
    const districtData = data[`d${districtId}`];
    if (districtData) {
      return (
        <District
          d={path(d)}
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

  return (
    <>
      <Container>
        <MapContainer>
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
          <canvas
            width={xScale}
            height={yScale}
            id="us-canvas"
            ref={canvasRef}
            style={{ width: '100%' }}
          ></canvas>
        </MapContainer>
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
  );
};

export default StateMap;
