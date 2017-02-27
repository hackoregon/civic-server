import React from 'react';
import isClient from '../utils/isClient';

export default function routedAsyncComponent(asyncActions, options = {}) {
  const { ignoreOnServer } = options;

  return function wrapWithAsyncActions(WrappedComponent) {
    if (isClient || ignoreOnServer) return WrappedComponent;

    return class RoutedAsyncComponent extends React.Component {
      static readyOnActions(...args) {
        return asyncActions(...args);
      }
      render() {
        return <WrappedComponent {...this.props} {...this.state} {...this.context} />;
      }
    };
  };
}