// these could be compiled packages - the important part is exporting the routes
import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Story from './components/Story';
import AboutTeam from './components/AboutTeam';

const App = () => (
  typeof document !== 'undefined' && (
  <BrowserRouter>
    <div>
      <ul>
        <li><Link to="/civic/collection/housing/about">About Team</Link></li>
        <li><a href="/civic/collection/emergency/story/1">Emergency Story 1</a></li>
        <li><Link to="/civic/collection/emergency/story/2">Emergency Story 2</Link></li>
        <li><Link to="/civic/collection/housing/story/A">Housing Story A</Link></li>
        <li><Link to="/civic/collection/housing/story/B">Housing Story B</Link></li>
      </ul>
      <Switch>
        <Route path="/civic/collection/housing/about" component={AboutTeam} />
        <Route exact path="/civic/collection/housing/story/:storyId" component={Story} />
        <Route path="/civic/collection/:collection/story/:storyId" component={Story} />
      </Switch>
    </div>
  </BrowserRouter>)
);

export default App;
