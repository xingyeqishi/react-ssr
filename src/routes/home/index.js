import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';

const page = {
    chunks: ['home'],
    title: 'Home',
    keywords: 'Keyword',
    description: 'desc',
    path: '/',
    getComp: async function action(layoutData) {
        return [
            { ...layoutData, pageData: null },
            <Layout data={null}>
                <Home data={null} />
            </Layout>,
        ];
    },
};
export default page;
