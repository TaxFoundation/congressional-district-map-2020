import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

import { MapContext } from '../context';
import { showSumOfPolicies, colorize, formatter } from '../helpers';
import MapContainer from './MapContainer';
import HoverContainer from './HoverContainer';
import { average } from 'chroma-js';

const State = styled.path`
  cursor: pointer;
  fill: transparent;
  stroke: #fff;
  stroke-width: 1.5;
  stroke-linejoin: bevel;

  &:hover {
    fill: rgba(255, 255, 255, 0.3);
    stroke-width: 2;
  }
`;

const hoverText = (name, info) => `
  <p style="text-align:center; border-bottom: 1px solid #ddd; padding-bottom: 9px; margin-bottom: 9px;"><strong>${name}</strong></p>
  <table><tbody>
  <tr style="background:transparent">
    <td style="border: none">Average Tax Change:</td>
    <td style="border: none; text-align: right;">${formatter(info, '$')}</td>
  </tr>
  </tbody></table>`;

const USMap = ({ us, districts, updateActiveState, scale, domain, data }) => {
  const { context } = useContext(MapContext);
  const canvasRef = useRef();
  const xScale = 1200;
  const yScale = 800;

  const path = geoPath().projection(
    geoAlbersUsa()
      .scale(scale)
      .translate([xScale / 2, yScale / 2 - 25]),
  );
  const districtsFeatures = feature(districts, districts.objects.layer)
    .features;

  useEffect(() => {
    let canvas = canvasRef.current;
    let drawingContext = canvas.getContext('2d');
    path.context(drawingContext);
    drawingContext.clip(path(feature(us, us.objects.land)));
    drawingContext.imageSmoothingEnabled = false;

    // reset canvas to blank to prevent bleeding through of old border colors
    drawingContext.fillStyle = 'white';
    drawingContext.fillRect(0, 0, xScale, yScale);

    districtsFeatures.forEach(d => {
      const stateId = +d.properties.state;
      const districtId = `d${+d.properties.district}`;
      let districtData;
      if (data[stateId]?.data[context?.year][districtId]) {
        districtData = data[stateId].data[context.year][districtId];

        drawingContext.beginPath();
        path(path(d));
        drawingContext.fillStyle = districtData
          ? colorize(showSumOfPolicies(districtData, context), domain)
          : '#888';
        drawingContext.fill();
        drawingContext.strokeStyle = districtData
          ? colorize(showSumOfPolicies(districtData, context), domain)
          : '#888';
        drawingContext.lineWidth = 1;
        drawingContext.stroke();
        drawingContext.closePath();
      }
    });
  }, [canvasRef, context]);

  const states = feature(us, us.objects.states).features.map(d => {
    const stateInfo = data[+d.id];
    let districtValues = null;
    if (stateInfo) {
      districtValues = Object.values(stateInfo.data[context.year]).map(d =>
        showSumOfPolicies(d, context),
      );
    }

    return (
      <State
        d={path(d)}
        data-tip={
          stateInfo
            ? hoverText(stateInfo.name, showSumOfPolicies(stateInfo.data[context.year].average, context))
            : null
        }
        data-for="usmap"
        data-html={true}
        key={`state-${d.id}`}
        onClick={() => {
          updateActiveState(+d.id);
        }}
      />
    );
  });

  return (
    <MapContainer>
      <svg width="100%" viewBox={`0 0 ${xScale} ${yScale}`}>
        <defs>
          <path id="land" d={path(feature(us, us.objects.land))} />
        </defs>
        <clipPath id="clip-land">
          <use xlinkHref="#land" />
        </clipPath>
        {/* <g clipPath="url(#clip-land)">{districtShapes}</g> */}
        <g>{states}</g>
      </svg>
      <canvas
        width={xScale}
        height={yScale}
        id="us-canvas"
        ref={canvasRef}
        style={{ width: '100%' }}
      ></canvas>
      <HoverContainer id="usmap" aria-haspopup="true" />
    </MapContainer>
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
