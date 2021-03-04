import chroma from 'chroma-js';
import { format } from 'd3-format';

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

export const getData = async (path, setTheData) => {
  const cachedData = localStorage.getItem(path);

  const tfUrl = 'https://biden-plan-map-2021.netlify.app/';
  const response = await fetch(
    `${
      process.env.REACT_APP_ENV === 'taxfoundation' ? tfUrl : ''
    }data/${path}.json`,
  );
  const json = await response.json();
  localStorage.setItem(path, JSON.stringify(json));
  setTheData(json);
};
