import React from 'react'
import classNames from 'classnames'

const formats = { PDF: 'pdf', CSV: 'csv'}

export default React.createClass({
	displayName: 'ExportPopup',
	getInitialState () {
		return { format: formats.PDF }
	},
	onFormatChange (e) {
		this.setState({
			format: e.currentTarget.value
		})

		if (this.props.onChange) {
			this.props.onChange(e.currentTarget.value)
		}
	},
	render () {
		return (<div className='form-group export-content'>
                    <span className='format-label' htmlFor='format'>Formats:</span>
                    <span className='radio-inline' onClick={() => this.setState({ format: formats.PDF })}>
                        <input checked='checked' ref='pdf' id='pdf' name='format' type='radio' value={formats.PDF} checked={this.state.format === formats.PDF} onChange={this.onFormatChange} />
                        PDF File
                    </span>
                    <span className='radio-inline' onClick={() => this.setState({ format: formats.CSV })}>
                        <input id='csv' ref='csv' name='format' type='radio' value={formats.CSV} checked={this.state.format === formats.CSV} onChange={this.onFormatChange} />
                        CSV File
                    </span>
                </div>
                )
	}
})

