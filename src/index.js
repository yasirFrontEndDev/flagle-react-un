import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route ,HashRouter  } from 'react-router-dom';
import App from './App';
import HomePage from './components/HomePage';
import reportWebVitals from './reportWebVitals';
import UnlimitedMode from './UnlimitedMode';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/daily" element={<App />} />
        <Route path="/unlimited" element={<UnlimitedMode />} />

      </Routes>
    </HashRouter>,
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
