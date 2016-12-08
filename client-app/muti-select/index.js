import React, {Component} from 'react'
import classnames from 'classnames'
import _ from 'lodash'

class MutiSelect extends Component {
	constructor (props) {
		super(props)
		this.state = {
			isFocus: false,
			isAll: false,
			selectText: this.props.placeHolder || '请选择',
			selectedOption: this.props.options ? _.fill(Array(this.props.options.length), false) : []
		}
		this.onchange = this.onchange.bind(this)
	}
	render () {
		const { options } = this.props
		return (
			<div className='muti-select-box' style={this.props.style}>
				<div className='show-box' onClick={() => { this.toggleFocus() }}>{this.state.selectText}</div>
				<div className='content' style={{display: this.state.isFocus ? 'block' : 'none'}}>
					<div onClick={() => { this.toggleAll() }} className='option'>
						<input type='checkbox' checked={this.state.isAll} />
						All
					</div>
					{options && options.map((item, idx) => (<div key={item.label} className={classnames('option', {selected: this.state.selectedOption[idx]})} onClick={() => { this.handleOptionselect(idx) }}>
						<input type='checkbox' checked={this.state.selectedOption[idx]} />
						{item.label}
					</div>))}
				</div>
			</div>
		)
	}
	toggleFocus () {
		this.setState({isFocus: !this.state.isFocus})
	}
	handleOptionselect (idx) {
		let chagedOptions = this.state.selectedOption.map((item, index) => (index === idx ? !item : item))
		let selectText = chagedOptions.map((item, index) => (item ? this.props.options[index].label : null)).join(' ')
		selectText = selectText.trim() === '' ? (this.props.placeHolder || '请选择') : selectText
		this.setState({selectedOption: chagedOptions, isAll: false, selectText: selectText}, this.onchange)
	}
	toggleAll () {
		let chagedOptions = _.fill(Array(this.props.options.length), !this.state.isAll)
		let changedText = this.state.isAll ? this.props.placeHolder || '请选择' : 'All'
		this.setState({selectedOption: chagedOptions, isAll: !this.state.isAll, selectText: changedText}, this.onchange)
	}
	onchange () {
		const result = []
		_.forEach(this.state.selectedOption, (item, idx) => { item && result.push(idx) })
		this.props.onChange && this.props.onChange(result)
	}
}

MutiSelect.propTypes = {
	options: React.PropTypes.array, // like [{label:'aaa',value:1},{label:'bbb',value:2}]
	placeHolder: React.PropTypes.string,
	onChange: React.PropTypes.func, // like (result) => {dosth(result)} ,result is array of selected option's index [0,2,5]
	style: React.PropTypes.object // object custom the width and height...
}

export default MutiSelect
