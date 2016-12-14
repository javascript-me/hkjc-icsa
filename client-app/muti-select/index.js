import React, {Component} from 'react'
import classnames from 'classnames'
import _ from 'lodash'

const defaultSelectText = 'Please Select ...'

class MutiSelect extends Component {
	constructor (props) {
		super(props)
		this.state = {
			isFocus: false,
			isAll: false,
			selectText: this.props.placeHolder || defaultSelectText,
			selectedOptionIndex: this.getInputSelectedOptionIndex(this.props.selectedOptions)
		}
		this.onchange = this.onchange.bind(this)
		this.pageClick = this.pageClick.bind(this)
	}
	render () {
		const { options } = this.props
		return (
			<div className='muti-select-box' style={this.props.style} ref='container'>
				<div className='show-box' onClick={() => { this.toggleFocus() }}>{this.state.selectText}</div>
				<div className='muti-select-content' style={{display: this.state.isFocus ? 'block' : 'none'}}>
					<div onClick={() => { this.toggleAll() }} className='option'>
						<input type='checkbox' checked={this.state.isAll} />
						All
					</div>
					{options && options.map((item, idx) => (<div key={item.label} className={classnames('option', {selected: this.state.selectedOptionIndex[idx]})} onClick={() => { this.handleOptionselect(idx) }}>
						<input type='checkbox' checked={this.state.selectedOptionIndex[idx]} />
						{item.label}
					</div>))}
				</div>
			</div>
		)
	}
	componentDidMount () {
		document.addEventListener('click', this.pageClick, false)
	}
	componentWillUnmont () {
		document.removeEventListener('click', this.pageClick, false)
	}
	getInputSelectedOptionIndex (selectedOptionsInput) {
		let selectedOptionIndex = _.fill(Array(this.props.options.length), false)

		if (selectedOptionsInput && selectedOptionsInput.length) {
			selectedOptionsInput.forEach(function (selectedOption) {
				this.props.options.forEach((dataSourceOption, index) => {
					if (dataSourceOption.value === selectedOption.value) {
						selectedOptionIndex[index] = true
					}
				})
			})
		}

		return selectedOptionIndex
	}
	setValue (selectedOptions) {
		this.setState({
			selectedOptionIndex: this.getInputSelectedOptionIndex(selectedOptions),
			selectText: this.getSelectText(selectedOptions)
		})
	}
	pageClick (e) {
		var source = e.target
		var found = false

		while (source.parentNode) {
			found = source === this.refs.container
			if (found) break
			source = source.parentNode
		}

		if (this.state.isFocus && !found) {
			this.toggleFocus()
		}
	}
	toggleFocus () {
		this.setState({isFocus: !this.state.isFocus})
	}
	handleOptionselect (idx) {
		let changedOptions = this.state.selectedOptionIndex

		changedOptions[idx] = !changedOptions[idx]

		let selectText = this.getSelectText(changedOptions)

		this.setState({selectedOptionIndex: changedOptions, isAll: false, selectText: selectText}, this.onchange)
	}
	getSelectText (selectedOptions) {
		let selectText = selectedOptions.map((item, index) => (item ? this.props.options[index].label : null)).join(' ')
		selectText = selectText.trim() === '' ? (this.props.placeHolder || defaultSelectText) : selectText

		return selectText
	}
	toggleAll () {
		let changedOptions = _.fill(Array(this.props.options.length), !this.state.isAll)
		let changedText = this.state.isAll ? this.props.placeHolder || defaultSelectText : 'All'
		this.setState({selectedOptionIndex: changedOptions, isAll: !this.state.isAll, selectText: changedText}, this.onchange)
	}
	onchange () {
		let result = []
		_.forEach(this.state.selectedOptionIndex, (item, idx) => {
			item && result.push(this.props.options[idx])
		})

		this.props.onChange && this.props.onChange(result)
	}
}

MutiSelect.propTypes = {
	options: React.PropTypes.array.isRequired, // like [{label:'aaa',value:1},{label:'bbb',value:2}]
	selectedOptions: React.PropTypes.array, // like [true, false, true, false], each 'true' element means the corresponding option is selected
	placeHolder: React.PropTypes.string,
	onChange: React.PropTypes.func, // like (result) => {dosth(result)} ,result is array of selected option's value [val1,val2...]
	style: React.PropTypes.object // object custom the width and height...
}

export default MutiSelect
