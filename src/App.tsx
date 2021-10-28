import React from 'react';
import Authenticated from './components/graphql/Authenticated';
import Planner from './components/graphql/Planner';
import { vendors } from 'data/vendors';

const App: React.FC = () =>
  <Authenticated vendor={vendors.gitlab}>
    <Planner/>
  </Authenticated>;

export default App;

