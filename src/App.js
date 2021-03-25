import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';

import { MapContext, StateProvider } from './context';
import { fetchData, leadingZeroFIPS, useQueryParams } from './helpers';
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
  const [us, setUs] = useState(null);
  const [stateMap, setStateMap] = useState(null);
  const [districts, setDistricts] = useState(null);
  const [data, setData] = useState(null);
  const [activeState, setActiveState] = useQueryParams('state', 0);
  const { context } = useContext(MapContext);

  const domain = [-1000, 1000];
  const scale = 780;

  useEffect(async () => {
    const usData = await fetchData('us/us');
    const districtsData = await fetchData('us/districts');
    const theData = await fetchData('tax/data');

    setUs(usData);
    setDistricts(districtsData);
    setData(theData);
  }, []);

  useEffect(async () => {
    if (activeState > 0) {
      const stateMapData = await fetchData(
        `states/${leadingZeroFIPS(activeState)}`,
      );
      setStateMap(stateMapData);
    } else {
      setStateMap(null);
    }
  }, [activeState]);

  console.log(stateMap);

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
          stateMap?.objects[leadingZeroFIPS(activeState)] ? (
            <StateMap
              id={activeState}
              stateMapData={stateMap}
              data={data[activeState].data[context.year]}
              updateActiveState={setActiveState}
              domain={domain}
              scale={scale}
            />
          ) : null
        ) : (
          <USMap
            us={us}
            districts={districts}
            data={data}
            updateActiveState={setActiveState}
            domain={domain}
            scale={scale}
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
