import reduxCombineReducers from 'redux/lib/combineReducers';

export default function configureReducers(
  defaultReducers = {},
  asyncReducers = {},
  combineReducers = reduxCombineReducers,
) {
  return combineReducers({
    ...defaultReducers,
    ...asyncReducers,
  });
}