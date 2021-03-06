'use strict';

import React from 'react/addons';

require('styles/AtlasPivot.css');
require('styles/RedStyle.css');



import TransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import Router from 'react-router';
import { State, Route, DefaultRoute, Redirect, RouteHandler, Link, DefaultRoute } from 'react-router';

import PivotStore from '../stores/PivotStore';

import { Col, Button, ListGroup, ListGroupItem, TabbedArea, TabPane, Badge, Row, Modal, Input} from 'react-bootstrap';
import { NavItemLink, ButtonLink, MenuItemLink} from 'react-router-bootstrap';
import AtlasToolBar from 'components/AtlasToolBar';
import AtlasSideBar from 'components/AtlasSideBar';
import FeatureDetail from 'components/FeatureDetail';
import ThDetail from 'components/ThDetail';
// import JobBoard from './JobBoard';
import { partial, purify } from '../helpers/combinators';
import FeatureDetailToolBar from 'components/FeatureDetailToolBar';
import PivotActions from '../actions/PivotActions';
import JobOneByOne from 'components/JobOneByOne';

import LineChart from 'components/LineChart';
var mui = require('material-ui');
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
import {FlatButton} from 'material-ui';

var ThemeManager = new mui.Styles.ThemeManager();

import CustomerBoard from 'components/CustomerBoard';
import CustomerMain from 'components/CustomerMain';
import AccountGrid from 'components/AccountGrid';
import promises from '../helpers/promises';
import Flux from 'helpers/Flux';
import adminAPI from 'api/admin';

var key = 1;

var buttonClicks = Flux.store({
  count: 0
});

function state([buttonStore]) {
  return {
    count:  buttonStore.count
  };
}

var btnActions = {
  inc: function() {
    
    buttonClicks.set({
      count: buttonClicks.get().count + 1
    });

  },
  dec: function() {
    buttonClicks.set({
      count: buttonClicks.get().count - 1
    });
  }
};

var Component = React.createClass({
  mixins: [Flux.mixin([buttonClicks], state)],
  getInitialState: function() {
    return {
      test: 1
    };
  },  
  render: function() {
    return (<div>
        <span>{this.state.count}</span>
        <button onClick={btnActions.inc}>Inc</button>
        <button onClick={btnActions.dec}>Dec</button>
        </div>
    );
  }
});


function getPivotState() {
	return PivotStore.getAll();  
}

function randomValues () {
  var data = [];
  var k = Math.random() * 10;
  var c = Math.random() * 100;

  for (var i = 0; i < 500; i++) {
     data.push([i, Math.sin(i) * 2  + c]);
  }
  return data;
}
var AtlasPivot = React.createClass({
    childContextTypes: {
      muiTheme: React.PropTypes.object
    },

  getChildContext: function() {
      return {
        muiTheme: ThemeManager.getCurrentTheme()
      };
  },


	getInitialState: function() {
		return getPivotState();		
	},	
	componentDidMount: function() {
	    PivotStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
    	PivotStore.removeChangeListener(this._onChange);
  },
  render: function () {
    var data = [];
    for (var i = 0; i < 30; i++) {
      data.push({
        label: 'Test' + i,
        data: randomValues()
      });
    }

    

       
    return ( 
        <div className="AtlasPivot skin-red-light">         
          <div className="wrapper">
        	   <AtlasToolBar />
          	 <AtlasSideBar/>
             

             <div className="content-wrapper">
              <Component />
              <AccountGrid />
             
{/*
               <LineChart                   
                  data={data} 
                  key={0} 
                  title="WOB vs Depth" 
                  width={800}
                  xLabel="Depth"
                  yLabel="WOB"
                  />
  */}       
              	<Col xs={10}> 
                  <TransitionGroup component="div" transitionName="example">
                    <RouteHandler state={this.state} key={name}/>
                  </TransitionGroup>
              </Col>          
          
            </div>
            </div>
        </div>
      );
  },
  onCloseAdd: function() {
    this.setState({ showAdd: false});
  }, 
  onCloseEdit: function() {
    this.setState({ showEdit: false});
  },
  onEdit: function(record) {
    this.setState({ showEdit: true, label: record.label});
  },
  onAdd: function() {
    this.setState({showAdd: true});
  },
   _onChange: function() {
    	this.setState(getPivotState());
  }
});



var WellboreDetailToolbar = partial(FeatureDetailToolBar, 
    { 
      boardRouteName: 'wellboreBoard',
      oneByOneRouteName: 'wellboreOneByOne',
      listRouteName: 'wellboreList',      
    });

var WellboreDetail = partial(FeatureDetail, 
    {
      toolBar: WellboreDetailToolbar
    });


var WellboresBoard = purify(ThDetail, {
  items: s=> s.wellbores
});



var JobDetailToolbar = partial(FeatureDetailToolBar, 
    { 
      boardRouteName: 'jobBoard',
      oneByOneRouteName: 'jobOneByOne',
      listRouteName: 'jobList',      
    });

var JobDetail = partial(FeatureDetail, 
    {
      toolBar: JobDetailToolbar
    });


var JobBoard = purify(ThDetail, {
  items: s => s.jobs
});

var JobOneByOnePure = purify(JobOneByOne, {
  items: s => s.jobs,
  id: s => s.jobDetail.id,
  name: s => s.jobDetail.name,
  description: s => s.jobDetail.description
});

var MyText = React.createClass({
  getInitialState: function () {
      console.log('initial state');
      return null;
  },
  componentDidMount: function () {
      console.log('text was mounted');
  },
  render() {
    return (<div>MyText</div>);
  }
});


var MyText2 = React.createClass({
  getInitialState: function () {
      console.log('initial state2');
      return null;
  },
  componentDidMount: function () {
      console.log('text2 was mounted');
  },
  render() {
    return (<div><MyText/></div>);
  }
});

var prop = function(nm) { return obj => obj[nm]; };

var Wellbores = partial(MyText, {text: 'Wellbores'});

var PuryHello = purify(MyText, {text: s => s.helloText });

var state = {
  helloText: 'Hello world'
};

var Hello = partial(PuryHello, { state: state});

// ThemeManager.setTheme(ThemeManager.types.LIGHT);

var routes = (
  <Route name="root" handler={AtlasPivot} path="/">
    <Route name="jobs" path="/jobs/board" handler={JobDetail}>
      <Route name="jobBoard" path="/jobs/board" handler={JobBoard} myProp="test"></Route>
      <Route name="jobOneByOne" path="/jobs/oneByOne/:id?" handler={JobOneByOnePure}></Route>
      <Route name="jobList" path="/jobs/list" handler={Hello}></Route>
    </Route>  
    
    <Route name="wellbores" path="/wellbores/board" handler={WellboreDetail}>         
      <Route name="wellboreBoard" path="/wellbores/board" handler={WellboresBoard}></Route>
      <Route name="wellboreOneByOne" path="oneByOne" handler={JobBoard}></Route>
      <Route name="wellboreList" path="list" handler={JobBoard}></Route>     
    </Route>
    <Route name="customers" path="/customers/board" handler={CustomerBoard}>
      <Route name="customerBoard" path="/customers/board" handler={CustomerMain}/>
      <Route name="customerOneByOne" handler={Hello}/>
      <Route name="customerList" handler={Hello}/>
    </Route>
    <Route name="wellDesigner" path="/wellDesigner" handler={Hello}></Route>
    <Route name="tubingForces" path="/tubingForces" handler={Hello}></Route>
    <Route name="hydraulics" path="/hydraulics" handler={Hello}></Route>
    <Route name="tubingLifeTracking" path="/tubingLifeTracking" handler={Hello}></Route>
    <Route name="library" path="/library" handler={Hello}></Route>
    <Route name="toolRack" path="/toolRack" handler={Hello}></Route>
    <Route name="archive" path="/archive" handler={Hello}></Route>
  </Route>
);


Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  React.render(<Handler/>, document.body);
  var router = Router.match;

  var deepestRouteName = state.routes[state.routes.length - 1].name;
  var topLevelRouteName = state.routes[0].name;
  var allRouteNamesArray = state.routes.map(route => route.name);
  PivotActions.transition(deepestRouteName, state.params);

});


module.exports = AtlasPivot; 

