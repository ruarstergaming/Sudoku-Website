import React from 'react';
import ReactDOMClient from 'react-dom/client';
import './styles/index.css';
import App from './components/App.js';
import reportWebVitals from './testing/reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css'; 
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

const root = ReactDOMClient.createRoot(document.getElementById('root'));

root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
