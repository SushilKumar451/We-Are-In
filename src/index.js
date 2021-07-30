import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './redux/store';

// css
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-quill/dist/quill.snow.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'simple-line-icons/css/simple-line-icons.css';
import 'flag-icon-css/css/flag-icon.min.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './index.css';
import './scss/react.scss';
import 'bootstrap-social/bootstrap-social.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

// ========================================

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
