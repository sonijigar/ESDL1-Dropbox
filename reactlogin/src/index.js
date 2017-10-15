import React from 'react';
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App';

//ReactDOM.render(<App/>, document.getElementById('root'));


render((
    <BrowserRouter>
    <App />
    </BrowserRouter>
), document.getElementById('root'));
