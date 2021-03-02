import React, { Component } from 'react';
import styled from 'styled-components';

import { StateProvider } from './context';
import USMap from './components/USMap';
// import StateMap from './components/StateMap';
import us from './data/us.json';
import districts from './data/us-congress-113.json';
import data from './data/outputs/data.json';

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
  const domain = [-1000, 1000];
  const scale = 780;
  const xScale = 600;
  const yScale = 400;
  const years = Object.keys(data['1'].data).map(
    yearString => yearString.match(/\d+/)[0],
  );

  return (
    <StateProvider>
      <AppWrapper className="App">
        <Navigation
          years={years}
          activeYear={2021}
          setActiveYear={e => {
            console.log(e);
          }}
        />
        <Legend domain={domain} steps={19} />
        <USMap
          us={us}
          districts={districts}
          data={data}
          domain={domain}
          scale={scale}
          xScale={xScale}
          yScale={yScale}
        />
      </AppWrapper>
    </StateProvider>
  );
};

export default App;
