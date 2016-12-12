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
			hasClickedSubmit: false,
			hasError: false,
			filters: {},
			filterResetEvents: []
		}
	},
	componentDidMount: function () {
		React.Children.forEach(this.props.children, this.iterationRows(this.getDefaultFilter))
	},

	componentWillUnmount: function () {

	},
	iterationRows: function (columnOperateFn) {
		return row => { 
			React.Children.forEach(row.props.children, this.iterationColumns(columnOperateFn)) 
		}
	},
	iterationColumns: function (fn) {
		return column => {
			fn(column)
		}		
	},
	getDefaultFilter: function(column) {
		let filters = this.state.filters
		let filterName = column.props.filterName
		let filterValue = column.props.filterValue

		if(this.existsDuplicateFilterName(filters, filterName)) {
			throw new Error(
				'Duplicate filter name `' + filterName + '` supplied to' +
				' filter-panel. Please keep every filter name is unique.'
			);
		}

		filters[filterName] = {
			value: filterValue,
			defaultValue: filterValue,
			isValid: true
		}

		this.setState({
			filters: filters
		})
	},
	existsDuplicateFilterName: function(filters, oneFilterName) {
		return typeof filters[oneFilterName] !== 'undefined'
	},
	handleReset: function (e) {
		this.triggerColumnResetHandles();
		this.props.onReset();
	},
	triggerColumnResetHandles: function() {
		let resetHandles = this.state.filterResetEvents

		resetHandles.forEach(function(elem) {
			let handle = elem.handle

			handle()
		})
	},
	handleSubmit: function (e) {
		let hasError
		let wrapFilterToSubmitFormat

		// Step 1 reset state.hasError and set hasClickedSubmit to true
		this.preSubmit()

		// Step 2 check any error or not
		hasError = this.checkDoesAnyFilterInvalid()

		this.setState({
			hasError: hasError
		})

		if (!hasError) {
			// Step 3 if no error, call the onSubmit event and provide state.filters
			wrapFilterToSubmitFormat = this.wrapFilterToSubmitFormat()
			this.props.onSubmit(wrapFilterToSubmitFormat)			
		}
	},
	preSubmit: function () {
		this.setState({
			hasClickedSubmit: true,
			hasError: false
		})
	},
	checkDoesAnyFilterInvalid: function() {
		let filters = this.state.filters

		for(let filterName in filters) {
			if(!filters[filterName].isValid) {
				return true
			}
		}

		return false
	},
	wrapFilterToSubmitFormat: function() {
		let filters = this.state.filters
		let wrappedFilters = {}

		for(let filterName in filters) {
			wrappedFilters[filterName] = filters[filterName].value
		}

		return wrappedFilters
	},
	changeFilter: function(name, value, isValid) {
		let filters = this.state.filters

		filters[name] = {
			value: value,
			isValid: isValid
		}

		this.setState({
			filters: filters
		})
	},
	doPairingVerifyForFilter: function(srcFilterValue, pairingVerify) {
		let isValid = true
		let operation
		let partners

		if(pairingVerify && pairingVerify.length) {
			pairingVerify.every(function(verifyRule, index) {
				operation = verifyRule.operation
				partners = verifyRule.partners || []

				partners.every(function(partner) {
					isValid = isValid 
						&& this.pairingVerifyWithOneAnotherFilter(srcFilterValue, operation, partner)

					return isValid
				})
				return isValid
			})
		}

		return isValid
	},
	pairingVerifyWithOneAnotherFilter: function(srcFilterValue, operation, destFilterName) {
		let isValid = true
		let destFilterValue = this.state.filters[destFilterName]

		switch(operation) {
			case '>':
				isValid = srcFilterValue > destFilterName
				break
			case '>=':
				isValid = srcFilterValue >= destFilterName
				break
			case '==':
				isValid = srcFilterValue === destFilterName
				break
			case '<=':
				isValid = srcFilterValue <= destFilterName
				break
			case '<':
				isValid = srcFilterValue < destFilterName
				break
			default:
				break
		}

		return isValid
	},
	registerColumnResetHandles: function(name, handle = emptyFn) {
		let resetHandle = {
			name: name,
			handle: handle
		}
		let filterResetEvents = this.state.filterResetEvents

		filterResetEvents.push(resetHandle)

		this.setState({
			filterResetEvents: filterResetEvents
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
		let rows = React.Children.map(this.props.children,
			(row) => React.cloneElement(row, {
				changeFilter: this.changeFilter,
				doPairingVerifyForFilter: this.doPairingVerifyForFilter,				
				registerColumnResetHandles: this.registerColumnResetHandles
			})
		)

		return <div className='filter-panel'>
			<div className='container-fluid pd-w10'>
				{rows}
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

