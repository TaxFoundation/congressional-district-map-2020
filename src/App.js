import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';

import { MapContext, StateProvider } from './context';
import { getData } from './helpers';
import USMap from './components/USMap';
// import StateMap from './components/StateMap';

import Navigation from './components/Navigation';
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
  const [us, setUS] = useState(JSON.parse(localStorage.getItem('us')) || null);
  const [districts, setDistricts] = useState(
    JSON.parse(localStorage.getItem('districts')) || null,
  );
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem('data')) || null,
  );
  const { context } = useContext(MapContext);

  const domain = [-1000, 1000];
  const scale = 780;
  const xScale = 600;
  const yScale = 400;

  useEffect(() => {
    if (!us) getData('us', setUS);
    if (!districts) getData('districts', setDistricts);
    if (!data) getData('data', setData);
  }, []);

  return (
    data && (
      <AppWrapper className="App">
        <Navigation
          years={Object.keys(data['1'].data).map(
            yearString => yearString.match(/\d+/)[0],
          )}
        />
        <Legend domain={domain} steps={19} />
        {context.activeState ? (
          ''
        ) : (
          <USMap
            us={us}
            districts={districts}
            data={data}
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
