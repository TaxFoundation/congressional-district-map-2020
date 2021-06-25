import { createContext, useReducer } from 'react';

import policies from './data/policies.json';

const initialState = {
  year: 'y2022',
  PAYROLL: true,
  MARGINAL_RATE: true,
  PEASE_LIMIT: true,
  CAPITAL_GAINS_AND_DIVIDENDS: true,
  ITEMIZED_LIMIT: true,
  BUSINESS_DEDUCTION: true,
  CTC: true,
  CDCTC: true,
  HOMEBUYER_CREDIT: true,
  CORP_RATE_PER_FILER: true,
  GILTI_CHANGES_PER_FILER: true,
  REPEAL_FIDII_PER_FILER: true,
  BOOK_TAX_PER_FILER: true,
};

policies.forEach(policy => (initialState[policy.id] = true));

export const MapContext = createContext();

const mapReducer = (state, action) => {
  switch (action.id) {
    case 'UPDATE_YEAR':
      return { ...state, year: action.value };
    case 'TOGGLE_ALL_OFF':
      return toggleAll(state, false);
    case 'TOGGLE_ALL_ON':
      return toggleAll(state, true);
    case 'TOGGLE_PLAN':
      return { ...state, [action.plan]: !state[action.plan] };
  }
};

function toggleAll(state, toggle) {
  let changed = {};
  policies.forEach(policy => (changed[policy.id] = toggle));
  return { ...state, ...changed };
}

export const StateProvider = ({ children }) => {
  const [context, updateContext] = useReducer(mapReducer, initialState);
  return (
    <MapContext.Provider value={{ context, updateContext }}>
      {children}
    </MapContext.Provider>
  );
};
