import isClient from '../utils/isClient';

const errKey = isClient ? 'clientError' : 'serverError';

const UPDATE_META_TAGS = 'SERVER/GLOBAL/UPDATE_META_TAGS';
const UPDATE_ERROR_STATUS = 'SERVER/GLOBAL/UPDATE_ERROR_STATUS';

const initialState = {
  metaTags: {},
  hasInitialServerError: false,
  serverError: null,
  clientError: null,
};

const updateMetaTags = payload => function updateMetaTagsThunk(dispatch) {
  return new Promise((resolve) => {
    dispatch({ type: UPDATE_META_TAGS, payload });
    resolve();
  });
};

const updatePageTitle = title => updateMetaTags(title);

const updateErrorStatus = (payload = null) => ({ type: UPDATE_ERROR_STATUS, payload });

const clearErrorStatus = () => updateErrorStatus();

export default function globalAppStatusReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_META_TAGS:
      return {
        ...state,
        metaTags: {
          ...state.metaTags,
          ...action.payload,
        },
      };
    case UPDATE_ERROR_STATUS: {
      if (action.payload) {
        return {
          ...state,
          hasInitialServerError: !isClient,
          [errKey]: action.payload,
        };
      }
      return {
        ...state,
        [errKey]: false,
        hasInitialServerError: false,
      };
    }
    default: return state;
  }
}

export const globalActions = {
  updateMetaTags,
  updatePageTitle,
  updateErrorStatus,
  clearErrorStatus,
};