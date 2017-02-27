import { LOCATION_CHANGE } from 'react-router-redux/lib/reducer';

const initialState = {
  locationBeforeTransitions: null,
};

export default function reactRouterRedux(state = initialState, action) {
  return action.type === LOCATION_CHANGE
    ? {
      ...state,
      locationBeforeTransitions: {
        ...action.payload,
        query: { ...action.payload.query },
      },
    }
    : state;
}