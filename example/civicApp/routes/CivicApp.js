import React, { PropTypes } from 'react';
import Header from '@hackoregon/component-library/lib/Navigation/Header';

const App = ({ children }) => {
  // if using the dist version use it like below example for dynamic import
  // const { Header } = typeof window !== 'undefined' ? require('@hackoregon/component-library/dist') : { Header: () => null };
  const navItems = [
    { name: 'Collections', path: '/civic/collections' },
    { name: 'About', path: '/civic/about' },
    { name: 'Explore', path: '/civic/explore' },
  ];
  return (
    <div>
      <Header title="Civic" menu={navItems} />
      {children}
    </div>);
};

App.propTypes = {
  children: PropTypes.node,
};

export default App;
