import React from 'react'

const emptyFn = () => {}

export default React.createClass({
	displayName: 'FilterPanel',
	propTypes: {
		onReset: React.PropTypes.func,
		onSubmit: React.PropTypes.func
	},
	getDefaultProps: function () {
		return {
			onReset: emptyFn,
			onSubmit: emptyFn
		}
	},
	getInitialState () {
		return {
			hasError: false,
			displayFiltersCache: {},
			submittedFilters: {}
		}
	},
	componentDidMount: function () {
	},

	componentWillUnmount: function () {

	},
	handleReset: function (e) {
		this.props.onReset()
	},
	handleSubmit: function (e) {
		this.preSubmit()

		React.Children.forEach(this.props.children, this.iterationRows)

		if (this.state.hasError) {
			this.resetDisplayFilterCache()
		} else {
			this.setState({
				submittedFilters: this.state.displayFiltersCache
			})

			this.props.onSubmit(this.state.displayFiltersCache)
		}
	},
	iterationRows: function (row) {
		React.Children.forEach(row.props.children, this.iterationColumns)
	},
	iterationColumns: function (column) {
		if (column.props.hasError) {
			this.setState({
				hasError: column.hasError
			})
			return false
		}

		let filters = this.state.displayFiltersCache

		filters[column.props.filterName] = column.props.filterValue

		this.setState({
			displayFiltersCache: filters
		})
	},
	preSubmit: function () {
		this.setState({
			hasError: false,
			displayFiltersCache: {}
		})
	},
	resetDisplayFilterCache: function () {
		this.setState({
			displayFiltersCache: {}
		})
	},
	renderTipsText: function () {
		if (this.state.hasError) {
			return <span className='color-red'>* Invalid fields are highlighted in red</span>
		} else {
			return <span className='color-blue'>* These fields are mandatory</span>
		}
	},
	render: function () {
		return <div className='filter-panel'>
			<div className='container-fluid pd-w10'>
				{this.props.children}
				<div className='pannel-footer'>
					<div className='item-text'>{this.renderTipsText()}</div>
					<div className='item-after'>
						<button type='button' className='btn btn-link' onClick={this.handleReset}>Reset</button>
						<button type='button' className='btn btn-primary' onClick={this.handleSubmit}>Search</button>
					</div>
				</div>
			</div>
		</div>
	}
})

