/**
 * Main App Component
 * Root component that sets up Redux provider and routing
 */

import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import Board from './features/board/Board';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <Board />
    </Provider>
  );
}

export default App;
