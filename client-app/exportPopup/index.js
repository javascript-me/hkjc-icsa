import React from 'react'

const formats = { PDF: 'pdf', CSV: 'csv' }

export default React.createClass({
	displayName: 'ExportPopup',
	propTypes: {
		onChange: React.PropTypes.func
	},
	getInitialState () {
		return { format: formats.PDF }
	},
	onFormatChange (e) {
		
	},
	changeFormat(e){
		this.setState({ format: e.currentTarget.attributes["value"].nodeValue }) 

		if (this.props.onChange) {
			this.props.onChange(e.currentTarget.attributes["value"].nodeValue)
		}
	},
	render () {
		return (
			<div className='form-group export-content'>
				<span className='format-label'>Formats:</span>
				<span className='radio-inline' onClick={this.changeFormat} value={formats.PDF}>
					<input id='pdf' name='format' type='radio' value={formats.PDF} checked={this.state.format === formats.PDF}  />
					PDF File
				</span>
				<span className='radio-inline' onClick={this.changeFormat} value={formats.CSV}>
					<input id='csv' name='format' type='radio' value={formats.CSV} checked={this.state.format === formats.CSV} />
					CSV File
				</span>
			</div>
				)
	}
})

