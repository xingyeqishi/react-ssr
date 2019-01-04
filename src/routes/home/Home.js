import React, {Component} from 'react';
if (process.env.BROWSER) {
  require('./home.scss');
}

class Home extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {data} = this.props;
    return <div className="home-container">
      home
    </div>
  }
};


export default Home;
