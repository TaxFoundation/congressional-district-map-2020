import React from 'react';
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

const StyledLegendText = styled.p`
  font-size: 14px;
  line-height: 1.2;
  margin: 0;
  padding: 0 15px;
  text-align: ${props => props.textAlign};
`;

const LegendStop = styled.div`
  background-color: ${props => colorize(props.step, [0, props.steps])};
  height: 100%;
`;

const LegendText = ({ align, value }) => {
  return value === 0 ? (
    <StyledLegendText textAlign={align}>
      No
      <br />
      Change
    </StyledLegendText>
  ) : (
    <StyledLegendText textAlign={align}>
      {formatter(Math.abs(value), '$')} or More
      <br />
      Tax {value < 0 ? 'Cut' : 'Increase'}
    </StyledLegendText>
  );
};

const Legend = ({ domain, steps }) => {
  return (
    <LegendContainer steps={steps}>
      <LegendText align="right" value={domain[0]} />
      {[...Array(steps).keys()].map(k => (
        <LegendStop key={`legend-${k}`} steps={steps} step={k} />
      ))}
      <LegendText align="left" value={domain[1]} />
    </LegendContainer>
  );
};

export default Legend;
