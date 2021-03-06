'use strict';

var React = require('react/addons');

require('styles/FeatureDetail.css');


import { Col, Button, Alert, Panel } from'react-bootstrap';
import { State, Route, DefaultRoute, Redirect, RouteHandler, Link, DefaultRoute } from 'react-router';


var FeatureDetailToolBar = require('./FeatureDetailToolBar');

var FeatureDetail = React.createClass({
  componentDidMount () {
      console.log('Mounted');
  },
  render: function () {    
    return (
        <div>
          <Col xs={12}>{ <this.props.toolBar/>}</Col>
          <Col xs={12}>
          <Panel>
          	<RouteHandler state={this.props.state}/>
          </Panel>
          </Col>
        </div>
      );
  }
});

module.exports = FeatureDetail; 

