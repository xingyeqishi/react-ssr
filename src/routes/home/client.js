import React from 'react';
import {hydrate} from 'react-dom';
import Home from './Home.js';
import Layout from '../../components/Layout';

hydrate(
  <div>
    <Layout data={window.__PRELOADED_STATE__}>
      <Home data={window.__PRELOADED_STATE__.pageData}/>
    </Layout>
  </div>,
  document.getElementById('app'));
