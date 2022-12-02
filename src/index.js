import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import registerServiceWorker from "./registerServiceWorker";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./components/Home"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);
registerServiceWorker();
