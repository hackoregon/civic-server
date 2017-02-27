import React from 'react';
import Link from 'react-router/lib/Link';

const Collections = props => (
  <div>
    <h4>Collections</h4>
    <ul>
      {props.items.map(item => <li key={item.name}><Link to={item.path}>{item.name}</Link></li>)}
    </ul>
  </div>
);

export default Collections;