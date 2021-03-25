import { createContext, useReducer } from 'react';

const initialState = {
  year: 'y2021',
  PAYROLL: true,
  MARGINAL_RATE: true,
  PEASE_LIMIT: true,
  CAPITAL_GAINS_AND_DIVIDENDS: true,
  ITEMIZED_LIMIT: true,
  BUSINESS_DEDUCTION: true,
  CTC: true,
  CDCTC: true,
  HOMEBUYER_CREDIT: true,
};

export const MapContext = createContext();

const mapReducer = (state, action) => {
  switch (action.id) {
    case 'UPDATE_YEAR':
      return { ...state, year: action.value };
    case 'TOGGLE_PAYROLL':
      return { ...state, PAYROLL: !state.PAYROLL };
    case 'TOGGLE_MARGINAL_RATE':
      return { ...state, MARGINAL_RATE: !state.MARGINAL_RATE };
    case 'TOGGLE_PEASE_LIMIT':
      return { ...state, PEASE_LIMIT: !state.PEASE_LIMIT };
    case 'TOGGLE_CAPITAL_GAINS_AND_DIVIDENDS':
      return {
        ...state,
        CAPITAL_GAINS_AND_DIVIDENDS: !state.CAPITAL_GAINS_AND_DIVIDENDS,
      };
    case 'TOGGLE_ITEMIZED_LIMIT':
      return { ...state, ITEMIZED_LIMIT: !state.ITEMIZED_LIMIT };
    case 'TOGGLE_BUSINESS_DEDUCTION':
      return { ...state, BUSINESS_DEDUCTION: !state.BUSINESS_DEDUCTION };
    case 'TOGGLE_CTC':
      return { ...state, CTC: !state.CTC };
    case 'TOGGLE_CDCTC':
      return { ...state, CDCTC: !state.CDCTC };
    case 'TOGGLE_HOMEBUYER_CREDIT':
      return { ...state, HOMEBUYER_CREDIT: !state.HOMEBUYER_CREDIT };
  }
};

export const StateProvider = ({ children }) => {
  const [context, updateContext] = useReducer(mapReducer, initialState);
  return (
    <MapContext.Provider value={{ context, updateContext }}>
      {children}
    </MapContext.Provider>
  );
};
