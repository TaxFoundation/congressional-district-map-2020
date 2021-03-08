import chroma from 'chroma-js';
import { format } from 'd3-format';
import { useState, useEffect } from 'react';

export const colorize = (value, domain) => {
  return chroma
    .scale([
      '#5e4fa2',
      '#3288bd',
      '#66c2a5',
      '#abdda4',
      '#e6f598',
      '#fee08b',
      '#fdae61',
      '#f46d43',
      '#d53e4f',
      '#9e0142',
    ])
    .domain(domain)(value);
};

export const formatter = (number, type) => {
  if (type === '%') {
    return format('.1%')(number);
  } else if (type === '$' && number % 1 === 0) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(number);
  } else if (type === '$') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(number);
  } else if (type === ',') {
    return format(',.0f')(number);
  }
};

export const useData = path => {
  const [state, setState] = useState(JSON.parse(localStorage.getItem(path)));

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      if (!state) {
        try {
          const tfUrl = 'https://biden-plan-map-2021.netlify.app/';
          const url = `${
            process.env.REACT_APP_ENV === 'taxfoundation' ? tfUrl : ''
          }data/${path}.json`;
          const response = await fetch(url, { signal: abortController.signal });

          if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
          }

          const json = await response.json();
          localStorage.setItem(path, JSON.stringify(json));
          console.log(json);
          setState(json);
        } catch (e) {
          if (!abortController.signal.aborted) {
            console.error(e);
          }
        }
      }
    };
    fetchData();

    return () => {
      abortController.abort();
    };
  }, [path]);
  return state;
};
