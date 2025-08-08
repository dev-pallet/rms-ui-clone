import './styles/global.css';
import { render } from 'react-dom';
import App from './App';
import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const containers = document.getElementById('app');
render(<App name="OriginApp" />, containers!);

if (process.env.NODE_ENV === 'development') {
  if (module['hot']) {
    module['hot'].accept();
  }
}
