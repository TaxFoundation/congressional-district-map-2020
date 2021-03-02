import React, { Fragment } from 'react';
import styled from 'styled-components';
import { colorize, formatter } from '../helpers';

const LegendContainer = styled.div`
  display: grid;
  grid-template: auto / minmax(80px, 20%) repeat(${props => props.steps}, 1fr) minmax(
      80px,
      20%
    );
  margin-bottom: 1rem;
`;

const LegendText = styled.p`
  font-size: 14px;
  margin: 0;
  padding: 0 15px;
  text-align: ${props => props.textAlign};
`;

const LegendStop = styled.div`
  background-color: ${props => colorize(props.step, [0, props.steps])};
  height: 100%;
`;

const Legend = props => (
  <LegendContainer steps={props.steps}>
    <LegendText textAlign="right">
      {props.domain[0] < 0 ? (
        <Fragment>
          {formatter(Math.abs(props.domain[0]), '$')} or More
          <br />
          Cut
        </Fragment>
      ) : props.domain[0] === 0 ? (
        <Fragment>
          No
          <br />
          Change
        </Fragment>
      ) : (
        <Fragment>
          {formatter(props.domain[0], '$')}
          <br />
          Increase
        </Fragment>
      )}
    </LegendText>
    {[...Array(props.steps).keys()].map(k => (
      <LegendStop key={`legend-${k}`} steps={props.steps} step={k} />
    ))}
    <LegendText textAlign="left">
      {`${formatter(props.domain[1], '$')} or More`}
      <br />
      Increase
    </LegendText>
  </LegendContainer>
);

export default Legend;
