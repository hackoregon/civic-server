import React from 'react';

const Story = ({ match }) => (
  <div>
    <h2>Emergency Story: {match.params.storyId}</h2>
    <p>Fetch & show something from internal api associated with {match.params.collection || 'emergency'} {match.params.storyId}</p>
  </div>
);

export default Story;