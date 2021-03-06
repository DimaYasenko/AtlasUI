'use strict';

/* Styles */
require('react-datagrid/index.css');
require('styles/AtlasGrid.css');

/* Dependencies */
import React from 'react/addons';
import DataGrid from 'react-datagrid';


var AtlasGrid = React.createClass({
	contextTypes: {
      onSelectionChange: React.PropTypes.func,
      selected: React.PropTypes.any
    },

	propTypes: {
		bottomToolBar: React.PropTypes.element,
		onRefresh: React.PropTypes.func
	},
	getDefaultProps: function() {
		return {
			bottomToolBar: null,
			onRefresh: () =>{},
			page: 1,
			count: 0,
			dataSource: [],
			totalCount: 0
		};
	},
	getInitialState: function() {
		return {
			selected: null
		};
	},
	componentDidMount: function() {
		var innerGrid = React.findDOMNode(this.refs.innerGrid);
		var loadMask = innerGrid.querySelector('.loadmask');
		var dataGrid = React.findDOMNode(this.refs.dataGrid);

		dataGrid.appendChild(loadMask);
		
		dataGrid.querySelector('svg[name=refresh]').addEventListener('click', this.props.onRefresh);

	},
	componentWillUnmount: function() {
		var dataGrid = React.findDOMNode(this.refs.dataGrid);

		dataGrid.querySelector('svg[name=refresh]').removeEventListener('click', this.props.onRefresh);

	},
 	render: function () {
 		var selectedId = this.state.selectedId,
 			selectedRecord = this.state.selectedRecord;

		var toolBar = this.props.bottomToolBar? React.cloneElement(this.props.bottomToolBar, {selectedRecord: selectedRecord })
												: (<span />); 		

		var onRefresh = (e) => { e.target.getAttribute('name') == 'refresh' && this.props.onRefresh()};

	 	return (<div 	className="AtlasGrid"
 						ref="dataGrid"
	 				 	style={this.props.style || {}}
	 				 	onClick={onRefresh}>
	 					
	 				<header className="AtlasGrid-Header"><h3>{this.props.title}</h3></header>
			 		<DataGrid 	className="AtlasGrid-Inner"
			 					
						 		ref="innerGrid"
						 		onSelectionChange={this.context.onSelectionChange}
						 		selected={this.context.selected}
						 		{...this.props}                
						        pagination={true}						        
						        pageSize={10}						        
						        paginationToolbarProps={{
						          showPageSize: false,
						          page: this.props.page,
						          minPage: 1,
						          maxPage: Math.floor(this.props.totalCount / 10) + 1,
						          dataSourceCount: this.props.totalCount
						        }}  
						        onColumnResize={this.onColumnResize}						        						                          
						        emptyText={'No records'}
						        style={{minHeight: 350, padding: 10}} />

			       {/*  <div className="AtlasGrid-Bottom-Toolbar">
			        	{toolBar }
		        	</div>
					*/ }
	        </div>);
	},
	
	// onSelection: function(newSelectedId, data) {		
	// 	console.log('selection');
	// 	console.log(data);
	//     this.setState({
	//     	selectedId: newSelectedId, 
	//     	selectedRecord: newSelectedId === null? null: data
	//     });
	// },
	onColumnResize: function(firstCol, firstSize, secondCol, secondSize){
	    firstCol.width = firstSize;
		this.setState({});
	},
	reload: function() {
		this.setState({ 
			selectedId: null,
			selectedRecord: null
		});
		this.refs.innerGrid.reload();
	}
});

module.exports = AtlasGrid;