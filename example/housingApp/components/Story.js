import React from 'react';

const Story = props => (
  <div>
    <h2>Housing Story: {props.match.params.storyId}</h2>
    <p>Fetch & show something from internal api associated with {props.match.params.collection || 'housing'} {props.match.params.storyId}</p>
  </div>
);

export default Story;