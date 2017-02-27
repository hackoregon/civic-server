import { compose } from 'redux';
import { connect } from 'react-redux';
import routedAsyncComponent from './routedAsyncComponent';

export default function routedAsyncConnect(asyncActions, ...connectProps) {
  return compose(routedAsyncComponent(asyncActions), connect(...connectProps));
}