import React from 'react';
import ReactDOM from 'react-dom';
import Perfil from './pages/Perfil';
import { store } from './store/store'
import { StoreProvider } from 'easy-peasy';

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <Perfil />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

