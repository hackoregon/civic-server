import React, { PropTypes } from 'react';
import Header from '@hackoregon/react-component-library/lib/Navigation/Header'; //eslint-disable-line

const App = ({ children }) => {
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
