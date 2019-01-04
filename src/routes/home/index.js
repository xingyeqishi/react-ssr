import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';

const page = {
  chunks: ['home'],
  title: 'Home',
  keywords: 'Keyword',
  description: 'desc',
  path: '/',
  getComp: async function action(redis, layoutData) {
    return [
      {...layoutData, pageData: null},
      <Layout data={}>
        <Home data={}/>
      </Layout>
    ];
  }
}
export default page;
