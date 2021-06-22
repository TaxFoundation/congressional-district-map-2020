import React from 'react';
import styled from 'styled-components';
import { colorize, formatter } from '../helpers';

const LegendContainer = styled.div`
  margin-bottom: 1rem;
`;

const LegendTextContainer = styled.div`
  align-items: end;
  display: grid;
  grid-template-columns: minmax(80px, 20%) 1fr minmax(80px, 20%);
`;

const StyledLegendText = styled.p`
  font-size: 14px;
  line-height: 1.2;
  margin: 0;
  /* padding: 0 0 15px 0; */
  text-align: ${props => props.textAlign};
`;

const LegendBar = styled.div`
  display: flex;
  height: 25px;
  position: relative;
`;

const LegendStop = styled.div`
  background-color: ${props => colorize(props.step, [0, props.steps])};
  flex: 1;
  height: 100%;
`;

const LegendText = ({ align, value }) => {
  return value === 0 ? (
    <StyledLegendText textAlign={align}>
      No Change<br />In Taxes<br /><span style={{color: '#0094ff'}}>▾</span>
    </StyledLegendText>
  ) : (
    <StyledLegendText textAlign={align}>
      {formatter(Math.abs(value), '$')} or More
      <br />
      Tax {value < 0 ? 'Cut' : 'Increase'}
      <br />
      <span style={{color: '#0094ff'}}>▾</span>
    </StyledLegendText>
  );
};

const Legend = ({ domain, steps }) => {
  return (
    <LegendContainer steps={steps}>
      <LegendTextContainer>
        <LegendText align="left" value={domain[0]} />
        <LegendText align="center" value={0} />
        <LegendText align="right" value={domain[1]} />
      </LegendTextContainer>
      <LegendBar>
        {[...Array(steps).keys()].map(k => (
          <LegendStop key={`legend-${k}`} steps={steps} step={k} />
        ))}
      </LegendBar>
    </LegendContainer>
  );
};

export default Legend;
