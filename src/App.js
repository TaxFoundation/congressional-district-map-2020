import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';

import { MapContext, StateProvider } from './context';
import { useData, useQueryParams } from './helpers';
import USMap from './components/USMap';
import StateMap from './components/StateMap';

import Navigation from './components/navigation/Navigation';
import Legend from './components/Legend';

const AppWrapper = styled.div`
  color: #333;
  font-family: 'Lato', sans-serif;
  margin: 0 auto;
  max-width: 1024px;

  * {
    box-sizing: border-box;
  }
`;

const App = () => {
  const us = useData('us/us');
  const districts = useData('us/districts');
  const data = useData('tax/data');
  const [activeState, setActiveState] = useQueryParams('state', null);
  const { context } = useContext(MapContext);

  const domain = [-1000, 1000];
  const scale = 780;
  const xScale = 600;
  const yScale = 400;

  return (
    us &&
    districts &&
    data && (
      <AppWrapper className="App">
        <Navigation
          years={Object.keys(data['1'].data).map(
            yearString => yearString.match(/\d+/)[0],
          )}
          activeState={activeState}
          setActiveState={setActiveState}
        />
        <Legend domain={domain} steps={19} />
        {activeState ? (
          <StateMap
            id={activeState}
            data={data[activeState].data[context.year]}
            updateActiveState={setActiveState}
            domain={domain}
            scale={scale}
            xScale={xScale}
            yScale={yScale}
          />
        ) : (
          <USMap
            us={us}
            districts={districts}
            data={data}
            updateActiveState={setActiveState}
            domain={domain}
            scale={scale}
            xScale={xScale}
            yScale={yScale}
          />
        )}
      </AppWrapper>
    )
  );
};

export default () => (
  <StateProvider>
    <App />
  </StateProvider>
);
