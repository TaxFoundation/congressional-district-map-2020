import chroma from 'chroma-js';
import { format } from 'd3-format';
import { useState, useEffect } from 'react';

import policies from './data/policies.json';

export const showSumOfPolicies = (district, context) => {
  return policies.reduce((acc, policy) => {
    if (context[policy.id]) {
      return (acc += district[policy.shorthand]);
    }
    return (acc += 0);
  }, 0);
};

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

export const leadingZeroFIPS = id => {
  return id < 10 ? '0' + id : id;
};

export const fetchData = async path => {
  try {
    // const tfUrl = 'https://biden-plan-map-2021.netlify.app/';
    // const url = `${
    //   process.env.REACT_APP_ENV === 'taxfoundation' ? tfUrl : ''
    // }data/${path}.json`;
    const url = `data/${path}.json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    return json;
  } catch (e) {
    console.error(e);
  }
};

const getQuery = () => {
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search);
  }
  return new URLSearchParams();
};

const getQueryStringValue = key => getQuery().get(key);

export const useQueryParams = (key, defaultVal) => {
  const [query, setQuery] = useState(getQueryStringValue(key) || defaultVal);

  const updateUrl = newVal => {
    setQuery(newVal);

    const query = getQuery();

    if (!Number.isNaN(newVal) && newVal !== 0) {
      query.set(key, newVal);
    } else {
      query.delete(key);
    }

    // This check is necessary if using the hook with Gatsby
    if (typeof window !== 'undefined') {
      const { protocol, pathname, host } = window.location;
      const newUrl = `${protocol}//${host}${pathname}?${query.toString()}`;
      window.history.pushState({}, '', newUrl);
    }
  };

  return [query, updateUrl];
};
