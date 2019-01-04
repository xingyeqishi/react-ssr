import 'core-js/es6/map';
import 'core-js/es6/set';

import React, { Component, Fragment } from 'react';
import { ToastContainer, toast } from 'react-toastify';

if (process.env.BROWSER) {
    require('./index.scss');
}

class Layout extends Component {
    constructor() {
        super();
        this.state = {
            showBanner: true,
        };
    }
    render() {
        const { className } = this.props;
        return (
            <Fragment>
              Layout
            </Fragment>
        );
    }
}
export default Layout;
