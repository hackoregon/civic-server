import React from 'react';
import { storeShape } from 'react-redux/lib/utils/PropTypes';

const getDisplayName = WrappedComponent => WrappedComponent.displayName || WrappedComponent.name || 'Component';

export default function injectReducer(reducer) {
  return function wrappedInjectedComponent(WrappedComponent) {
    class InjectedReducerComponent extends React.Component {
      constructor(props, context) {
        super(props);

        this.store = props.store || context.store;
        this.store.injectReducer(reducer);
      }

      render() {
        return <WrappedComponent {...this.props} {...this.context} />;
      }
    }

    InjectedReducerComponent.contextTypes = { store: storeShape };
    InjectedReducerComponent.propTypes = { store: storeShape };
    InjectedReducerComponent.displayName = `InjectedReducer(${getDisplayName(WrappedComponent)})`;

    return InjectedReducerComponent;
  };
}