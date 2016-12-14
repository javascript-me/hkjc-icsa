import React from 'react'
import Moment from 'moment'
import _ from 'underscore'
import PubSub from '../pubsub'

const emptyFn = () => {}
let tokenTriggerSearch = null
let tokenRemoveFilter = null
let tokenResetFilters = null

export default React.createClass({
	displayName: 'FilterPanel',
	propTypes: {
		triggerSearchTopic: React.PropTypes.string,
		resetFiltersTopic: React.PropTypes.string,
		removeOneFilterTopic: React.PropTypes.string,
		onReset: React.PropTypes.func,
		onSubmit: React.PropTypes.func,
		children: React.PropTypes.arrayOf(React.PropTypes.node).isRequired
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
			originFilters: {},
			filterHandles: {},
			columnCount: 0
		}
	},
	componentDidMount: function () {
		this.initialFiltersAndLayoutInfo()
		this.initialComponentSubscription()
	},

	componentWillUnmount: function () {
		this.clearComponentSubscriptionWhenUnmount()
	},
	initialFiltersAndLayoutInfo: function () {
		let maxColumnCount = 0
		let panelOperateFn = row => {
			this.iterateChilren(row, this.getDefaultFilter)
			maxColumnCount = Math.max(maxColumnCount, row.props.children.length)
		}

		this.iterateChilren(this, panelOperateFn)
		this.setState({
			columnCount: maxColumnCount
		})
	},
	initialComponentSubscription: function () {
		if(this.props.triggerSearchTopic) {
			tokenTriggerSearch = PubSub.subscribe(PubSub[this.props.triggerSearchTopic], () => {
				this.handleSubmit()
			})
		}

		if(this.props.removeOneFilterTopic) {
			tokenRemoveFilter = PubSub.subscribe(PubSub[this.props.removeOneFilterTopic], (topic, publicFilters) => {
				let filters = this.state.filters
				let originFilters = this.state.originFilters
				let filterHandles = this.state.filterHandles
				let filterNames = publicFilters.name.split(',')
				let resetHandle

				filterNames.forEach((filterName) => {
					if (!filters[filterName]) {
						return false
					}

					filters[filterName] = originFilters[filterName]
					resetHandle = filterHandles[filterName] ? filterHandles[filterName].reset : undefined

					if (typeof resetHandle === 'function') {
						resetHandle()
					}
				})

				this.setState({
					filters: filters
				})
			})
		}

		if(this.props.resetFiltersTopic) {
			tokenResetFilters = PubSub.subscribe(PubSub[this.props.resetFiltersTopic], () => {
				this.handleReset()
			})
		}
	},
	clearComponentSubscriptionWhenUnmount: function () {
		tokenTriggerSearch && PubSub.unsubscribe(tokenTriggerSearch)
		tokenRemoveFilter && PubSub.unsubscribe(tokenRemoveFilter)
		tokenResetFilters && PubSub.unsubscribe(tokenResetFilters)
	},
	iterateChilren: function (parent, operationFn) {
		React.Children.forEach(parent.props.children, operationFn)
	},
	getDefaultFilter: function (column) {
		let filters = this.state.filters
		let filterName = column.props.filterName
		let filterValue = column.props.filterValue

		if (this.existsDuplicateFilterName(filters, filterName)) {
			throw new Error(
				`Duplicate filter name ${filterName} supplied to filter-panel. Please keep every filter name is unique.`
			)
		}

		filters[filterName] = {
			value: filterValue,
			defaultValue: filterValue,
			isValid: true
		}

		this.setState({
			filters: filters,
			originFilters: _.clone(filters)
		})
	},
	existsDuplicateFilterName: function (filters, oneFilterName) {
		return typeof filters[oneFilterName] !== 'undefined'
	},
	handleReset: function () {
		this.triggerColumnResetHandles()
		this.props.onReset()

		this.setState({
			filters: _.clone(this.state.originFilters),
			hasError: false
		})
	},
	handleSubmit: function () {
		let hasError
		let wrappedFilterToSubmitFormat

		// Step 1 reset state.hasError and set hasClickedSubmit to true
		this.preSubmit()

		// Step 2 check any error or not
		hasError = this.checkDoesAnyFilterInvalid()

		this.setState({
			hasError: hasError
		})

		if (hasError) {
			this.triggerColumnShowWarningHandles()
		} else {
			// Step 3 if no error, call the onSubmit event and provide state.filters
			wrappedFilterToSubmitFormat = this.wrapFilterToSubmitFormat()
			this.props.onSubmit(wrappedFilterToSubmitFormat)
		}
	},
	preSubmit: function () {
		this.setState({
			hasClickedSubmit: true,
			hasError: false
		})
	},
	checkDoesAnyFilterInvalid: function () {
		let filters = this.state.filters

		for (let filterName in filters) {
			if (!filters[filterName].isValid) {
				return true
			}
		}

		return false
	},
	wrapFilterToSubmitFormat: function () {
		let filters = this.state.filters
		let wrappedFilters = {}

		for (let filterName in filters) {
			if (filters[filterName].value) {
				wrappedFilters[filterName] = filters[filterName].value
			}
		}

		return wrappedFilters
	},
	triggerColumnResetHandles: function () {
		this.triggerColumnHandles('reset')
	},
	triggerColumnShowWarningHandles: function () {
		this.triggerColumnHandles('showWarning')
	},
	triggerColumnHandles: function (handleName) {
		let filterHandles = this.state.filterHandles

		for (let filterName in filterHandles) {
			let handle = filterHandles[filterName][handleName]

			if (typeof handle === 'function') {
				handle()
			}
		}
	},
	changeFilter: function (name, value, isValid) {
		let filters = this.state.filters

		filters[name] = {
			value: value,
			isValid: isValid
		}

		this.setState({
			filters: filters
		})
	},
	doPairingVerifyForFilter: function (srcFilterValue, ctrlType, pairingVerify) {
		let isValid = true
		let operation
		let partners
		let me = this

		if (pairingVerify && pairingVerify.length) {
			pairingVerify.every((verifyRule, index) => {
				operation = verifyRule.operation
				partners = verifyRule.partners || []

				partners.every((partner) => {
					isValid = me.pairingVerifyWithOneAnotherFilter(ctrlType, srcFilterValue, operation, partner)

					return isValid
				})
				return isValid
			})
		}

		return isValid
	},
	pairingVerifyWithOneAnotherFilter: function (ctrlType, srcFilterValue, operation, destFilterName) {
		let isValid = true
		let destFilter = this.state.filters[destFilterName]
		let destFilterHandles = this.state.filterHandles[destFilterName] || {}
		let destFilterValue
		let destSetValidHandle

		if (!destFilter) {
			throw new Error(
				`In filter-panel component, could not find destination filter when doing pairing verify, the destination filter name is ${destFilterName}.`
			)
		}

		destFilterValue = destFilter.value
		destSetValidHandle = destFilterHandles.setValid

		srcFilterValue = ctrlType === 'calendar' ? Moment(srcFilterValue, 'DD MMM YYYY HH:mm').valueOf() : srcFilterValue
		destFilterValue = ctrlType === 'calendar' ? Moment(destFilterValue, 'DD MMM YYYY HH:mm').valueOf() : destFilterValue

		switch (operation) {
		case '>':
			isValid = srcFilterValue > destFilterValue
			break
		case '>=':
			isValid = srcFilterValue >= destFilterValue
			break
		case '==':
			isValid = srcFilterValue === destFilterValue
			break
		case '<=':
			isValid = srcFilterValue <= destFilterValue
			break
		case '<':
			isValid = srcFilterValue < destFilterValue
			break
		default:
			break
		}

		if (!isValid && typeof destSetValidHandle === 'function') {
			destSetValidHandle(isValid)
		}

		return isValid
	},
	registerColumnHandles: function (name, resetHandle = emptyFn, setValidHandle = emptyFn, showWarning = emptyFn) {
		let filterHandles = this.state.filterHandles

		filterHandles[name] = filterHandles[name] || {}
		filterHandles[name].reset = resetHandle
		filterHandles[name].setValid = setValidHandle
		filterHandles[name].showWarning = showWarning

		this.setState({
			filterHandles: filterHandles
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
			(row, index) => React.cloneElement(row, {
				key: index,
				changeFilter: this.changeFilter,
				doPairingVerifyForFilter: this.doPairingVerifyForFilter,
				registerColumnHandles: this.registerColumnHandles
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
